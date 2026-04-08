import { useLocation, useNavigate } from "react-router-dom";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import HomeRepairServiceRoundedIcon from "@mui/icons-material/HomeRepairServiceRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import type { ReactNode } from "react";

type NavItem = { label: string; path: string; icon: ReactNode };
type NavGroup = { title: string; items: NavItem[] };

const menuGroups: NavGroup[] = [
  {
    title: "Commerce",
    items: [
      { label: "Users & Sellers", path: "/admin/users?tab=sellers", icon: <StorefrontRoundedIcon sx={{ fontSize: 16 }} /> },
      { label: "Customers", path: "/admin/users?tab=customers", icon: <GroupRoundedIcon sx={{ fontSize: 16 }} /> },
      { label: "Coupons", path: "/admin/coupon", icon: <ConfirmationNumberRoundedIcon sx={{ fontSize: 16 }} /> },
      { label: "Create Coupon", path: "/admin/add-coupon", icon: <DashboardCustomizeRoundedIcon sx={{ fontSize: 16 }} /> },
    ],
  },
  {
    title: "Homepage",
    items: [
      { label: "Home Content Studio", path: "/admin/home-content", icon: <HomeRepairServiceRoundedIcon sx={{ fontSize: 16 }} /> },
      { label: "Daily Discounts", path: "/admin/daily-discounts", icon: <LocalOfferRoundedIcon sx={{ fontSize: 16 }} /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Settlements", path: "/admin/settlements", icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 16 }} /> },
      { label: "Returns", path: "/admin/returns", icon: <AssignmentReturnRoundedIcon sx={{ fontSize: 16 }} /> },
    ],
  },
];

const AdminDrawerList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100%",
        background: "#ffffff",
        borderRight: "1px solid #DCE8EC",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #E7EFF2" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748B", fontWeight: 700 }}>Admin Console</p>
        <h2 style={{ fontSize: "1.3rem", marginTop: 4 }}>Shopzy Control</h2>
        <p style={{ marginTop: 6, fontSize: 12, color: "#64748B" }}>Unified operations and minimal home-content controls</p>
      </div>

      <nav style={{ padding: 10, display: "grid", gap: 12, alignContent: "start", overflowY: "auto" }}>
        {menuGroups.map((group) => (
          <div key={group.title} style={{ display: "grid", gap: 5 }}>
            <p
              style={{
                margin: "2px 8px 1px",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#94A3B8",
                fontWeight: 800,
              }}
            >
              {group.title}
            </p>

            {group.items.map(({ label, path, icon }) => {
              const [cleanPath] = path.split("?");
              const queryString = path.includes("?") ? path.split("?")[1] : "";
              const expectedParams = new URLSearchParams(queryString);
              const currentParams = new URLSearchParams(location.search);
              const isRoot = cleanPath === "/admin";
              const queryMatches =
                !queryString ||
                Array.from(expectedParams.entries()).every(
                  ([key, value]) => currentParams.get(key) === value
                );
              const active = isRoot
                ? location.pathname === "/admin" || location.pathname === "/admin/"
                : (location.pathname === cleanPath || location.pathname.startsWith(`${cleanPath}/`)) &&
                  queryMatches;

              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  style={{
                    border: "1px solid",
                    borderColor: active ? "#6FB7B0" : "transparent",
                    background: active ? "#EAF7F5" : "transparent",
                    color: active ? "#0F766E" : "#334155",
                    borderRadius: 11,
                    textAlign: "left",
                    padding: "9px 10px",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active ? "#FFFFFF" : "#F2F7F9",
                      border: "1px solid #DCE8EC",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid #E7EFF2", padding: "12px 14px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("jwt");
            localStorage.removeItem("seller_jwt");
            navigate("/");
          }}
          style={{
            width: "100%",
            border: "1px solid #F6CBD6",
            background: "#FFF1F4",
            color: "#BE123C",
            borderRadius: 10,
            padding: "9px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminDrawerList;
