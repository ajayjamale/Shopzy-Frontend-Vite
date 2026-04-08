import { useMemo, useState } from "react";
import { Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { useLocation } from "react-router-dom";
import AdminRoutes from "../../../routes/AdminRoutes";
import AdminDrawerList from "../../components/DrawerList";

const sectionTitleByPath: Record<string, string> = {
  "": "Users & Sellers",
  users: "User Management",
  coupon: "Coupons",
  "add-coupon": "Create Coupon",
  "home-content": "Home Content Studio",
  deals: "Daily Discounts",
  "daily-deals": "Daily Discounts",
  "daily-discounts": "Daily Discounts",
  settlements: "Settlements",
  returns: "Returns",
};

const AdminDashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentSection = useMemo(() => {
    const adminPath = location.pathname.startsWith("/admin")
      ? location.pathname.replace("/admin", "").replace(/^\/+/, "")
      : location.pathname.replace(/^\/+/, "");
    const key = adminPath.split("/")[0];

    if (sectionTitleByPath[key] !== undefined) {
      return sectionTitleByPath[key];
    }

    return key
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [location.pathname]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: isDesktop ? "260px 1fr" : "1fr" }}>
      {isDesktop ? (
        <AdminDrawerList />
      ) : (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <AdminDrawerList />
        </Drawer>
      )}

      <div style={{ minWidth: 0 }}>
        <header
          style={{
            height: 68,
            borderBottom: "1px solid #DCE8EC",
            background: "rgba(248,251,252,0.92)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isDesktop && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            )}
            <DashboardRoundedIcon sx={{ color: "#0F766E" }} />
            <span style={{ fontWeight: 700, color: "#0F172A" }}>Admin Panel</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Current Section
            </span>
            <span
              style={{
                border: "1px solid #CBE4E2",
                background: "#ECF8F6",
                color: "#0F766E",
                borderRadius: 999,
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              {currentSection || "Dashboard"}
            </span>
          </div>
        </header>

        <main style={{ padding: 18, background: "#F3F7F8", minHeight: "calc(100vh - 68px)" }}>
          <AdminRoutes />
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
