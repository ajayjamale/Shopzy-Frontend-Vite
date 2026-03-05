import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";
import ReviewForm from "./ReviewForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Reviews.css";

const WriteReviews = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { productId } = useParams();

  // ✅ Granular selectors
  const product = useAppSelector((s) => s.products.product);

  useEffect(() => {
    if (productId) dispatch(fetchProductById(Number(productId)));
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
          <span>Create Review</span>
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

            <button
              className="amz-rv-btn-secondary"
              style={{ width: "100%", justifyContent: "center", marginTop: 12, padding: "9px" }}
              onClick={() => navigate(`/reviews/${productId}`)}
            >
              <ArrowBackIcon style={{ fontSize: "1rem" }} />
              See all reviews
            </button>
          </aside>

          {/* ── Form ── */}
          <main>
            <div className="amz-rv-card">
              <div className="amz-rv-card-header">Write a Customer Review</div>
              <div className="amz-rv-card-body">

                {/* Guidelines */}
                <div style={{
                  background: "#f7f8f8", border: "1px solid #d5d9d9", borderRadius: 3,
                  padding: "12px 16px", marginBottom: 20,
                  fontSize: "0.8125rem", color: "#565959", lineHeight: 1.6,
                }}>
                  <strong style={{ color: "#0f1111" }}>Review guidelines</strong><br />
                  Focus on the product's features and your experience using it.
                  Keep it helpful, honest, and relevant to other shoppers.
                </div>

                <ReviewForm />
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default WriteReviews;