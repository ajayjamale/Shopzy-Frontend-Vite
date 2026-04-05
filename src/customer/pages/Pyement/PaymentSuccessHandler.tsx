import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";
import { clearCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessHandler = () => {
    const dispatch   = useAppDispatch();
    const location   = useLocation();
    const navigate   = useNavigate();

    // ── Only watch the specific flags we need — not the whole slice ──
    const { loading, paymentConfirmed, error } = useAppSelector(store => store.orders);
    const [show, setShow] = useState(false);
    const confirmedRef = useRef(false);

    const getParam = (key: string) =>
        new URLSearchParams(location.search).get(key);

    const paymentId     = getParam("razorpay_payment_id");
    const paymentLinkId = getParam("razorpay_payment_link_id");

    // Step 1: Confirm payment with backend when component mounts
    useEffect(() => {
        if (paymentId && !confirmedRef.current) {
            confirmedRef.current = true;
            dispatch(paymentSuccess({
                paymentId,
                paymentLinkId: paymentLinkId || "",
                jwt: localStorage.getItem("jwt") || "",
            }));
        }
    }, [paymentId]);

    // Step 2: Only AFTER payment is confirmed by backend — clear the cart
    useEffect(() => {
        if (paymentConfirmed) {
            dispatch(clearCart());                         // remove items from cart
            const t = setTimeout(() => setShow(true), 100); // trigger entrance animation
            return () => clearTimeout(t);
        }
    }, [paymentConfirmed]);

    return (
        <>
            <style>{`
                .psh-page {
                    min-height: 100vh;
                    background: #f5f6f8;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 32px 16px;
                    font-family: var(--font-body);
                }
                .psh-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .psh-spinner {
                    width: 48px; height: 48px;
                    border: 4px solid #e0e0e0;
                    border-top-color: #f4c24d;
                    border-radius: 50%;
                    animation: psh-spin 0.8s linear infinite;
                }
                @keyframes psh-spin { to { transform: rotate(360deg); } }
                .psh-loading-text { font-size: 15px; color: #555; }
                .psh-loading-dots::after {
                    content: '';
                    animation: psh-dots 1.4s steps(4, end) infinite;
                }
                @keyframes psh-dots {
                    0%   { content: ''; }
                    25%  { content: '.'; }
                    50%  { content: '..'; }
                    75%  { content: '...'; }
                }
                .psh-error-card {
                    background: #fff;
                    border: 1px solid #f5c6c6;
                    border-radius: 8px;
                    padding: 32px;
                    max-width: 420px;
                    text-align: center;
                }
                .psh-error-icon { font-size: 40px; margin-bottom: 12px; }
                .psh-error-title { font-size: 18px; font-weight: 700; color: #0F1111; margin: 0 0 8px; }
                .psh-error-msg { font-size: 13px; color: #888; margin: 0 0 20px; }
                .psh-card {
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 480px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
                .psh-card.visible { opacity: 1; transform: translateY(0); }
                .psh-bar { height: 5px; background: linear-gradient(to right, #007600, #00a650); }
                .psh-body {
                    padding: 36px 32px 28px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .psh-check-wrap { width: 72px; height: 72px; margin-bottom: 20px; }
                .psh-check-circle {
                    fill: none; stroke: #007600; stroke-width: 3;
                    stroke-dasharray: 166; stroke-dashoffset: 166;
                    stroke-linecap: round;
                    animation: psh-circle 0.6s 0.2s ease forwards;
                }
                .psh-check-tick {
                    fill: none; stroke: #007600; stroke-width: 3.5;
                    stroke-linecap: round; stroke-linejoin: round;
                    stroke-dasharray: 48; stroke-dashoffset: 48;
                    animation: psh-tick 0.4s 0.7s ease forwards;
                }
                @keyframes psh-circle { to { stroke-dashoffset: 0; } }
                @keyframes psh-tick   { to { stroke-dashoffset: 0; } }
                .psh-congrats { font-size: 22px; font-weight: 700; color: #0F1111; margin: 0 0 6px; }
                .psh-sub { font-size: 14px; color: #565959; margin: 0 0 6px; line-height: 1.5; }
                .psh-order-id { font-size: 12px; color: #888; margin: 0 0 28px; }
                .psh-order-id strong { color: #0b7285; }
                .psh-divider { width: 100%; border: none; border-top: 1px solid #f0f0f0; margin: 0 0 24px; }
                .psh-next { width: 100%; text-align: left; margin-bottom: 24px; }
                .psh-next-title {
                    font-size: 12px; font-weight: 700; text-transform: uppercase;
                    letter-spacing: 0.6px; color: #888; margin-bottom: 12px;
                }
                .psh-steps { display: flex; flex-direction: column; gap: 10px; }
                .psh-step { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #444; }
                .psh-step-icon {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: #f0fafa; border: 1px solid #c8e6e8;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px; flex-shrink: 0;
                }
                .psh-buttons { display: flex; flex-direction: column; gap: 10px; width: 100%; }
                .psh-btn-primary {
                    width: 100%; padding: 10px;
                    background: linear-gradient(to bottom, #f4c24d, #e9b12f);
                    border: 1px solid #e1a836; border-radius: 4px;
                    font-size: 14px; font-weight: 600; color: #111; cursor: pointer;
                }
                .psh-btn-primary:hover { background: linear-gradient(to bottom, #f7ca00, #e5a800); }
                .psh-btn-secondary {
                    width: 100%; padding: 10px;
                    background: linear-gradient(to bottom, #f7f8f8, #e7e9ec);
                    border: 1px solid #adb1b8; border-radius: 4px;
                    font-size: 14px; font-weight: 600; color: #0F1111; cursor: pointer;
                }
                .psh-btn-secondary:hover { background: linear-gradient(to bottom, #e7e9ec, #d9dce1); }
                .psh-footer-note {
                    margin-top: 20px; font-size: 12px; color: #888;
                    display: flex; align-items: center; gap: 5px;
                }
            `}</style>

            <div className="psh-page">

                {/* ── Loading: waiting for backend to confirm payment ── */}
                {loading && (
                    <div className="psh-loading">
                        <div className="psh-spinner" />
                        <p className="psh-loading-text">
                            Confirming your payment<span className="psh-loading-dots" />
                        </p>
                    </div>
                )}

                {/* ── Error: payment confirmation failed ── */}
                {error && !paymentConfirmed && (
                    <div className="psh-error-card">
                        <div className="psh-error-icon">⚠️</div>
                        <h2 className="psh-error-title">Payment Verification Failed</h2>
                        <p className="psh-error-msg">{error}</p>
                        <button className="psh-btn-primary" onClick={() => navigate('/')}>
                            Return to Homepage
                        </button>
                    </div>
                )}

                {/* ── Success: payment confirmed by backend ── */}
                {paymentConfirmed && (
                    <>
                        <div className={`psh-card ${show ? 'visible' : ''}`}>
                            <div className="psh-bar" />
                            <div className="psh-body">

                                <div className="psh-check-wrap">
                                    <svg viewBox="0 0 52 52" fill="none">
                                        <circle className="psh-check-circle" cx="26" cy="26" r="24" />
                                        <path className="psh-check-tick" d="M14 27l8 8 16-16" />
                                    </svg>
                                </div>

                                <h1 className="psh-congrats">Order Confirmed!</h1>
                                <p className="psh-sub">
                                    Thank you for your purchase. Your order has been placed successfully.
                                </p>
                                <p className="psh-order-id">
                                    Payment ID: <strong>{paymentId?.slice(0, 20)}…</strong>
                                </p>

                                <hr className="psh-divider" />

                                <div className="psh-next">
                                    <p className="psh-next-title">What happens next</p>
                                    <div className="psh-steps">
                                        {[
                                            { icon: '📧', text: 'Order confirmation email sent to you' },
                                            { icon: '📦', text: 'Seller will pack & dispatch your order' },
                                            { icon: '🚚', text: "You'll receive a delivery tracking link" },
                                        ].map(({ icon, text }) => (
                                            <div key={text} className="psh-step">
                                                <div className="psh-step-icon">{icon}</div>
                                                <span>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <hr className="psh-divider" />

                                <div className="psh-buttons">
                                    <button className="psh-btn-primary" onClick={() => navigate('/account/orders')}>
                                        View My Orders
                                    </button>
                                    <button className="psh-btn-secondary" onClick={() => navigate('/')}>
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="psh-footer-note">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Secured by Razorpay · Your payment is protected
                        </p>
                    </>
                )}
            </div>
        </>
    );
};

export default PaymentSuccessHandler;
