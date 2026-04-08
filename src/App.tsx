import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import customeTheme from "./theme/customeTheme";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { fetchSellerProfile } from "./store/seller/sellerSlice";
import { fetchUserProfile } from "./store/customer/UserSlice";
import { fetchHomePageData } from "./store/customer/home/AsyncThunk";
import CustomerRoutes from "./routes/CustomerRoutes";
import SellerDashboard from "./seller/pages/SellerDashboard/SellerDashboard";
import AdminDashboard from "./admin/pages/Dashboard/Dashboard";
import SellerAccountVerification from "./seller/pages/SellerAccountVerification";
import SellerAccountVerified from "./seller/pages/SellerAccountVerified";
import BecomeSeller from "./customer/pages/BecomeSeller/BecomeSeller";
import AdminAuth from "./admin/pages/Auth/AdminAuth";
import Mobile from "./data/Products/mobile";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getCustomerToken, getSellerToken } from "./utils/authToken";

function App() {
  const dispatch = useAppDispatch();
  const { auth, sellerAuth } = useAppSelector((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    const customerJwt = auth.jwt || getCustomerToken();
    const sellerJwt = sellerAuth.jwt || getSellerToken();

    if (customerJwt) {
      dispatch(
        fetchUserProfile({
          jwt: customerJwt,
          navigate,
          currentPath: window.location.pathname,
        })
      );
    }

    if (sellerJwt) {
      dispatch(fetchSellerProfile(sellerJwt));
    }
  }, [auth.jwt, sellerAuth.jwt, dispatch, navigate]);

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  return (
    <ThemeProvider theme={customeTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute
                requireAuth
                allowedRoles={["ROLE_SELLER"]}
                requireSellerActive
                fallback="/become-seller"
              >
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                requireAuth
                allowedRoles={["ROLE_ADMIN"]}
                fallback="/admin-login"
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/verify-seller/:otp" element={<SellerAccountVerification />} />
          <Route path="/seller-account-verified" element={<SellerAccountVerified />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/admin-login" element={<AdminAuth />} />
          <Route path="/dummy" element={<Mobile />} />
          <Route path="*" element={<CustomerRoutes />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
