import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Order from "./Order";
import UserDetails from "./UserDetails";
import SavedCards from "./SavedCards";
import OrderDetails from "./OrderDetails";
import Addresses from "./Adresses";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { performLogout } from "../../../Redux Toolkit/Customer/AuthSlice";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Profile.css";

const menu = [
  { name: "Orders",      path: "/account/orders",     icon: <ShoppingBagIcon /> },
  { name: "Profile",     path: "/account/profile",    icon: <PersonIcon /> },
  { name: "Saved Cards", path: "/account/saved-card", icon: <CreditCardIcon /> },
  { name: "Addresses",   path: "/account/addresses",  icon: <LocationOnIcon /> },
  { name: "Logout",      path: "/",                   icon: <LogoutIcon /> },
];

const Profile = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useAppDispatch();

  // ✅ Granular selectors — no whole-slice returns
  const fullName      = useAppSelector((s) => s.user.user?.fullName);
  const email         = useAppSelector((s) => s.user.user?.email);
  const profileUpdated = useAppSelector((s) => s.user.profileUpdated);
  const orderCanceled  = useAppSelector((s) => s.orders.orderCanceled);
  const userError      = useAppSelector((s) => s.user.error);
  const ordersCount    = useAppSelector((s) => s.orders.orders?.length ?? 0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogout = () => { dispatch(performLogout()); navigate("/"); };

  const handleClick = (item: any) => {
    if (item.name === "Logout") handleLogout();
    else navigate(item.path);
  };

  useEffect(() => {
    if (profileUpdated || orderCanceled || userError) setSnackbarOpen(true);
  }, [profileUpdated, orderCanceled, userError]);

  const getInitials = () => {
    if (!fullName) return "U";
    return fullName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const snackbarMsg = userError
    ? typeof userError === "string" ? userError : "Something went wrong."
    : orderCanceled
    ? "Order cancelled successfully"
    : "Profile updated successfully";

  return (
    <div className="amz-profile-page">

      {/* Top bar */}
      <div className="amz-profile-topbar" onClick={() => navigate("/")}>
        <span className="amz-profile-topbar-logo">shop<span>.</span>in</span>
      </div>

      <div className="amz-profile-wrapper">

        {/* Breadcrumb */}
        <div className="amz-breadcrumb">
          <a href="/">Shopzy</a>
          <span>›</span>
          <span>Your Account</span>
        </div>

        <h1 className="amz-page-title">Your Account</h1>

        <div className="amz-profile-layout">

          {/* ── Sidebar ── */}
          <aside className="amz-sidebar">
            <div className="amz-sidebar-header">Account</div>

            <div className="amz-sidebar-user">
              <div className="amz-sidebar-avatar">{getInitials()}</div>
              <div>
                <div className="amz-sidebar-user-name">{fullName || "User"}</div>
                <div className="amz-sidebar-user-email">{email}</div>
              </div>
            </div>

            <nav className="amz-sidebar-nav">
              {menu.map((item, i) => (
                <React.Fragment key={item.name}>
                  {item.name === "Logout" && <div className="amz-sidebar-divider" />}
                  <div
                    className={`amz-sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                    onClick={() => handleClick(item)}
                  >
                    {item.icon}
                    {item.name}
                  </div>
                </React.Fragment>
              ))}
            </nav>

            {/* Order count stat */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #f0f2f2" }}>
              <div style={{ fontSize: "0.75rem", color: "#565959" }}>Total Orders</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f1111" }}>{ordersCount}</div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main>
            <Routes>
              <Route path="/"              element={<UserDetails />} />
              <Route path="/orders"        element={<Order />} />
              <Route path="/orders/:orderId/:orderItemId" element={<OrderDetails />} />
              <Route path="/profile"       element={<UserDetails />} />
              <Route path="/saved-card"    element={<SavedCards />} />
              <Route path="/addresses"     element={<Addresses />} />
            </Routes>
          </main>

        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={userError ? "error" : "success"}
          variant="filled"
          sx={{
            borderRadius: "3px",
            backgroundColor: userError ? "#c40000" : "#067d62",
            color: "#fff",
            fontFamily: "'Amazon Ember','Helvetica Neue',Arial,sans-serif",
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;