import React from "react";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Review } from "../../../types/reviewTypes";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { deleteReview } from "../../../Redux Toolkit/Customer/ReviewSlice";
import "./Reviews.css";

interface ProductReviewCardProps {
  item: Review;
}

const StarDisplay = ({ value }: { value: number }) => (
  <div className="amz-rv-stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`amz-rv-star ${s <= Math.round(value) ? "" : "empty"}`}>
        <StarIcon style={{ fontSize: "0.875rem" }} />
      </span>
    ))}
    <span style={{ fontSize: "0.8125rem", color: "#565959", marginLeft: 6 }}>
      {value.toFixed(1)}
    </span>
  </div>
);

const ProductReviewCard: React.FC<ProductReviewCardProps> = ({ item }) => {
  const dispatch  = useAppDispatch();

  // ✅ Granular selectors — no whole-slice returns
  const currentUserId = useAppSelector((s) => s.user.user?.id);

  const isOwner = item.user?.id === currentUserId;

  const handleDelete = () => {
    dispatch(deleteReview({
      reviewId: item.id,
      jwt: localStorage.getItem("jwt") || "",
    }));
  };

  const initials = item.user?.fullName
    ? item.user.fullName[0].toUpperCase()
    : "U";

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";

  return (
    <div className="amz-rv-review-item">
      <div className="amz-rv-review-top">

        <div style={{ flex: 1 }}>
          {/* Reviewer */}
          <div className="amz-rv-reviewer">
            <div className="amz-rv-avatar">{initials}</div>
            <div>
              <div className="amz-rv-reviewer-name">{item.user?.fullName}</div>
              <div className="amz-rv-reviewer-date">{formattedDate}</div>
            </div>
          </div>

          {/* Stars */}
          <StarDisplay value={item.rating} />

          {/* Headline */}
          {item.reviewTitle && (
            <div className="amz-rv-headline">{item.reviewTitle}</div>
          )}

          {/* Verified purchase */}
          <div className="amz-rv-verified" style={{ marginBottom: 8 }}>
            <CheckCircleIcon style={{ fontSize: "0.875rem" }} />
            Verified Purchase
          </div>

          {/* Body */}
          <p className="amz-rv-body">{item.reviewText}</p>

          {/* Images */}
          {item.productImages?.length > 0 && (
            <div className="amz-rv-images">
              {item.productImages.map((img, i) => (
                <img key={i} className="amz-rv-img" src={img} alt={`review-img-${i + 1}`} />
              ))}
            </div>
          )}
        </div>

        {/* Delete — only for review owner */}
        {isOwner && (
          <button
            className="amz-rv-delete-btn"
            onClick={handleDelete}
            title="Delete review"
          >
            <DeleteIcon style={{ fontSize: "1.125rem" }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductReviewCard;