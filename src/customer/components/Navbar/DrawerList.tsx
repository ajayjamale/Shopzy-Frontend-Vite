import React, { useState } from "react";
import {
  Box, List, ListItem, ListItemButton, ListItemText,
  IconButton, useMediaQuery, useTheme,
} from "@mui/material";
import { mainCategory } from "../../../data/category/mainCategory";
import CategorySheet from "./CategorySheet";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import "./Navbar.css";
import { ShopzyLogo } from "../../../components/ShopzyLogo";

const DrawerList = ({ toggleDrawer }: any) => {
  const theme = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down("sm"));   // < 600
  const isTablet  = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));     // ≥ 900

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMobileCategory, setShowMobileCategory] = useState(false);

  /* sidebar widths */
  const sidebarW = isMobile ? "100vw" : isTablet ? 320 : 280;

  /* flyout offset = sidebar width */
  const flyoutLeft = isMobile ? 0 : isTablet ? 320 : 280;

  /* flyout width — fixed 560 px but capped so it never overflows viewport */
  const flyoutW = "min(560px, calc(100vw - " + flyoutLeft + "px))";

  const handleCategoryClick = (categoryId: string) => {
    if (isMobile) { setShowMobileCategory(true); }
    setSelectedCategory(categoryId);
  };

  const handleBackToMain = () => { setShowMobileCategory(false); setSelectedCategory(""); };
  const handleClose = () => { setShowMobileCategory(false); setSelectedCategory(""); toggleDrawer(false)(); };

  const quickLinks = [
    { label: "Home",     icon: <HomeIcon sx={{ fontSize: 17 }} />,           path: "/" },
    { label: "About Us", icon: <InfoIcon sx={{ fontSize: 17 }} />,           path: "/about" },
    { label: "Contact",  icon: <ContactSupportIcon sx={{ fontSize: 17 }} />, path: "/contact" },
  ];

  return (
    <Box
      sx={{ width: sidebarW, height: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      role="presentation"
    >
      {/* ── HEADER ──────────────────────────────────────── */}
      <Box sx={{
        px: 2, height: 60, borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#0f172a", flexShrink: 0,
      }}>
        {showMobileCategory ? (
          <>
            <IconButton onClick={handleBackToMain} sx={{ color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: "8px", width: 34, height: 34, "&:hover": { background: "rgba(255,255,255,0.18)" } }}>
              <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {mainCategory.find((c) => c.categoryId === selectedCategory)?.name}
            </span>
            <IconButton onClick={handleClose} sx={{ color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: "8px", width: 34, height: 34, "&:hover": { background: "rgba(255,255,255,0.18)" } }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        ) : (
          <>
            <div className="cursor-pointer" onClick={() => { toggleDrawer(false)(); window.location.href = "/"; }}>
              <ShopzyLogo size={18} bg="transparent" textColor="#fff" color="#f4c24d" />
            </div>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: "#fff", background: "rgba(255,255,255,0.1)", borderRadius: "8px", width: 34, height: 34, "&:hover": { background: "rgba(255,255,255,0.18)" } }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      {!showMobileCategory ? (
        <>
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>
              Browse Categories
            </span>
          </Box>

          {/* Category list */}
          <List disablePadding sx={{ flex: 1, overflowY: "auto", px: 1.5 }} className="styled-scrollbar">
            {mainCategory.map((item) => {
              const isActive = selectedCategory === item.categoryId && !isMobile;
              return (
                <ListItem key={item.categoryId} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    disableRipple onClick={() => handleCategoryClick(item.categoryId)}
                    sx={{
                      borderRadius: "10px", px: 2, py: 1.4,
                      background: isActive ? "#0f172a" : "transparent",
                      "&:hover": { background: isActive ? "#0f172a" : "#f8fafc" },
                      transition: "all 0.15s ease",
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: 13, fontWeight: isActive ? 700 : 500,
                        letterSpacing: "0.02em", className: "category",
                        sx: { color: isActive ? "#f4c24d" : "#1e293b" },
                      }}
                    />
                    <ArrowForwardIosIcon sx={{ fontSize: 11, color: isActive ? "#f4c24d" : "#cbd5e1", transition: "transform 0.15s", transform: isActive ? "translateX(2px)" : "none" }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Quick links — mobile only */}
          {isMobile && (
            <Box sx={{ borderTop: "1px solid #f1f5f9", px: 1.5, py: 1.5, background: "#fafafa", flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", display: "block", padding: "0 8px 10px" }}>
                Quick Links
              </span>
              {quickLinks.map((link) => (
                <ListItemButton
                  key={link.label}
                  sx={{ borderRadius: "10px", px: 2, py: 1.2, gap: 1.5, color: "#475569", "&:hover": { background: "#f1f5f9", color: "#0f172a" } }}
                  onClick={() => { toggleDrawer(false)(); window.location.href = link.path; }}
                >
                  {link.icon}
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }} />
                </ListItemButton>
              ))}
            </Box>
          )}

          {/* Footer strip */}
          <Box sx={{ p: "14px 20px", borderTop: "1px solid #f1f5f9", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }} className="category">{mainCategory.length} categories</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#f4c24d", background: "#0f172a", padding: "4px 10px", borderRadius: 20 }}>
              SHOPZY
            </span>
          </Box>
        </>
      ) : (
        /* Mobile CategorySheet */
        <Box sx={{ flex: 1, overflowY: "auto" }} className="styled-scrollbar">
          <CategorySheet toggleDrawer={toggleDrawer} selectedCategory={selectedCategory} isMobileDrawer setShowSheet={setShowMobileCategory} />
        </Box>
      )}

      {/* ── FLYOUT — tablet/desktop ──────────────────────── */}
      {!isMobile && selectedCategory && (
        <Box
          sx={{
            position: "fixed",          /* fixed so it escapes the drawer Paper */
            top: 0,
            left: flyoutLeft,
            width: flyoutW,
            height: "100vh",
            background: "#ffffff",
            borderLeft: "1px solid #f1f5f9",
            boxShadow: "8px 0 32px rgba(0,0,0,0.12)",
            zIndex: 1300,               /* above Drawer (1200) */
            overflowY: "auto",
          }}
          className="styled-scrollbar"
        >
          <CategorySheet toggleDrawer={toggleDrawer} selectedCategory={selectedCategory} />
        </Box>
      )}
    </Box>
  );
};

export default DrawerList;