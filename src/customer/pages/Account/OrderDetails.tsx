import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  cancelOrder,
  fetchOrderById,
  fetchOrderItemById,
} from "../../../Redux Toolkit/Customer/OrderSlice";
import { createReview } from "../../../Redux Toolkit/Customer/ReviewSlice";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";
import "./Profile.css";

/* ══════════════════════════════════════════════════════
   Inline Review Modal — no extra file needed
   ══════════════════════════════════════════════════════ */

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  productImage: string;
  sellerName?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "I hate it",
  2: "I don't like it",
  3: "It's OK",
  4: "I like it",
  5: "I love it",
};

const ReviewModal: React.FC<ReviewModalProps> = ({
  open, onClose, productId, productTitle, productImage, sellerName,
}) => {
  const dispatch = useAppDispatch();
  const reviewLoading = useAppSelector((s) => s.review.loading);
  const reviewSuccess = useAppSelector((s) => s.review.success);

  const [rating, setRating]       = useState(0);
  const [hovered, setHovered]     = useState(0);
  const [headline, setHeadline]   = useState("");
  const [body, setBody]           = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState<{ rating?: string; headline?: string; body?: string }>({});

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setRating(0); setHovered(0); setHeadline(""); setBody("");
      setSubmitted(false); setErrors({});
    }
  }, [open]);

  // Close on success
  useEffect(() => {
    if (reviewSuccess && submitted) {
      const t = setTimeout(() => { onClose(); }, 1800);
      return () => clearTimeout(t);
    }
  }, [reviewSuccess, submitted]);

  if (!open) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!rating)              e.rating   = "Please select a star rating.";
    if (!headline.trim())     e.headline = "Please add a headline.";
    if (body.trim().length < 10) e.body  = "Review must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
    dispatch(createReview({
      productId,
      reviewData: { rating, reviewTitle: headline, reviewBody: body },
      jwt: localStorage.getItem("jwt") || "",
    }));
  };

  const activeRating = hovered || rating;

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 4, border: "1px solid #d5d9d9",
          width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto",
          fontFamily: "'Amazon Ember','Helvetica Neue',Arial,sans-serif",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        }}
      >
        {/* Header */}
        <div style={{
          background: "#232f3e", color: "#fff", padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderRadius: "3px 3px 0 0",
        }}>
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>Create Review</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", lineHeight: 1 }}
          >
            <CloseIcon />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* Success state */}
          {reviewSuccess && submitted ? (
            <div style={{
              textAlign: "center", padding: "32px 0",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
              <CheckCircleIcon style={{ fontSize: "3rem", color: "#067d62" }} />
              <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f1111" }}>
                Thank you for your review!
              </div>
              <div style={{ fontSize: "0.875rem", color: "#565959" }}>
                Your feedback helps others make informed decisions.
              </div>
            </div>
          ) : (
            <>
              {/* Product info strip */}
              <div style={{
                display: "flex", gap: 12, alignItems: "center",
                background: "#f7f8f8", border: "1px solid #d5d9d9",
                borderRadius: 3, padding: "12px 14px", marginBottom: 20,
              }}>
                <img
                  src={productImage}
                  alt={productTitle}
                  style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 3, border: "1px solid #d5d9d9", background: "#fff" }}
                />
                <div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f1111", lineHeight: 1.4 }}>
                    {productTitle}
                  </div>
                  {sellerName && (
                    <div style={{ fontSize: "0.8125rem", color: "#565959", marginTop: 2 }}>
                      Sold by {sellerName}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Star rating ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 8 }}>
                  Overall rating <span style={{ color: "#c40000" }}>*</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => { setRating(star); setErrors((e) => ({ ...e, rating: undefined })); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 2, lineHeight: 1, transition: "transform 0.1s ease",
                        transform: activeRating >= star ? "scale(1.15)" : "scale(1)",
                      }}
                    >
                      {activeRating >= star
                        ? <StarIcon style={{ fontSize: "2rem", color: "#ff9900" }} />
                        : <StarBorderIcon style={{ fontSize: "2rem", color: "#adb1b8" }} />}
                    </button>
                  ))}
                  {activeRating > 0 && (
                    <span style={{ fontSize: "0.875rem", color: "#565959", marginLeft: 8 }}>
                      {RATING_LABELS[activeRating]}
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p style={{ color: "#c40000", fontSize: "0.8125rem", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, background: "#c40000", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: "bold" }}>!</span>
                    {errors.rating}
                  </p>
                )}
              </div>

              {/* ── Headline ── */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 6 }}>
                  Add a headline <span style={{ color: "#c40000" }}>*</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => { setHeadline(e.target.value); setErrors((err) => ({ ...err, headline: undefined })); }}
                  placeholder="What's most important to know?"
                  maxLength={100}
                  style={{
                    width: "100%", padding: "8px 12px",
                    border: `1px solid ${errors.headline ? "#c40000" : "#888c8c"}`,
                    borderRadius: 3, fontSize: "0.9375rem", outline: "none",
                    fontFamily: "inherit", color: "#0f1111",
                    boxShadow: errors.headline ? "0 0 0 3px rgba(196,0,0,0.2)" : "none",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onFocus={(e) => { if (!errors.headline) e.target.style.borderColor = "#e77600"; e.target.style.boxShadow = "0 0 0 3px rgba(228,121,17,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.headline ? "#c40000" : "#888c8c"; e.target.style.boxShadow = errors.headline ? "0 0 0 3px rgba(196,0,0,0.2)" : "none"; }}
                />
                {errors.headline && (
                  <p style={{ color: "#c40000", fontSize: "0.8125rem", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, background: "#c40000", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: "bold" }}>!</span>
                    {errors.headline}
                  </p>
                )}
              </div>

              {/* ── Review body ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 6 }}>
                  Add a written review <span style={{ color: "#c40000" }}>*</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => { setBody(e.target.value); setErrors((err) => ({ ...err, body: undefined })); }}
                  placeholder="What did you like or dislike? What did you use this product for?"
                  rows={5}
                  maxLength={2000}
                  style={{
                    width: "100%", padding: "8px 12px", resize: "vertical",
                    border: `1px solid ${errors.body ? "#c40000" : "#888c8c"}`,
                    borderRadius: 3, fontSize: "0.9375rem", outline: "none",
                    fontFamily: "inherit", color: "#0f1111",
                    boxShadow: errors.body ? "0 0 0 3px rgba(196,0,0,0.2)" : "none",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#e77600"; e.target.style.boxShadow = "0 0 0 3px rgba(228,121,17,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.body ? "#c40000" : "#888c8c"; e.target.style.boxShadow = errors.body ? "0 0 0 3px rgba(196,0,0,0.2)" : "none"; }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {errors.body
                    ? <p style={{ color: "#c40000", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, background: "#c40000", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: "bold" }}>!</span>
                        {errors.body}
                      </p>
                    : <span />
                  }
                  <span style={{ fontSize: "0.75rem", color: "#888c8c" }}>{body.length}/2000</span>
                </div>
              </div>

              {/* ── Actions ── */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button className="amz-btn-secondary" onClick={onClose} style={{ padding: "8px 20px" }}>
                  Cancel
                </button>
                <button
                  className="amz-btn-primary"
                  onClick={handleSubmit}
                  disabled={reviewLoading}
                  style={{ padding: "8px 24px", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {reviewLoading
                    ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#111", borderRadius: "50%", animation: "amz-spin 0.7s linear infinite", display: "inline-block" }} />Submitting...</>
                    : "Submit Review"
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   OrderDetails page
   ══════════════════════════════════════════════════════ */

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderItemId, orderId } = useParams();

  const jwt          = useAppSelector((s) => s.auth.jwt);
  const orderItem    = useAppSelector((s) => s.orders.orderItem);
  const currentOrder = useAppSelector((s) => s.orders.currentOrder);
  const loading      = useAppSelector((s) => s.orders.loading);

  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt") || "";
    dispatch(fetchOrderItemById({ orderItemId: Number(orderItemId), jwt: token }));
    dispatch(fetchOrderById({ orderId: Number(orderId), jwt: token }));
  }, [jwt]);

  /* Loading */
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[200, 120, 100, 160].map((h, i) => (
          <div key={i} className="amz-card">
            <div className="amz-card-body">
              <div style={{ height: h, background: "#f0f2f2", borderRadius: 3, animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* Not found */
  if (!orderItem || !currentOrder) {
    return (
      <div className="amz-card">
        <div className="amz-empty-state">
          <div className="amz-empty-title">Order not found</div>
          <div className="amz-empty-desc">We couldn't load this order. Please try again.</div>
          <button className="amz-btn-secondary" onClick={() => navigate("/account/orders")} style={{ marginTop: 8 }}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const status      = currentOrder.orderStatus;
  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";
  const canCancel   = !isCancelled && !isDelivered;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Back */}
        <button
          className="amz-btn-secondary"
          style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => navigate("/account/orders")}
        >
          <ArrowBackIcon style={{ fontSize: "1rem" }} />
          Back to Orders
        </button>

        {/* ── Product card ── */}
        <div className="amz-card">
          <div className="amz-card-header">
            <span>Order # {orderId}</span>
            <span className={`amz-badge ${isDelivered ? "amz-badge-green" : isCancelled ? "amz-badge-red" : "amz-badge-orange"}`}>
              {status}
            </span>
          </div>

          <div className="amz-card-body">

            {/* Delivered banner */}
            {isDelivered && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#e8f5e9", border: "1px solid #b2dfdb", borderRadius: 3,
                padding: "10px 14px", marginBottom: 16,
                fontSize: "0.875rem", color: "#067d62", fontWeight: 700,
              }}>
                <CheckCircleIcon style={{ fontSize: "1.125rem" }} />
                Delivered — Share your experience with other customers
              </div>
            )}

            <div className="amz-order-details-product">
              <img
                className="amz-order-details-product-img"
                src={orderItem.product.images[0]}
                alt={orderItem.product.title}
              />
              <div className="amz-order-details-product-info">
                <div className="amz-order-details-seller">
                  Sold by: {orderItem.product.seller?.businessDetails?.businessName}
                </div>
                <div className="amz-order-details-title">{orderItem.product.title}</div>
                <div style={{ fontSize: "0.8125rem", color: "#565959", marginBottom: 14 }}>
                  Size: M &nbsp;|&nbsp; Qty: {orderItem.quantity ?? 1}
                </div>

                {/* Write Review — only when DELIVERED */}
                {isDelivered && (
                  <button
                    className="amz-btn-primary"
                    onClick={() => setReviewOpen(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 18px" }}
                  >
                    <RateReviewIcon style={{ fontSize: "1rem" }} />
                    Write a product review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="amz-card">
          <div className="amz-card-header">Shipment Status</div>
          <div className="amz-card-body">
            <OrderStepper orderStatus={status} />
          </div>
        </div>

        {/* ── Delivery Address ── */}
        <div className="amz-card">
          <div className="amz-card-header">Delivery Address</div>
          <div className="amz-card-body">
            <div style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "#0f1111" }}>
              <div style={{ fontWeight: 700 }}>{currentOrder.shippingAddress?.name}</div>
              <div>{currentOrder.shippingAddress?.address}, {currentOrder.shippingAddress?.city},{" "}
                {currentOrder.shippingAddress?.state} — {currentOrder.shippingAddress?.pinCode}</div>
              <div style={{ color: "#565959" }}>Mobile: {currentOrder.shippingAddress?.mobile}</div>
            </div>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="amz-card">
          <div className="amz-card-header">Order Summary</div>
          <div className="amz-card-body">
            <div className="amz-price-row">
              <span>Item price (MRP)</span>
              <span>₹{orderItem.mrpPrice?.toLocaleString("en-IN")}</span>
            </div>
            <div className="amz-price-row">
              <span style={{ color: "#c45500" }}>Discount</span>
              <span style={{ color: "#c45500" }}>
                − ₹{(orderItem.mrpPrice - orderItem.sellingPrice)?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="amz-price-row">
              <span>Delivery charges</span>
              <span style={{ color: "#067d62" }}>FREE</span>
            </div>
            <div className="amz-price-row total">
              <span>Order Total</span>
              <span>₹{orderItem.sellingPrice?.toLocaleString("en-IN")}</span>
            </div>

            <div className="amz-divider" />

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "#565959" }}>
              <PaymentsIcon style={{ fontSize: "1.125rem" }} />
              <span>Pay On Delivery</span>
            </div>

            {canCancel && (
              <>
                <div className="amz-divider" />
                <button
                  onClick={() => dispatch(cancelOrder(orderId))}
                  className="amz-btn-danger"
                  style={{ width: "100%", padding: "10px", justifyContent: "center" }}
                >
                  Cancel Order
                </button>
              </>
            )}

            {isCancelled && (
              <>
                <div className="amz-divider" />
                <div style={{ textAlign: "center", padding: "8px 0", color: "#c40000", fontSize: "0.875rem", fontWeight: 700 }}>
                  This order has been cancelled
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Review Modal — rendered inline, no extra file */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        productId={orderItem.product.id}
        productTitle={orderItem.product.title}
        productImage={orderItem.product.images[0]}
        sellerName={orderItem.product.seller?.businessDetails?.businessName}
      />
    </>
  );
};

export default OrderDetails;