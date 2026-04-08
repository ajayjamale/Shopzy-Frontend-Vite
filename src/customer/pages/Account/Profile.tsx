import { Alert, Snackbar } from "@mui/material";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { performLogout } from "../../../Redux Toolkit/Customer/AuthSlice";
import UserDetails from "./UserDetails";
import Order from "./Order";
import SavedCards from "./SavedCards";
import Addresses from "./Adresses";
import OrderDetails from "./OrderDetails";
import "./Profile.css";

const menu = [
  { name: "Orders", path: "/account/orders", icon: <ShoppingBagRoundedIcon sx={{ fontSize: 18 }} /> },
  { name: "Profile", path: "/account/profile", icon: <PersonRoundedIcon sx={{ fontSize: 18 }} /> },
  { name: "Saved Cards", path: "/account/saved-card", icon: <CreditCardRoundedIcon sx={{ fontSize: 18 }} /> },
  { name: "Addresses", path: "/account/addresses", icon: <LocationOnRoundedIcon sx={{ fontSize: 18 }} /> },
  { name: "Logout", path: "/", icon: <LogoutRoundedIcon sx={{ fontSize: 18 }} /> },
];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const fullName = useAppSelector((s) => s.user.user?.fullName);
  const email = useAppSelector((s) => s.user.user?.email);
  const ordersCount = useAppSelector((s) => s.orders.orders?.length || 0);
  const profileUpdated = useAppSelector((s) => s.user.profileUpdated);
  const orderCanceled = useAppSelector((s) => s.orders.orderCanceled);
  const error = useAppSelector((s) => s.user.error);

  const [openToast, setOpenToast] = useState(false);

  useEffect(() => {
    if (profileUpdated || orderCanceled || error) {
      setOpenToast(true);
    }
  }, [profileUpdated, orderCanceled, error]);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const onMenuClick = (item: (typeof menu)[number]) => {
    if (item.name === "Logout") {
      dispatch(performLogout());
      navigate("/");
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="amz-profile-page">
      <div className="amz-profile-wrapper">
        <div className="amz-breadcrumb">
          <a href="/">Shopzy</a> / <span>Your account</span>
        </div>
        <h1 className="amz-page-title">Your Account</h1>

        <div className="amz-profile-layout">
          <aside className="amz-sidebar">
            <div className="amz-sidebar-header">Account Center</div>
            <div className="amz-sidebar-user">
              <div className="amz-sidebar-avatar">{initials}</div>
              <div>
                <p className="amz-sidebar-user-name">{fullName || "Guest"}</p>
                <p className="amz-sidebar-user-email">{email || "user@shopzy.com"}</p>
              </div>
            </div>

            <nav className="amz-sidebar-nav">
              {menu.map((item) => (
                <button
                  key={item.path}
                  className={`amz-sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => onMenuClick(item)}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="amz-sidebar-divider" />
            <div className="px-4 py-3">
              <p className="text-xs text-slate-500">Total orders</p>
              <p className="text-lg font-bold text-slate-900">{ordersCount}</p>
            </div>
          </aside>

          <main>
            <Routes>
              <Route path="/" element={<UserDetails />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/orders/:orderId/:orderItemId" element={<OrderDetails />} />
              <Route path="/profile" element={<UserDetails />} />
              <Route path="/saved-card" element={<SavedCards />} />
              <Route path="/addresses" element={<Addresses />} />
            </Routes>
          </main>
        </div>
      </div>

      <Snackbar
        open={openToast}
        autoHideDuration={3500}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenToast(false)} severity={error ? "error" : "success"} variant="filled">
          {error
            ? typeof error === "string"
              ? error
              : "Something went wrong"
            : orderCanceled
            ? "Order cancelled"
            : "Profile updated"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
