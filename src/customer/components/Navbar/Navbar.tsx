import { Badge, Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mainCategory } from "../../../data/category/mainCategory";
import { useAppDispatch, useAppSelector } from "../../../store";
import { searchProduct } from "../../../store/customer/ProductSlice";
import { ShopzyLogo } from "../../../components/ShopzyLogo";
import { toCatalogPath } from "../../../utils/catalogRoute";
import DrawerList from "./DrawerList";
import CategorySheet from "./CategorySheet";
import "./Navbar.css";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { cart, user, sellers } = useAppSelector((store) => store);

  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const firstName = useMemo(
    () => user.user?.fullName?.split(" ")?.[0] || "Guest",
    [user.user?.fullName]
  );

  useEffect(() => {
    if (location.pathname !== "/search-products") return;
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("query") ?? "";
    setSearchQuery(queryFromUrl);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isMobile) setHoveredCategory(null);
  }, [isMobile]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    dispatch(searchProduct(query));
    navigate(`/search-products?query=${encodeURIComponent(query)}`);
    setShowMobileSearch(false);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  const cartCount = cart.cart?.cartItems?.length || 0;

  const becomeSellerClick = () => {
    if (sellers.profile?.id) {
      navigate("/seller");
      return;
    }
    navigate("/become-seller");
  };

  return (
    <header className="nav-shell">
      <div className="nav-main">
        {isMobile && (
          <IconButton
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ border: "1px solid #D4E2E6", borderRadius: 2 }}
          >
            <MenuRoundedIcon />
          </IconButton>
        )}

        <button onClick={() => navigate("/")} className="bg-transparent border-0 cursor-pointer p-0">
          <ShopzyLogo size={18} />
        </button>

        {!isMobile && (
          <form className="nav-search" onSubmit={handleSearchSubmit}>
            <SearchRoundedIcon sx={{ color: "#64748B", fontSize: 20 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories"
            />
            <button type="submit" aria-label="search">
              <SearchRoundedIcon sx={{ fontSize: 20 }} />
            </button>
          </form>
        )}

        <div className="nav-actions">
          {isMobile && (
            <IconButton onClick={() => setShowMobileSearch((v) => !v)} aria-label="search mobile">
              <SearchRoundedIcon />
            </IconButton>
          )}

          <button
            className="nav-action-btn"
            onClick={() => navigate(user.user ? "/account/profile" : "/login")}
          >
            <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />
            {!isMobile && <span>Hello, {firstName}</span>}
          </button>

          <button className="nav-action-btn" onClick={() => navigate("/wishlist")}>
            <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
            {!isMobile && <span>Wishlist</span>}
          </button>

          <button className="nav-action-btn" onClick={() => navigate("/cart")}> 
            <Badge badgeContent={cartCount} color="primary">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 19 }} />
            </Badge>
            {!isMobile && <span>Cart</span>}
          </button>
        </div>
      </div>

      {isMobile && showMobileSearch && (
        <div className="nav-mobile-search">
          <form className="nav-search" onSubmit={handleSearchSubmit}>
            <SearchRoundedIcon sx={{ color: "#64748B", fontSize: 20 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
            />
            <button type="submit" aria-label="search mobile submit">
              <SearchRoundedIcon sx={{ fontSize: 20 }} />
            </button>
          </form>
        </div>
      )}

      <div className="nav-cats-wrap" onMouseLeave={() => setHoveredCategory(null)}>
        <div className="nav-cats">
          {mainCategory.map((category) => (
            <button
              key={category.categoryId}
              className={`nav-cat-pill${hoveredCategory === category.categoryId ? " nav-cat-pill-active" : ""}`}
              onMouseEnter={() => {
                if (!isMobile) setHoveredCategory(category.categoryId);
              }}
              onFocus={() => {
                if (!isMobile) setHoveredCategory(category.categoryId);
              }}
              onClick={() => navigate(toCatalogPath(category.categoryId))}
            >
              {category.name}
            </button>
          ))}
          <button
            className="nav-cat-pill nav-sell"
            onMouseEnter={() => setHoveredCategory(null)}
            onFocus={() => setHoveredCategory(null)}
            onClick={becomeSellerClick}
          >
            <SellRoundedIcon sx={{ fontSize: 14 }} />
            Become a Seller
          </button>
        </div>

        {!isMobile && hoveredCategory && (
          <div className="nav-hover-sheet-wrap">
            <div className="nav-hover-sheet">
              <CategorySheet
                selectedCategory={hoveredCategory}
                setShowSheet={(isOpen: boolean) => {
                  if (!isOpen) setHoveredCategory(null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerList
          onNavigate={(path) => {
            navigate(path);
            setDrawerOpen(false);
          }}
          onClose={() => setDrawerOpen(false)}
          onSearch={(query) => {
            dispatch(searchProduct(query));
            navigate(`/search-products?query=${encodeURIComponent(query)}`);
            setDrawerOpen(false);
          }}
          categories={mainCategory}
          hasSeller={Boolean(sellers.profile?.id)}
        />
      </Drawer>
    </header>
  );
};

export default Navbar;
