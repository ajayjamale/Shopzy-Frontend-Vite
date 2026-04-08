import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createReview } from '../../../store/customer/ReviewSlice';
import { uploadToCloudinary } from '../../../utils/uploadToCloudnary';
import { useNavigate, useParams } from 'react-router-dom';
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import './Reviews.css';

interface CreateReviewRequest {
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

const ReviewForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  // ✅ Granular selectors
  const reviewLoading = useAppSelector((s) => s.review.loading);
  const reviewError = useAppSelector((s) => s.review.error);

  const [hovered, setHovered] = useState(0);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const formik = useFormik<CreateReviewRequest>({
    initialValues: {
      reviewText: '',
      reviewRating: 0,
      productImages: [],
    },
    validationSchema: Yup.object({
      reviewText: Yup.string()
        .required('Review text is required')
        .min(10, 'Review must be at least 10 characters long'),
      reviewRating: Yup.number()
        .required('Rating is required')
        .min(1, 'Please select a rating')
        .max(5),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!productId) return;

      setReviewSubmitted(false);
      try {
        await dispatch(createReview({
          productId: Number(productId),
          review: values,
          jwt: localStorage.getItem("jwt") || "",
        })).unwrap();
        setReviewSubmitted(true);
        resetForm();
      } catch {
        // Error is rendered from redux state via reviewError.
      }
    },
  });

  useEffect(() => {
    if (!reviewSubmitted) return;
    const timeoutId = window.setTimeout(() => setReviewSubmitted(false), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [reviewSubmitted]);

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

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#e77600";
    e.target.style.boxShadow = "0 0 0 3px rgba(228,121,17,0.5)";
  };

  const onBlur = (hasErr: boolean) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = hasErr ? "#c40000" : "#888c8c";
      e.target.style.boxShadow = hasErr ? "0 0 0 3px rgba(196,0,0,0.2)" : "none";
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
    <form onSubmit={formik.handleSubmit} noValidate>
      {reviewSubmitted && (
        <div
          style={{
            background: "#ecfdf3",
            border: "1px solid #86efac",
            color: "#166534",
            borderRadius: 4,
            padding: "10px 12px",
            marginBottom: 14,
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          Review submitted successfully.
        </div>
      )}

      {reviewError && !reviewLoading && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#991b1b",
            borderRadius: 4,
            padding: "10px 12px",
            marginBottom: 14,
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {reviewError}
        </div>
      )}

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
                ? <StarIcon style={{ fontSize: "2.25rem", color: "#ff9900" }} />
                : <StarBorderIcon style={{ fontSize: "2.25rem", color: "#adb1b8" }} />}
            </button>
          ))}
          {activeRating > 0 && (
            <span style={{ fontSize: "0.875rem", color: "#565959", marginLeft: 10 }}>
              {RATING_LABELS[activeRating]}
            </span>
          )}
        </div>
        {formik.touched.reviewRating && <ErrMsg msg={formik.errors.reviewRating} />}
      </div>

      {/* ── Review text ── */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="reviewText" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 6 }}>
          Written review <span style={{ color: "#c40000" }}>*</span>
        </label>
        <textarea
          id="reviewText"
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

      {/* ── Photo upload ── */}
      <div style={{ marginBottom: 22 }}>
        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#0f1111", marginBottom: 8 }}>
          Add photos <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#565959" }}>(optional)</span>
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-start" }}>

          {/* Upload trigger */}
          <label
            htmlFor="fileInput"
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
            id="fileInput"
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
          onClick={() => navigate(-1)}
          className="amz-rv-btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={reviewLoading || uploadingImg}
          className="amz-rv-btn-primary"
          style={{ opacity: reviewLoading || uploadingImg ? 0.6 : 1 }}
        >
          {reviewLoading
            ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "#111", borderRadius: "50%", animation: "amz-spin 0.7s linear infinite", display: "inline-block" }} />Submitting...</>
            : "Submit Review"}
        </button>
      </div>

    </form>
  );
};

export default ReviewForm;
