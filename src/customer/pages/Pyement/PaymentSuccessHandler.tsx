import { useEffect, useRef, useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { clearCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";

const PaymentSuccessHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, paymentConfirmed, error } = useAppSelector((store) => store.orders);
  const [showCard, setShowCard] = useState(false);
  const sentRef = useRef(false);

  const search = new URLSearchParams(location.search);
  const paymentId = search.get("razorpay_payment_id");
  const paymentLinkId = search.get("razorpay_payment_link_id") || "";

  useEffect(() => {
    if (!paymentId || sentRef.current) return;

    sentRef.current = true;
    dispatch(
      paymentSuccess({
        paymentId,
        paymentLinkId,
        jwt: localStorage.getItem("jwt") || "",
      })
    );
  }, [paymentId, paymentLinkId, dispatch]);

  useEffect(() => {
    if (paymentConfirmed) {
      dispatch(clearCart());
      const timer = setTimeout(() => setShowCard(true), 100);
      return () => clearTimeout(timer);
    }
  }, [paymentConfirmed, dispatch]);

  if (loading) {
    return (
      <div className="app-container py-16 flex justify-center">
        <div className="surface p-10 text-center" style={{ borderRadius: 20, maxWidth: 460 }}>
          <p className="text-sm text-slate-500">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentConfirmed) {
    return (
      <div className="app-container py-16 flex justify-center">
        <div className="surface p-10 text-center" style={{ borderRadius: 20, maxWidth: 500 }}>
          <ErrorOutlineRoundedIcon sx={{ fontSize: 54, color: "#BE123C" }} />
          <h2 style={{ fontSize: "1.5rem", marginTop: 12 }}>Payment verification failed</h2>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          <div className="mt-5">
            <button className="btn-primary" onClick={() => navigate("/")}>Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-16 flex justify-center">
      <div
        className="surface p-10 text-center transition"
        style={{
          borderRadius: 20,
          maxWidth: 540,
          opacity: showCard ? 1 : 0,
          transform: showCard ? "translateY(0)" : "translateY(14px)",
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 62, color: "#15803D" }} />
        <h1 style={{ fontSize: "1.9rem", marginTop: 10 }}>Order confirmed</h1>
        <p className="text-sm text-slate-500 mt-2">
          Payment successful. You will receive order updates in your account.
        </p>
        <p className="text-xs text-slate-400 mt-3">Payment ID: {paymentId?.slice(0, 18)}...</p>

        <div className="mt-6 flex gap-2 justify-center flex-wrap">
          <button className="btn-primary" onClick={() => navigate("/account/orders")}>View orders</button>
          <button className="btn-secondary" onClick={() => navigate("/")}>Continue shopping</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessHandler;
