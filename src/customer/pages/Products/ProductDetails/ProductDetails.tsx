import { useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Divider, Modal } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchProductById, getAllProducts } from "../../../../store/customer/ProductSlice";
import { addItemToCart } from "../../../../store/customer/CartSlice";
import { addProductToWishlist } from "../../../../store/customer/WishlistSlice";
import { fetchReviewsByProductId } from "../../../../store/customer/ReviewSlice";
import RatingCard from "../../Review/RatingCard";
import ProductReviewCard from "../../Review/ProductReviewCard";
import SmilarProduct from "../SimilarProduct/SmilarProduct";
import ZoomableImage from "./ZoomableImage";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outline: "none",
};

const ProductDetails = () => {
  const { productId, categoryId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, review } = useAppSelector((store) => store);

  const [openZoom, setOpenZoom] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;

    setSelectedImage(0);
    dispatch(fetchProductById(Number(productId)));
    dispatch(fetchReviewsByProductId({ productId: Number(productId) }));
    dispatch(getAllProducts({ category: categoryId }));
  }, [productId, categoryId, dispatch]);

  const product = products.product;

  const avgRating = useMemo(() => {
    if (!review.reviews?.length) return 0;
    const total = review.reviews.reduce((sum, item) => sum + item.rating, 0);
    return Number((total / review.reviews.length).toFixed(1));
  }, [review.reviews]);

  if (!product) {
    return (
      <div className="app-container py-16 flex justify-center">
        <CircularProgress />
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        jwt: localStorage.getItem("jwt") || "",
        request: {
          productId: Number(productId),
          size: product.sizes || "FREE",
          quantity,
        },
      })
    );
  };

  const handleWishlist = () => {
    if (!product.id) return;
    dispatch(addProductToWishlist({ productId: product.id }));
  };

  return (
    <div className="app-container py-7">
      <p className="text-sm text-slate-500 mb-3" style={{ textTransform: "capitalize" }}>
        Home / {product.category?.name || "Product"}
      </p>

      <div className="surface p-4 sm:p-6 lg:p-8" style={{ borderRadius: 22 }}>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-7">
          <section className="grid lg:grid-cols-[84px_1fr] gap-3">
            <div className="flex lg:flex-col gap-2 overflow-x-auto">
              {product.images?.map((image, index) => (
                <button
                  key={image + index}
                  onClick={() => setSelectedImage(index)}
                  className="border rounded-xl overflow-hidden"
                  style={{
                    width: 78,
                    minWidth: 78,
                    borderColor: selectedImage === index ? "#0F766E" : "#D5E4E8",
                  }}
                >
                  <img src={image} alt={`thumb-${index}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpenZoom(true)}
              className="border border-[#D5E4E8] rounded-2xl overflow-hidden bg-[#F8FBFC]"
            >
              <img
                src={product.images?.[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain max-h-[520px]"
              />
            </button>
          </section>

          <section className="grid gap-4 content-start">
            <p className="text-sm text-teal-700 font-semibold">{product.seller?.businessDetails?.businessName || "Shopzy Seller"}</p>
            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.2 }}>{product.title}</h1>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <StarRoundedIcon sx={{ color: "#D97706", fontSize: 18 }} />
              <strong>{avgRating || "4.2"}</strong>
              <span>({review.reviews.length} reviews)</span>
            </div>

            <div className="surface-soft p-4" style={{ borderRadius: 16 }}>
              <div className="flex items-end gap-3 flex-wrap">
                <strong style={{ fontSize: "2rem", lineHeight: 1, color: "#0F172A" }}>
                  Rs. {product.sellingPrice?.toLocaleString("en-IN")}
                </strong>
                {product.mrpPrice > product.sellingPrice && (
                  <>
                    <span className="text-slate-400 line-through text-base">Rs. {product.mrpPrice?.toLocaleString("en-IN")}</span>
                    <span className="text-rose-700 font-semibold text-sm">{product.discountPercent}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-2">
                You save Rs. {(product.mrpPrice - product.sellingPrice).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="surface-soft p-3 flex items-center gap-2" style={{ borderRadius: 14 }}>
                <LocalShippingRoundedIcon sx={{ color: "#0F766E", fontSize: 18 }} />
                <p className="text-sm text-slate-700">Fast delivery in 2-4 days</p>
              </div>
              <div className="surface-soft p-3 flex items-center gap-2" style={{ borderRadius: 14 }}>
                <WorkspacePremiumRoundedIcon sx={{ color: "#0F766E", fontSize: 18 }} />
                <p className="text-sm text-slate-700">Verified quality guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Quantity</span>
              <div className="inline-flex items-center border border-[#D4E2E7] rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2"
                >
                  <RemoveRoundedIcon sx={{ fontSize: 18 }} />
                </button>
                <span className="px-4 font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2"
                >
                  <AddRoundedIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button className="btn-primary" onClick={handleAddToCart}>
                <AddShoppingCartRoundedIcon sx={{ fontSize: 18, mr: 1 }} />
                Add to cart
              </button>
              <button className="btn-secondary" onClick={handleWishlist}>
                <FavoriteBorderRoundedIcon sx={{ fontSize: 18, mr: 1 }} />
                Save
              </button>
            </div>

            <Divider />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.11em] text-slate-500 mb-2">Description</h3>
              <p className="text-sm leading-7 text-slate-700">{product.description}</p>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-8 grid lg:grid-cols-[330px_1fr] gap-5 items-start">
        <RatingCard reviews={review.reviews} />
        <div className="surface p-5" style={{ borderRadius: 18 }}>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <h2 style={{ fontSize: "1.2rem" }}>Customer feedback</h2>
            <Button
              variant="outlined"
              onClick={() => navigate(`/reviews/${productId}`)}
              sx={{ borderRadius: 999 }}
            >
              View all reviews
            </Button>
          </div>
          <div className="grid gap-4">
            {review.reviews.slice(0, 3).map((item, index) => (
              <div key={item.id || index}>
                <ProductReviewCard item={item} />
                {index < 2 && <Divider sx={{ mt: 2 }} />}
              </div>
            ))}
            {!review.reviews.length && (
              <div className="empty-state">
                <p style={{ color: "#64748B" }}>No reviews yet. Be the first to write one.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-9">
        <h2 style={{ fontSize: "1.35rem", marginBottom: 14 }}>You may also like</h2>
        <SmilarProduct />
      </section>

      <Modal open={openZoom} onClose={() => setOpenZoom(false)}>
        <Box sx={modalStyle}>
          <ZoomableImage src={product.images?.[selectedImage]} alt={product.title} />
        </Box>
      </Modal>
    </div>
  );
};

export default ProductDetails;
