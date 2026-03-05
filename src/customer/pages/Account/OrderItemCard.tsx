import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import type { Order, OrderItem } from "../../../types/orderTypes";
import { formatDate } from "../../util/fomateDate";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createReview } from "../../../Redux Toolkit/Customer/ReviewSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import "./Profile.css";

/* ══════════════════════════════════════════════════════════
   Inline Review Modal
   — runs the exact ReviewForm logic (formik + createReview)
   — shows product image + name inside
   — ends with a success screen
   ══════════════════════════════════════════════════════════ */

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

  // ✅ Granular selectors
  const reviewLoading = useAppSelector((s) => s.review.loading);
  const reviewSuccess = useAppSelector((s) => s.review.success);

  const [hovered,      setHovered]      = useState(0);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  // ── Formik — exact same shape as ReviewForm ──
  const formik = useFormik<FormValues>({
    initialValues: { reviewText: "", reviewRating: 0, productImages: [] },
    validationSchema: Yup.object({
      reviewText:   Yup.string()
        .required("Review text is required")
        .min(10, "Review must be at least 10 characters long"),
      reviewRating: Yup.number()
        .required("Rating is required")
        .min(1, "Please select a rating")
        .max(5),
    }),
    onSubmit: (values) => {
      setSubmitted(true);
      // exact same dispatch shape as ReviewForm.onSubmit
      dispatch(createReview({
        productId,
        review: values,
        jwt: localStorage.getItem("jwt") || "",
      }));
    },
  });

  // Reset everything when modal opens
  useEffect(() => {
    if (open) {
      formik.resetForm();
      setHovered(0);
      setSubmitted(false);
    }
  }, [open]);

  // Auto-close 2 s after success
  useEffect(() => {
    if (reviewSuccess && submitted) {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [reviewSuccess, submitted]);

  if (!open) return null;

  // ── Image upload — same as ReviewForm ──
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

  // ── Shared focus/blur handlers (Amazon orange ring) ──
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#e77600";
    e.target.style.boxShadow   = "0 0 0 3px rgba(228,121,17,0.5)";
  };
  const onBlur = (hasErr: boolean) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = hasErr ? "#c40000" : "#888c8c";
      e.target.style.boxShadow   = hasErr ? "0 0 0 3px rgba(196,0,0,0.2)" : "none";
    };

  const inputBase = (hasErr: boolean): React.CSSProperties => ({
    width: "100%", padding: "8px 12px",
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
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      {/* ── Panel ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", width: "100%", maxWidth: 560,
          maxHeight: "92vh", overflowY: "auto",
          borderRadius: 4, border: "1px solid #d5d9d9",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          fontFamily: "'Amazon Ember','Helvetica Neue',Arial,sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: "#232f3e", color: "#fff",
          padding: "13px 20px", borderRadius: "3px 3px 0 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontWeight: 700, fontSize: "1rem" }}>Write a Customer Review</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", lineHeight: 1, padding: 2 }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>

          {/* ════════════════ SUCCESS SCREEN ════════════════ */}
          {reviewSuccess && submitted ? (
            <div style={{ textAlign: "center", padding: "24px 0 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

              <CheckCircleIcon style={{ fontSize: "4rem", color: "#067d62" }} />

              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f1111", marginBottom: 6 }}>
                  Thank you for your review!
                </div>
                <div style={{ fontSize: "0.875rem", color: "#565959", lineHeight: 1.6 }}>
                  Your feedback helps millions of shoppers make better decisions.
                </div>
              </div>

              {/* Product recap strip */}
              <div style={{
                display: "flex", gap: 12, alignItems: "center",
                background: "#f7f8f8", border: "1px solid #d5d9d9",
                borderRadius: 3, padding: "12px 16px", width: "100%", textAlign: "left",
              }}>
                <img src={productImage} alt={productTitle} style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 3, border: "1px solid #d5d9d9", background: "#fff" }} />
                <div>
                  {sellerName && <div style={{ fontSize: "0.75rem", color: "#565959" }}>{sellerName}</div>}
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f1111", lineHeight: 1.4 }}>{productTitle}</div>
                  {/* Show submitted rating as stars */}
                  <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                    {[1,2,3,4,5].map((s) => (
                      s <= formik.values.reviewRating
                        ? <StarIcon     key={s} style={{ fontSize: "0.875rem", color: "#ff9900" }} />
                        : <StarBorderIcon key={s} style={{ fontSize: "0.875rem", color: "#d5d9d9" }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.8125rem", color: "#565959" }}>
                Closing automatically…
              </div>
            </div>

          ) : (
          /* ════════════════ FORM ════════════════ */
          <form onSubmit={formik.handleSubmit} noValidate>

            {/* Product strip — image + title + seller */}
            <div style={{
              display: "flex", gap: 12, alignItems: "center",
              background: "#f7f8f8", border: "1px solid #d5d9d9",
              borderRadius: 3, padding: "12px 14px", marginBottom: 22,
            }}>
              <img
                src={productImage} alt={productTitle}
                style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 3, border: "1px solid #d5d9d9", background: "#fff", flexShrink: 0 }}
              />
              <div>
                {sellerName && <div style={{ fontSize: "0.75rem", color: "#565959", marginBottom: 2 }}>Sold by {sellerName}</div>}
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f1111", lineHeight: 1.4 }}>{productTitle}</div>
                <div style={{ fontSize: "0.8125rem", color: "#565959", marginTop: 4 }}>
                  Share your experience to help other customers
                </div>
              </div>
            </div>

            {/* ── Overall Rating ── */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 8 }}>
                Overall rating <span style={{ color: "#c40000" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {[1,2,3,4,5].map((star) => (
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
                      ? <StarIcon      style={{ fontSize: "2.25rem", color: "#ff9900" }} />
                      : <StarBorderIcon style={{ fontSize: "2.25rem", color: "#adb1b8" }} />}
                  </button>
                ))}
                {activeRating > 0 && (
                  <span style={{ fontSize: "0.875rem", color: "#565959", marginLeft: 10 }}>
                    {RATING_LABELS[activeRating]}
                  </span>
                )}
              </div>
              {formik.touched.reviewRating && <ErrMsg msg={formik.errors.reviewRating as string} />}
            </div>

            {/* ── Review text — exact same as ReviewForm ── */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="oi-reviewText" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 6 }}>
                Written review <span style={{ color: "#c40000" }}>*</span>
              </label>
              <textarea
                id="oi-reviewText"
                name="reviewText"
                rows={5}
                maxLength={2000}
                value={formik.values.reviewText}
                onChange={formik.handleChange}
                onBlur={(e) => { formik.handleBlur(e); onBlur(!!formik.errors.reviewText)(e); }}
                onFocus={onFocus}
                placeholder="What did you like or dislike? What did you use this product for?"
                style={{ ...inputBase(!!formik.touched.reviewText && !!formik.errors.reviewText), resize: "vertical" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {formik.touched.reviewText && <ErrMsg msg={formik.errors.reviewText} />}
                <span style={{ fontSize: "0.75rem", color: "#888c8c", marginLeft: "auto" }}>
                  {formik.values.reviewText.length}/2000
                </span>
              </div>
            </div>

            {/* ── Photo upload — exact same as ReviewForm ── */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 8 }}>
                Add photos <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#565959" }}>(optional)</span>
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
                    fontSize: "0.625rem", color: "#565959",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  {uploadingImg
                    ? <span style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#111", borderRadius: "50%", animation: "amz-spin 0.7s linear infinite", display: "inline-block" }} />
                    : <><AddPhotoAlternateIcon style={{ fontSize: "1.5rem", color: "#565959" }} /><span>Add photo</span></>}
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

            {/* ── Guidelines note ── */}
            <div style={{
              background: "#f7f8f8", border: "1px solid #d5d9d9", borderRadius: 3,
              padding: "10px 14px", marginBottom: 20,
              fontSize: "0.8125rem", color: "#565959", lineHeight: 1.6,
            }}>
              <strong style={{ color: "#0f1111" }}>Review guidelines: </strong>
              Focus on the product's features and your experience. Keep it helpful and relevant to other shoppers.
            </div>

            {/* ── Actions ── */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "8px 20px",
                  background: "linear-gradient(to bottom,#f7f8f8,#e7e9ec)",
                  border: "1px solid #adb1b8", borderRadius: 3,
                  fontSize: "0.9375rem", cursor: "pointer",
                  fontFamily: "inherit", color: "#0f1111",
                }}
              >Cancel</button>

              <button
                type="submit"
                disabled={reviewLoading || uploadingImg}
                style={{
                  padding: "8px 24px",
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "linear-gradient(to bottom,#f7dfa5,#f0c14b)",
                  border: "1px solid #a88734", borderRadius: 3,
                  fontSize: "0.9375rem", cursor: "pointer",
                  fontFamily: "inherit", color: "#111",
                  opacity: reviewLoading || uploadingImg ? 0.6 : 1,
                }}
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

/* ══════════════════════════════════════════════════════════
   OrderItemCard
   ══════════════════════════════════════════════════════════ */

interface Props { item: OrderItem; order: Order; }

const OrderItemCard: React.FC<Props> = ({ item, order }) => {
  const navigate = useNavigate();
  const [reviewOpen, setReviewOpen] = useState(false);

  const isDelivered = order.orderStatus === "DELIVERED";
  const isCancelled = order.orderStatus === "CANCELLED";
  const isReturned  = order.orderStatus === "RETURNED" || order.orderStatus === "RETURN_REQUESTED";

  const badgeCls = isDelivered ? "amz-badge-green"
    : isCancelled ? "amz-badge-red"
    : isReturned  ? "amz-badge-grey"
    : "amz-badge-orange";

  return (
    <>
      <div className="amz-order-item-row">

        {/* Product image */}
        <img
          className="amz-order-item-img"
          src={item.product.images[0]}
          alt={item.product.title}
          onClick={() => navigate(`/account/orders/${order.id}/${item.id}`)}
          style={{ cursor: "pointer" }}
        />

        <div className="amz-order-item-info">
          <div className="amz-order-item-seller">
            {item.product.seller?.businessDetails?.businessName}
          </div>

          <div
            className="amz-order-item-title"
            onClick={() => navigate(`/account/orders/${order.id}/${item.id}`)}
            style={{ cursor: "pointer" }}
          >
            {item.product.title}
          </div>

          <div className="amz-order-item-size">
            Size: FREE &nbsp;|&nbsp; Qty: {item.quantity ?? 1}
          </div>

          {/* Status badge + date */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            <span className={`amz-badge ${badgeCls}`}>{order.orderStatus}</span>
            {order.deliverDate && !isCancelled && (
              <span style={{ fontSize: "0.75rem", color: "#565959" }}>
                {isDelivered ? "Delivered " : "Arriving "}
                <strong>{formatDate(order.deliverDate)}</strong>
              </span>
            )}
          </div>

          {/* Review + View details — DELIVERED only */}
          {isDelivered && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="amz-btn-primary"
                style={{ fontSize: "0.8125rem", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 4 }}
                onClick={(e) => { e.stopPropagation(); setReviewOpen(true); }}
              >
                <RateReviewIcon style={{ fontSize: "0.875rem" }} />
                Write a review
              </button>

              <button
                className="amz-btn-secondary"
                style={{ fontSize: "0.8125rem", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: 4 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/account/orders/${order.id}/${item.id}`); }}
              >
                View details
              </button>
            </div>
          )}
        </div>

        {/* Price */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="amz-order-item-price">₹{item.sellingPrice?.toLocaleString("en-IN")}</div>
          {item.mrpPrice > item.sellingPrice && (
            <>
              <div style={{ fontSize: "0.75rem", color: "#888c8c", marginTop: 2 }}>
                <s>₹{item.mrpPrice?.toLocaleString("en-IN")}</s>
              </div>
              <div className="amz-price-save" style={{ fontSize: "0.75rem" }}>
                −₹{(item.mrpPrice - item.sellingPrice).toLocaleString("en-IN")}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Inline review modal */}
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        productId={item.product.id}
        productTitle={item.product.title}
        productImage={item.product.images[0]}
        sellerName={item.product.seller?.businessDetails?.businessName}
      />
    </>
  );
};

export default OrderItemCard;