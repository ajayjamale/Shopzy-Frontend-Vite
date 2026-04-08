import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import SellerRoutes from "../../../routes/SellerRoutes";
import SellerDrawerList from "../../components/SideBar/DrawerList";

const SellerDashboard = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: isDesktop ? "250px 1fr" : "1fr" }}>
      {isDesktop ? (
        <SellerDrawerList />
      ) : (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SellerDrawerList />
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
            <StorefrontRoundedIcon sx={{ color: "#0F766E" }} />
            <span style={{ fontWeight: 700, color: "#0F172A" }}>Seller Panel</span>
          </div>
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Live storefront
          </span>
        </header>

        <main style={{ padding: "18px", background: "#F3F7F8", minHeight: "calc(100vh - 68px)" }}>
          <SellerRoutes />
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
