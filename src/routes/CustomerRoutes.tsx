import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../customer/pages/Home/Home";
import Products from "../customer/pages/Products/Products";
import ProductDetails from "../customer/pages/Products/ProductDetails/ProductDetails";
import Cart from "../customer/pages/Cart/Cart";
import Address from "../customer/pages/Checkout/AddressPage";
import Profile from "../customer/pages/Account/Profile";
import Footer from "../customer/components/Footer/Footer";
import Navbar from "../customer/components/Navbar/Navbar";
import NotFound from "../customer/pages/NotFound/NotFound";
import Auth from "../customer/pages/Auth/Auth";
import { useAppDispatch, useAppSelector } from "../Redux Toolkit/Store";
import { fetchUserCart } from "../Redux Toolkit/Customer/CartSlice";
import PaymentSuccessHandler from "../customer/pages/Pyement/PaymentSuccessHandler";
import Reviews from "../customer/pages/Review/Reviews";
import WriteReviews from "../customer/pages/Review/WriteReview";
import Wishlist from "../customer/pages/Wishlist/Wishlist";
import { getWishlistByUserId } from "../Redux Toolkit/Customer/WishlistSlice";
import SearchProducts from "../customer/pages/Search/SearchProducts";
import ProtectedRoute from "./ProtectedRoute";
import { getCustomerToken } from "../util/authToken";

const CustomerRoutes = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);

  useEffect(() => {
    const token = auth.jwt || getCustomerToken();
    if (!token) return;

    dispatch(fetchUserCart(token));
    dispatch(getWishlistByUserId());
  }, [auth.jwt, dispatch]);

  return (
    <>
      <Navbar />
      <main className="app-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:categoryId" element={<Products />} />
          <Route path="/search-products" element={<SearchProducts />} />
          <Route path="/reviews/:productId" element={<Reviews />} />
          <Route path="/reviews/:productId/create" element={<WriteReviews />} />
          <Route path="/product-details/:categoryId/:name/:productId" element={<ProductDetails />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/*"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Auth />} />
          <Route path="/payment-success/:orderId" element={<PaymentSuccessHandler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default CustomerRoutes;
