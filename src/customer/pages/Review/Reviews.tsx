import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";
import { fetchReviewsByProductId } from "../../../Redux Toolkit/Customer/ReviewSlice";
import RatingCard from "./RatingCard";
import ProductReviewCard from "./ProductReviewCard";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Reviews.css";

const Reviews = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { productId } = useParams();

  // ✅ Granular selectors
  const product  = useAppSelector((s) => s.products.product);
  const reviews  = useAppSelector((s) => s.review.reviews);
  const loading  = useAppSelector((s) => s.review.loading);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
      dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
    }
  }, [productId]);

  return (
    <div className="amz-reviews-page">
      <div className="amz-reviews-wrapper">

        {/* Breadcrumb */}
        <div className="amz-rv-breadcrumb">
          <a href="/">shop.in</a>
          <span>›</span>
          <a href={`/product/${productId}`}>{product?.title || "Product"}</a>
          <span>›</span>
          <span>Customer Reviews</span>
        </div>

        <div className="amz-rv-layout">

          {/* ── Product sidebar ── */}
          <aside>
            <div className="amz-rv-product-sidebar">
              <img
                className="amz-rv-product-img"
                src={product?.images?.[0]}
                alt={product?.title}
              />
              <div className="amz-rv-product-info">
                <div className="amz-rv-product-seller">
                  {product?.seller?.businessDetails?.businessName}
                </div>
                <div className="amz-rv-product-title">{product?.title}</div>
                <div className="amz-rv-product-price">
                  <span className="amz-rv-price-sell">₹{product?.sellingPrice?.toLocaleString("en-IN")}</span>
                  <span className="amz-rv-price-mrp">₹{product?.mrpPrice?.toLocaleString("en-IN")}</span>
                  {product?.discountPercent > 0 && (
                    <span className="amz-rv-price-off">{product.discountPercent}% off</span>
                  )}
                </div>
              </div>
            </div>

            {/* Write review CTA */}
            <div style={{ marginTop: 12 }}>
              <button
                className="amz-rv-btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                onClick={() => navigate(`/reviews/${productId}/create`)}
              >
                <RateReviewIcon style={{ fontSize: "1rem" }} />
                Write a customer review
              </button>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main>

            {/* Rating summary */}
            <RatingCard reviews={reviews} />

            {/* Review list */}
            <div className="amz-rv-card">
              <div className="amz-rv-card-header">
                <span>Top Reviews</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: "normal", color: "#565959" }}>
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="amz-rv-card-body">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 90, background: "#f0f2f2", borderRadius: 3, marginBottom: 14, animation: "pulse 1.5s ease-in-out infinite" }} />
                  ))
                ) : reviews.length === 0 ? (
                  <div className="amz-rv-empty">
                    <div className="amz-rv-empty-title">No reviews yet</div>
                    <div className="amz-rv-empty-desc">Be the first to review this product.</div>
                    <button
                      className="amz-rv-btn-primary"
                      style={{ marginTop: 12 }}
                      onClick={() => navigate(`/reviews/${productId}/create`)}
                    >
                      Write a review
                    </button>
                  </div>
                ) : (
                  reviews.map((item) => (
                    <ProductReviewCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default Reviews;