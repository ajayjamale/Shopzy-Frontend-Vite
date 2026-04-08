import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { Badge, Divider, Drawer, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useLocation, useNavigate } from "react-router-dom";
import AdminRoutes from "../../../routes/AdminRoutes";
import AdminDrawerList from "../../components/DrawerList";
import { api } from "../../../config/Api";
import { getAdminToken } from "../../../utils/authToken";
import type { Seller } from "../../../types/sellerTypes";

const PENDING_SELLER_STATUS = "PENDING_VERIFICATION";
const PENDING_SELLER_POLL_INTERVAL_MS = 30000;

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
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

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

  const loadPendingSellers = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setPendingSellers([]);
      return;
    }

    try {
      const response = await api.get<Seller[]>("/api/sellers", {
        params: {
          status: PENDING_SELLER_STATUS,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingSellers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch pending sellers", error);
    }
  }, []);

  useEffect(() => {
    loadPendingSellers();
    const intervalId = window.setInterval(loadPendingSellers, PENDING_SELLER_POLL_INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadPendingSellers]);

  const openNotifications = (event: MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const closeNotifications = () => {
    setNotificationAnchorEl(null);
  };

  const openPendingSellers = () => {
    closeNotifications();
    navigate(`/admin/users?tab=sellers&status=${PENDING_SELLER_STATUS}`);
  };

  const notificationCount = pendingSellers.length;
  const latestPendingSellers = pendingSellers.slice(0, 5);

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
            <IconButton
              onClick={openNotifications}
              size="small"
              sx={{
                border: "1px solid #DCE8EC",
                backgroundColor: "#FFFFFF",
                borderRadius: "11px",
              }}
            >
              <Badge
                color="error"
                badgeContent={notificationCount > 99 ? "99+" : notificationCount}
                invisible={notificationCount === 0}
              >
                <NotificationsRoundedIcon sx={{ color: "#0F172A" }} />
              </Badge>
            </IconButton>
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

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={closeNotifications}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              minWidth: 320,
              mt: 1,
              borderRadius: 2,
              border: "1px solid #DCE8EC",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
            },
          }}
        >
          <div style={{ padding: "10px 14px 9px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Seller Notifications</div>
            <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 3 }}>
              {notificationCount === 0
                ? "No pending seller registrations."
                : `${notificationCount} seller account(s) waiting for verification.`}
            </div>
          </div>
          <Divider />

          {notificationCount === 0 ? (
            <MenuItem disabled>No new seller signups.</MenuItem>
          ) : (
            latestPendingSellers.map((seller) => (
              <MenuItem key={seller.id ?? seller.email} onClick={openPendingSellers}>
                <div style={{ display: "grid", gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                    {seller.sellerName || seller.businessDetails?.businessName || "New seller registration"}
                  </span>
                  <span style={{ fontSize: 11.5, color: "#64748B" }}>{seller.email}</span>
                </div>
              </MenuItem>
            ))
          )}

          <Divider />
          <MenuItem onClick={openPendingSellers} sx={{ fontWeight: 700, color: "#0F766E" }}>
            Review pending sellers
          </MenuItem>
        </Menu>

        <main style={{ padding: 18, background: "#F3F7F8", minHeight: "calc(100vh - 68px)" }}>
          <AdminRoutes />
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
