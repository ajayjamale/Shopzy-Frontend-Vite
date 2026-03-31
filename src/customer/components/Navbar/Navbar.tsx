import {
  Badge,
  Box,
  Drawer,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FavoriteBorder } from "@mui/icons-material";
import { mainCategory } from "../../../data/category/mainCategory";
import DrawerList from "./DrawerList";
import CategorySheet from "./CategorySheet";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { searchProduct } from "../../../Redux Toolkit/Customer/ProductSlice";
import { ShopzyLogo } from "../../../components/ShopzyLogo";

/** Categories that have a sub-sheet defined */
const SHEET_CATEGORIES = new Set(["men", "women", "electronics", "home_furniture"]);

const Navbar = () => {
  const theme  = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md")); // < 900px — no hover sheet
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, cart, sellers } = useAppSelector((store) => store);

  /* ── drawer ──────────────────────────────────────────── */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (state: boolean) => () => setDrawerOpen(state);

  /* ── search ──────────────────────────────────────────── */
  const [searchQuery, setSearchQuery]       = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused]   = useState(false);

  /* ── scroll shadow ───────────────────────────────────── */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── hover category sheet ────────────────────────────── */
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Start a short delay before closing — lets the mouse move from
   *  the button into the sheet without the sheet disappearing. */
  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setHoveredCategory(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const handleCategoryMouseEnter = (categoryId: string) => {
    cancelClose();
    if (SHEET_CATEGORIES.has(categoryId)) {
      setHoveredCategory(categoryId);
    } else {
      setHoveredCategory(null);
    }
  };

  const handleCategoryMouseLeave = () => scheduleClose();

  /** Called when cursor enters the floating sheet panel */
  const handleSheetMouseEnter = () => cancelClose();

  /** Called when cursor leaves the floating sheet panel */
  const handleSheetMouseLeave = () => scheduleClose();

  /** Close sheet when user navigates via CategorySheet */
  const closeSheet = () => setHoveredCategory(null);

  /* ── misc ────────────────────────────────────────────── */
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    dispatch(searchProduct(searchQuery));
    navigate(`/search-products?query=${searchQuery}`);
    setMobileSearchOpen(false);
  };

  const becomeSellerClick = () => {
    sellers.profile?.id ? navigate("/seller") : navigate("/become-seller");
  };

  const firstName = user.user?.fullName?.split(" ")[0] ?? null;

  return (
    /* The outer wrapper is `position:sticky` so the dropdown can use
       `position:absolute` relative to it and still sit right below the bar. */
    <Box
      sx={{ zIndex: 1100, position: "sticky", top: 0, width: "100%" }}
      className="navbar"
      style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.45)" : "none", transition: "box-shadow 0.3s ease" }}
    >
      {/* ── TOP BAR ──────────────────────────────────────── */}
      <div
        className="navbar-top"
        style={{ background: "linear-gradient(180deg,#1a2332 0%,#131921 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 px-2 sm:px-4 lg:px-10 h-[60px] min-w-0">

          {/* Hamburger — mobile only */}
          {isSmall && (
            <IconButton onClick={toggleDrawer(true)} size="small"
              sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", p: "5px", "&:hover": { borderColor: "#FFD814", color: "#FFD814" } }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <ShopzyLogo size={18} />
          </div>

          {/* Deliver to */}
          {!isSmall && (
            <button type="button" className="hidden md:flex flex-col items-start px-2 py-1 text-xs text-white rounded-md"
              style={{ transition: "background 0.15s", background: "transparent", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 10, color: "#a0aab4" }}>Deliver to</span>
              <span className="flex items-center gap-1 font-semibold text-white" style={{ fontSize: 12 }}>
                <RoomOutlinedIcon sx={{ fontSize: 14, color: "#FFD814" }} />
                {firstName ?? "Update location"}
              </span>
            </button>
          )}

          {/* Search */}
          {!isSmall ? (
            <Box sx={{
              flex: 1, display: "flex", alignItems: "stretch", mx: 1,
              borderRadius: "8px", overflow: "hidden",
              border: searchFocused ? "2px solid #FFD814" : "2px solid transparent",
              transition: "border-color 0.2s ease",
              boxShadow: searchFocused ? "0 0 0 3px rgba(255,216,20,0.15)" : "none",
            }}>
              <Box sx={{ background: "#f0f2f2", px: 1.5, display: "flex", alignItems: "center", fontSize: 12, cursor: "pointer", color: "#333", gap: 0.3, whiteSpace: "nowrap", "&:hover": { background: "#e3e6e6" } }}>
                All <KeyboardArrowDownIcon sx={{ fontSize: 14 }} />
              </Box>
              <Box sx={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", px: 1.5 }}>
                <InputBase placeholder="Search Shopzy" fullWidth value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  inputProps={{ className: "navbar-search-input" }}
                  sx={{ fontSize: 14 }}
                />
              </Box>
              <Box onClick={handleSearch} sx={{ background: "#FFD814", width: 52, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s", "&:hover": { background: "#f0c400" } }}>
                <SearchIcon sx={{ color: "#131921", fontSize: 22 }} />
              </Box>
            </Box>
          ) : (
            <IconButton onClick={() => setMobileSearchOpen(!mobileSearchOpen)} sx={{ color: "#fff", ml: "auto" }}>
              <SearchIcon />
            </IconButton>
          )}

          {/* Account & Orders */}
          {!isSmall && (
            <div className="flex items-center gap-1 ml-1">
              <button type="button"
                onClick={() => (user.user ? navigate("/account/orders") : navigate("/login"))}
                className="flex flex-col items-start px-2 py-1 rounded-md text-white"
                style={{ background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 10, color: "#a0aab4" }}>Hello, {firstName ?? "sign in"}</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Account &amp; Lists</span>
              </button>
              <button type="button" onClick={() => navigate("/account/orders")}
                className="hidden lg:flex flex-col items-start px-2 py-1 rounded-md text-white"
                style={{ background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 10, color: "#a0aab4" }}>Returns</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>&amp; Orders</span>
              </button>
            </div>
          )}

          {/* Wishlist + Cart */}
          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto sm:ml-1 shrink-0">
            <IconButton onClick={() => navigate("/wishlist")} size="small"
              sx={{ color: "#fff", p: "6px", "&:hover": { color: "#FFD814" }, transition: "color 0.2s" }}
            >
              <FavoriteBorder sx={{ fontSize: 22 }} />
            </IconButton>
            <button type="button" onClick={() => navigate("/cart")}
              className="relative flex items-center gap-1 text-white px-2 py-1 rounded-md"
              style={{ background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Badge badgeContent={cart.cart?.cartItems?.length || 0}
                sx={{ "& .MuiBadge-badge": { background: "#FFD814", color: "#131921", fontWeight: 800, fontSize: 11, minWidth: 18, height: 18 } }}
              >
                <AddShoppingCartIcon sx={{ fontSize: 26 }} />
              </Badge>
              <span className="hidden sm:block font-semibold text-sm ml-1">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile search expansion */}
        {isSmall && mobileSearchOpen && (
          <div style={{ background: "#1a2332", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "0 12px 12px" }}>
            <div className="flex items-stretch overflow-hidden" style={{ borderRadius: 8, border: "2px solid #FFD814" }}>
              <InputBase placeholder="Search Shopzy" fullWidth value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                sx={{ px: 2, py: 0.8, fontSize: 14, background: "#fff", minWidth: 0 }}
              />
              <button type="button" onClick={handleSearch}
                style={{ padding: "0 16px", background: "#FFD814", border: "none", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <SearchIcon sx={{ color: "#131921" }} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM CATEGORY BAR + HOVER SHEET ─────────────── */}
      <div
        className="navbar-bottom"
        style={{ background: "linear-gradient(180deg,#2a3f55 0%,#232f3e 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative" }}
      >
        {/* Category pills row */}
        <div className="navbar-bottom-inner flex items-center gap-1 px-2 sm:px-4 lg:px-10 overflow-x-auto" style={{ height: 42 }}>

          {/* "All" — opens drawer */}
          <button type="button" onClick={toggleDrawer(true)}
            className="navbar-link flex items-center gap-1.5 shrink-0"
            style={{ fontWeight: 700, color: "#fff" }}
          >
            <MenuIcon sx={{ fontSize: 18 }} />
            <span>All</span>
          </button>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)", margin: "0 4px", flexShrink: 0 }} />

          {/* Category buttons — hover opens sheet on desktop */}
          {mainCategory.slice(0, 8).map((item) => {
            const hasSheet = !isSmall && SHEET_CATEGORIES.has(item.categoryId);
            const isActive = hoveredCategory === item.categoryId;

            return (
              <button
                key={item.categoryId}
                type="button"
                className="navbar-link hidden sm:inline-flex shrink-0 items-center gap-1"
                style={{
                  color: isActive ? "#FFD814" : undefined,
                  borderColor: isActive ? "rgba(255,255,255,0.55)" : undefined,
                  background: isActive ? "rgba(255,255,255,0.1)" : undefined,
                  position: "relative",
                }}
                onClick={() => navigate(`/products/${item.categoryId}`)}
                onMouseEnter={() => hasSheet ? handleCategoryMouseEnter(item.categoryId) : setHoveredCategory(null)}
                onMouseLeave={() => hasSheet ? handleCategoryMouseLeave() : undefined}
              >
                {item.name}
                {hasSheet && (
                  <KeyboardArrowDownIcon
                    sx={{
                      fontSize: 14,
                      transition: "transform 0.2s ease",
                      transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                      opacity: 0.7,
                    }}
                  />
                )}
                {/* Active underline indicator */}
                {isActive && (
                  <span style={{
                    position: "absolute",
                    bottom: -1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80%",
                    height: 2,
                    background: "#FFD814",
                    borderRadius: 1,
                  }} />
                )}
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          {/* Sell on Shopzy */}
          <button type="button" onClick={becomeSellerClick}
            className="hidden md:inline-flex shrink-0 items-center gap-1"
            style={{ fontSize: "0.8rem", fontWeight: 600, padding: "4px 14px", borderRadius: 20, border: "1px solid #FFD814", color: "#FFD814", background: "transparent", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FFD814"; (e.currentTarget as HTMLButtonElement).style.color = "#131921"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#FFD814"; }}
          >
            Sell on Shopzy
          </button>
        </div>

        {/* ── HOVER DROPDOWN SHEET ──────────────────────────
            Sits absolutely below the bottom bar.
            Mouse-enter cancels the close timer so moving from
            button → sheet doesn't flicker.                   */}
        {!isSmall && hoveredCategory && (
          <div
            onMouseEnter={handleSheetMouseEnter}
            onMouseLeave={handleSheetMouseLeave}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1200,
              background: "#ffffff",
              boxShadow: "0 16px 48px rgba(0,0,0,0.22)",
              borderTop: "2px solid #FFD814",
              maxHeight: "70vh",
              overflowY: "auto",
              animation: "sheetSlideDown 0.18s ease",
            }}
            className="styled-scrollbar"
          >
            {/* Thin top accent line per category */}
            <CategorySheet
              selectedCategory={hoveredCategory}
              onClose={closeSheet}
              /* pass a no-op toggleDrawer so CategorySheet's
                 handleCategoryClick can still call toggleDrawer(false)() */
              toggleDrawer={() => () => { closeSheet(); }}
            />
          </div>
        )}
      </div>

      {/* Mobile / "All" Drawer */}
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}
        PaperProps={{ sx: { width: { xs: 300, sm: 340 }, background: "#fff", boxShadow: "8px 0 40px rgba(0,0,0,0.25)" } }}
      >
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </Box>
  );
};

export default Navbar;