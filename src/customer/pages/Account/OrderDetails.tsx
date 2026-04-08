import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  cancelOrder,
  fetchOrderById,
  fetchOrderItemById,
} from "../../../Redux Toolkit/Customer/OrderSlice";
import { createReview } from "../../../Redux Toolkit/Customer/ReviewSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useNavigate, useParams } from "react-router-dom";
import OrderStepper from "./OrderStepper";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "./Profile.css";

/* ══════════════════════════════════════════════════════
   Inline Review Modal — Formik + Image support
   ══════════════════════════════════════════════════════ */

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  productImage: string;
  sellerName?: string;
}

interface FormValues {
  reviewText: string;
  reviewRating: number;
  productImages: string[];
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

  const [hovered, setHovered] = useState(0);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Formik — unified form state ──
  const formik = useFormik<FormValues>({
    initialValues: { reviewText: "", reviewRating: 0, productImages: [] },
    validationSchema: Yup.object({
      reviewText: Yup.string()
        .required("Review text is required")
        .min(10, "Review must be at least 10 characters long"),
      reviewRating: Yup.number()
        .required("Rating is required")
        .min(1, "Please select a rating")
        .max(5),
    }),
    onSubmit: (values) => {
      setSubmitted(true);
      // ✅ Unified dispatch shape — matches ReviewForm.tsx
      dispatch(createReview({
        productId,
        review: values,
        jwt: localStorage.getItem("jwt") || "",
      }));
    },
  });

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      formik.resetForm();
      setHovered(0);
      setSubmitted(false);
    }
  }, [open]);

  // Auto-close 2s after success
  useEffect(() => {
    if (reviewSuccess && submitted) {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [reviewSuccess, submitted]);

  if (!open) return null;

  // ── Image upload ──
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await uploadToCloudinary(file);
      formik.setFieldValue("productImages", [...formik.values.productImages, url]);
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = formik.values.productImages.filter((_, i) => i !== index);
    formik.setFieldValue("productImages", updated);
  };

  const activeRating = hovered || formik.values.reviewRating;

  // ── Focus/blur handlers ──
  const onFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#e77600";
    e.target.style.boxShadow = "0 0 0 3px rgba(228,121,17,0.5)";
  };

  const onBlur = (hasErr: boolean) =>
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.target.style.borderColor = hasErr ? "#c40000" : "#888c8c";
      e.target.style.boxShadow = hasErr ? "0 0 0 3px rgba(196,0,0,0.2)" : "none";
    };

  const textareaBase = (hasErr: boolean): React.CSSProperties => ({
    width: "100%", padding: "8px 12px", resize: "vertical",
    border: `1px solid ${hasErr ? "#c40000" : "#888c8c"}`,
    borderRadius: 3, fontSize: "0.9375rem", outline: "none",
    fontFamily: "inherit", color: "#0f1111",
    boxShadow: hasErr ? "0 0 0 3px rgba(196,0,0,0.2)" : "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  });

  const ErrMsg = ({ msg }: { msg?: string }) =>
    msg ? (
      <p style={{ color: "#c40000", fontSize: "0.8125rem", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, background: "#c40000", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: "bold", flexShrink: 0 }}>!</span>
        {msg}
      </p>
    ) : null;

  return (
    /* ── Backdrop ── */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      {/* ── Panel ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 4, border: "1px solid #d5d9d9",
          width: "100%", maxWidth: 540, maxHeight: "92vh", overflowY: "auto",
          fontFamily: "'Manrope','Helvetica Neue',Arial,sans-serif",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        }}
      >
        {/* ── Header ── */}
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

          {/* ════════════════ SUCCESS SCREEN ════════════════ */}
          {reviewSuccess && submitted ? (
            <div style={{
              textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            }}>
              <CheckCircleIcon style={{ fontSize: "4rem", color: "#067d62" }} />
              <div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f1111" }}>
                  Thank you for your review!
                </div>
                <div style={{ fontSize: "0.875rem", color: "#64748B", marginTop: 6 }}>
                  Your feedback helps others make informed decisions.
                </div>
              </div>

              {/* Product recap */}
              <div style={{
                display: "flex", gap: 12, alignItems: "center",
                background: "#f7f8f8", border: "1px solid #d5d9d9",
                borderRadius: 3, padding: "12px 16px", width: "100%", textAlign: "left",
              }}>
                <img src={productImage} alt={productTitle} style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 3, border: "1px solid #d5d9d9", background: "#fff" }} />
                <div>
                  {sellerName && <div style={{ fontSize: "0.75rem", color: "#64748B" }}>Sold by {sellerName}</div>}
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f1111" }}>{productTitle}</div>
                  <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      s <= formik.values.reviewRating
                        ? <StarIcon key={s} style={{ fontSize: "0.75rem", color: "#0f766e" }} />
                        : <StarBorderIcon key={s} style={{ fontSize: "0.75rem", color: "#d5d9d9" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          ) : (
          /* ════════════════ FORM ════════════════ */
          <form onSubmit={formik.handleSubmit} noValidate>

            {/* Product info strip */}
            <div style={{
              display: "flex", gap: 12, alignItems: "center",
              background: "#f7f8f8", border: "1px solid #d5d9d9",
              borderRadius: 3, padding: "12px 14px", marginBottom: 20,
            }}>
              <img
                src={productImage} alt={productTitle}
                style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 3, border: "1px solid #d5d9d9", background: "#fff", flexShrink: 0 }}
              />
              <div>
                {sellerName && <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: 2 }}>Sold by {sellerName}</div>}
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f1111", lineHeight: 1.4 }}>{productTitle}</div>
              </div>
            </div>

            {/* ── Overall Rating ── */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 8 }}>
                Overall rating <span style={{ color: "#c40000" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star} type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => formik.setFieldValue("reviewRating", star)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: 2, lineHeight: 1,
                      transform: activeRating >= star ? "scale(1.18)" : "scale(1)",
                      transition: "transform 0.1s ease",
                    }}
                  >
                    {activeRating >= star
                      ? <StarIcon style={{ fontSize: "2rem", color: "#0f766e" }} />
                      : <StarBorderIcon style={{ fontSize: "2rem", color: "#adb1b8" }} />}
                  </button>
                ))}
                {activeRating > 0 && (
                  <span style={{ fontSize: "0.875rem", color: "#64748B", marginLeft: 8 }}>
                    {RATING_LABELS[activeRating]}
                  </span>
                )}
              </div>
              {formik.touched.reviewRating && <ErrMsg msg={formik.errors.reviewRating} />}
            </div>

            {/* ── Written review ── */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 6 }}>
                Add a written review <span style={{ color: "#c40000" }}>*</span>
              </label>
              <textarea
                name="reviewText"
                rows={5}
                maxLength={2000}
                value={formik.values.reviewText}
                onChange={formik.handleChange}
                onBlur={(e) => { formik.handleBlur(e); onBlur(!!formik.errors.reviewText)(e); }}
                onFocus={onFocus}
                placeholder="What did you like or dislike? What did you use this product for?"
                style={textareaBase(!!formik.touched.reviewText && !!formik.errors.reviewText)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {formik.touched.reviewText && <ErrMsg msg={formik.errors.reviewText} />}
                <span style={{ fontSize: "0.75rem", color: "#888c8c", marginLeft: "auto" }}>
                  {formik.values.reviewText.length}/2000
                </span>
              </div>
            </div>

            {/* ── Photo upload ── */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 8 }}>
                Add photos <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#64748B" }}>(optional)</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-start" }}>

                {/* Upload trigger */}
                <label
                  htmlFor="oi-fileInput"
                  style={{
                    width: 76, height: 76,
                    border: "1px dashed #adb1b8", borderRadius: 3,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", background: "#fafafa", gap: 4,
                    fontSize: "0.625rem", color: "#64748B",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  {uploadingImg
                    ? <span style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#111", borderRadius: "50%", animation: "amz-spin 0.7s linear infinite", display: "inline-block" }} />
                    : <><AddPhotoAlternateIcon style={{ fontSize: "1.5rem", color: "#64748B" }} /><span>Add photo</span></>}
                </label>
                <input
                  id="oi-fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  disabled={uploadingImg}
                />

                {/* Thumbnails */}
                {formik.values.productImages.map((img, i) => (
                  <div key={i} style={{ position: "relative", width: 76, height: 76 }}>
                    <img src={img} alt={`upload-${i}`} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 3, border: "1px solid #d5d9d9" }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: "absolute", top: -6, right: -6,
                        width: 18, height: 18, background: "#c40000", color: "#fff",
                        border: "none", borderRadius: "50%", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.625rem", fontWeight: "bold",
                      }}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Actions ── */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                className="amz-btn-secondary"
                style={{ padding: "8px 20px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="amz-btn-primary"
                disabled={reviewLoading || uploadingImg}
                style={{ padding: "8px 24px", display: "flex", alignItems: "center", gap: 6, opacity: reviewLoading || uploadingImg ? 0.6 : 1 }}
              >
                {reviewLoading
                  ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#111", borderRadius: "50%", animation: "amz-spin 0.7s linear infinite", display: "inline-block" }} />Submitting...</>
                  : "Submit Review"}
              </button>
            </div>

          </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   OrderDetails page
   ══════════════════════════════════════════════════════ */

const CANCELLABLE_ORDER_STATUSES = new Set(["PENDING", "PLACED", "CONFIRMED"]);

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orderItemId, orderId } = useParams();

  const jwt          = useAppSelector((s) => s.auth.jwt);
  const orderItem    = useAppSelector((s) => s.orders.orderItem);
  const currentOrder = useAppSelector((s) => s.orders.currentOrder);
  const loading      = useAppSelector((s) => s.orders.loading);

  const [reviewOpen, setReviewOpen] = useState(false);
  const parsedOrderId = Number(orderId);
  const parsedOrderItemId = Number(orderItemId);
  const authToken = jwt || localStorage.getItem("jwt") || "";

  useEffect(() => {
    if (!Number.isFinite(parsedOrderId) || !Number.isFinite(parsedOrderItemId) || !authToken) return;
    dispatch(fetchOrderItemById({ orderItemId: parsedOrderItemId, jwt: authToken }));
    dispatch(fetchOrderById({ orderId: parsedOrderId, jwt: authToken }));
  }, [authToken, dispatch, parsedOrderId, parsedOrderItemId]);

  /* Loading */
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[200, 120, 100, 160].map((h, i) => (
          <div key={i} className="amz-card">
            <div className="amz-card-body">
              <div style={{ height: h, background: "#F4FAFB", borderRadius: 3, animation: "pulse 1.5s ease-in-out infinite" }} />
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

  const status      = (currentOrder.orderStatus || "").toUpperCase();
  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";
  const canCancel   = CANCELLABLE_ORDER_STATUSES.has(status);

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
                <div style={{ fontSize: "0.8125rem", color: "#64748B", marginBottom: 14 }}>
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
              <div style={{ color: "#64748B" }}>Mobile: {currentOrder.shippingAddress?.mobile}</div>
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

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "#64748B" }}>
              <PaymentsIcon style={{ fontSize: "1.125rem" }} />
              <span>Pay On Delivery</span>
            </div>

            {canCancel && (
              <>
                <div className="amz-divider" />
                <button
                  onClick={() =>
                    dispatch(
                      cancelOrder({
                        orderId: parsedOrderId,
                        jwt: authToken,
                      })
                    )
                  }
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

      {/* Review Modal — rendered inline */}
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
