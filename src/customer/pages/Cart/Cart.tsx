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
        <div className="min-h-screen bg-[#EAEDED] pt-6 pb-12 px-4 sm:px-8 lg:px-16">

          <h1 className="text-2xl font-medium text-gray-900 mb-5">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

            {/* ── Left: Cart Items ── */}
            <div className="lg:col-span-2 space-y-3">

              {/* Free shipping banner */}
              <div className="bg-white rounded-md px-5 py-3 flex items-center gap-2 text-sm text-[#007600] border border-gray-200">
                <LocalShippingOutlinedIcon sx={{ fontSize: 17 }} />
                <span>
                  Your order qualifies for <strong>FREE Delivery</strong> on orders above ₹1500.
                </span>
              </div>

              {/* Item count header */}
              <div className="bg-white rounded-md px-5 py-2 flex justify-between items-center border border-gray-200">
                <span className="text-sm text-gray-600">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                </span>
                <span className="text-sm text-gray-500">Price</span>
              </div>

              {/* Item list */}
              <div className="bg-white rounded-md border border-gray-200 divide-y divide-gray-100">
                {cartItems.map((item: CartItem) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Subtotal */}
              <div className="bg-white rounded-md px-5 py-3 border border-gray-200 text-right">
                <span className="text-base text-gray-800">
                  Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):&nbsp;
                  <strong className="text-lg">₹{cart.cart?.totalSellingPrice}</strong>
                </span>
              </div>
            </div>

            {/* ── Right: Summary ── */}
            <div className="col-span-1 space-y-3">

              {/* Order summary */}
              <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <div className="px-5 pt-4 pb-2 flex items-center gap-1.5 text-xs text-[#007600]">
                  <LockIcon sx={{ fontSize: 13 }} />
                  <span>Secure transaction</span>
                </div>
                <PricingCard />
                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => navigate("/checkout/address")}
                    className="w-full py-2.5 rounded-full font-semibold text-sm transition-all"
                    style={{
                      background: "linear-gradient(to bottom, #FFD814, #F8B200)",
                      border: "1px solid #C7980A",
                      color: "#111",
                    }}
                  >
                    Proceed to Buy ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </button>
                </div>
              </div>

              {/* Coupon */}
              <div className="bg-white rounded-md border border-gray-200 px-5 py-4 space-y-3">
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
                        borderRadius: "6px",
                        textTransform: "none",
                        borderColor: "#007185",
                        color: "#007185",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        "&:hover": { borderColor: "#005f6b", background: "#f0fafa" },
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-[#e6f4f5] border border-[#b2dde3] rounded-full px-4 py-1.5 w-fit">
                    <LocalOfferIcon sx={{ fontSize: 14, color: teal[600] }} />
                    <span className="text-sm font-semibold text-[#007185]">
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
                className="bg-white rounded-md border border-gray-200 px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                onClick={() => navigate("/wishlist")}
              >
                <span className="text-sm text-[#007185] font-semibold hover:underline">
                  Add items from Wishlist
                </span>
                <FavoriteIcon sx={{ color: teal[600], fontSize: 19 }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty Cart ── */
        <div className="min-h-[85vh] flex justify-center items-center bg-[#EAEDED]">
          <div className="bg-white rounded-md border border-gray-200 px-12 py-10 flex flex-col items-center gap-4 max-w-sm w-full text-center">
            <ShoppingCartOutlined sx={{ fontSize: 64, color: "#c8c8c8" }} />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Your Shopzy Cart is empty</h1>
              <p className="text-sm text-gray-500 mt-1">
                Looks like you haven't added anything yet.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 rounded-full font-semibold text-sm mt-1"
              style={{
                background: "linear-gradient(to bottom, #FFD814, #F8B200)",
                border: "1px solid #C7980A",
                color: "#111",
              }}
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
                borderColor: "#007185",
                color: "#007185",
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