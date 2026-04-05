import {
  Alert,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { teal } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CartItemCard from "./CartItemCard";
import { useNavigate } from "react-router-dom";
import PricingCard from "./PricingCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchUserCart, clearCart } from "../../../Redux Toolkit/Customer/CartSlice";
import type { CartItem } from "../../../types/cartTypes";
import { applyCoupon } from "../../../Redux Toolkit/Customer/CouponSlice";
import { ShoppingCartOutlined } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, auth, coupone } = useAppSelector((store) => store);
  const paymentConfirmed = useAppSelector((store) => store.orders.paymentConfirmed);
  const [couponCode, setCouponCode] = useState("");
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  // Fetch cart whenever JWT changes
  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem("jwt") || ""));
  }, [auth.jwt]);

  // Auto-clear cart ONLY after payment is confirmed by backend
  useEffect(() => {
    if (paymentConfirmed) {
      dispatch(clearCart());
    }
  }, [paymentConfirmed]);

  const handleChangeCoupon = (e: any) => setCouponCode(e.target.value);

  const handleApplyCoupon = (apply: string) => {
    const code = apply === "false" ? cart.cart?.couponCode || "" : couponCode;
    dispatch(
      applyCoupon({
        apply,
        code,
        orderValue: cart.cart?.totalSellingPrice || 100,
        jwt: localStorage.getItem("jwt") || "",
      })
    );
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    if (coupone.couponApplied || coupone.error) {
      setOpenSnackbar(true);
      setCouponCode("");
    }
  }, [coupone.couponApplied, coupone.error]);

  const cartItems: CartItem[] = cart.cart?.cartItems ?? [];
  const itemCount = cartItems.length;

  return (
    <>
      {itemCount > 0 ? (
        <div className="min-h-screen bg-[#f5f6f8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-500 mt-1">Review your items and checkout when you’re ready.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 rounded-full bg-white border border-gray-200">Secure checkout</span>
              <span className="px-2 py-1 rounded-full bg-white border border-gray-200">Easy returns</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 items-start">

            {/* ── Left: Cart Items ── */}
            <div className="lg:col-span-2 space-y-3">

              {/* Free shipping banner */}
              <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-2 text-sm text-[#007600] border border-gray-200 shadow-sm">
                <LocalShippingOutlinedIcon sx={{ fontSize: 17 }} />
                <span>
                  Your order qualifies for <strong>FREE Delivery</strong> on orders above ₹1500.
                </span>
              </div>

              {/* Item count header */}
              <div className="bg-white rounded-xl px-5 py-2 flex justify-between items-center border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-600">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                </span>
                <span className="text-sm text-gray-500">Price</span>
              </div>

              {/* Item list */}
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                {cartItems.map((item: CartItem) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Subtotal */}
              <div className="bg-white rounded-xl px-5 py-3 border border-gray-200 text-right shadow-sm">
                <span className="text-base text-gray-800">
                  Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):&nbsp;
                  <strong className="text-lg">₹{cart.cart?.totalSellingPrice}</strong>
                </span>
              </div>
            </div>

            {/* ── Right: Summary ── */}
            <div className="col-span-1 space-y-3 lg:sticky lg:top-24">

              {/* Order summary */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-5 pt-4 pb-2 flex items-center gap-1.5 text-xs text-[#007600]">
                  <LockIcon sx={{ fontSize: 13 }} />
                  <span>Secure transaction</span>
                </div>
                <PricingCard />
                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => navigate("/checkout/address")}
                    className="w-full py-2.5 btn-primary"
                  >
                    Proceed to Buy ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </button>
                </div>
              </div>

              {/* Coupon */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <LocalOfferIcon sx={{ color: teal[600], fontSize: 17 }} />
                  <span>Apply Coupon</span>
                </div>

                {!cart.cart?.couponCode ? (
                  <div className="flex gap-2">
                    <TextField
                      value={couponCode}
                      onChange={handleChangeCoupon}
                      placeholder="Enter coupon code"
                      size="small"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13 },
                      }}
                    />
                    <Button
                      onClick={() => handleApplyCoupon("true")}
                      disabled={!couponCode}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        borderColor: "#0b7285",
                        color: "#0b7285",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        "&:hover": { borderColor: "#0a5b67", background: "#f0fafa" },
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-[#e6f4f5] border border-[#b2dde3] rounded-full px-4 py-1.5 w-fit">
                    <LocalOfferIcon sx={{ fontSize: 14, color: teal[600] }} />
                    <span className="text-sm font-semibold text-[#0b7285]">
                      {cart.cart.couponCode}
                    </span>
                    <span className="text-xs text-[#007600]">Applied</span>
                    <button
                      onClick={() => handleApplyCoupon("false")}
                      className="ml-1 text-gray-400 hover:text-red-500 transition-colors text-base leading-none"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist shortcut */}
              <div
                className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition shadow-sm"
                onClick={() => navigate("/wishlist")}
              >
                <span className="text-sm text-[#0b7285] font-semibold hover:underline">
                  Add items from Wishlist
                </span>
                <FavoriteIcon sx={{ color: teal[600], fontSize: 19 }} />
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        /* ── Empty Cart ── */
        <div className="min-h-[85vh] flex justify-center items-center bg-[#f5f6f8]">
          <div className="bg-white rounded-2xl border border-gray-200 px-10 py-10 flex flex-col items-center gap-4 max-w-sm w-full text-center shadow-sm">
            <ShoppingCartOutlined sx={{ fontSize: 64, color: "#c8c8c8" }} />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Your Shopzy Cart is empty</h1>
              <p className="text-sm text-gray-500 mt-1">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 btn-primary mt-1"
            >
              Continue Shopping
            </button>
            <Button
              onClick={() => navigate("/wishlist")}
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: 999,
                textTransform: "none",
                borderColor: "#0b7285",
                color: "#0b7285",
                fontSize: 13,
              }}
            >
              Add from Wishlist
            </Button>
          </div>
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={coupone.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {coupone.error ? coupone.error : "Coupon applied successfully!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;
