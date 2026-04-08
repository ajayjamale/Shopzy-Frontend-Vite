import { useEffect } from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getWishlistByUserId } from "../../../store/customer/WishlistSlice";
import WishlistProductCard from "./WishlistProductCard";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wishlist, auth } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(getWishlistByUserId() as any);
  }, [auth.jwt, dispatch]);

  const products = wishlist.wishlist?.products || [];

  return (
    <div className="app-container py-7">
      <div className="mb-5">
        <p className="section-kicker mb-2">Personal</p>
        <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Your Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">{products.length} saved item{products.length > 1 ? "s" : ""}</p>
      </div>

      {wishlist.loading ? (
        <div className="surface p-8" style={{ borderRadius: 18 }}>
          <p className="text-sm text-slate-500">Loading wishlist...</p>
        </div>
      ) : products.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {products.map((item: any) => (
            <WishlistProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FavoriteRoundedIcon sx={{ fontSize: 54, color: "#9CB1C1" }} />
          <h3 style={{ fontSize: "1.2rem" }}>No items in wishlist</h3>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Save your favorite products and come back to them anytime.
          </p>
          <button className="btn-primary mt-2" onClick={() => navigate("/")}>Explore products</button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
