import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { IconButton } from "@mui/material";
import { useState } from "react";

interface Category {
  categoryId: string;
  name: string;
}

interface DrawerListProps {
  onNavigate: (path: string) => void;
  onClose: () => void;
  onSearch: (query: string) => void;
  categories: Category[];
  hasSeller: boolean;
}

const DrawerList = ({ onNavigate, onClose, onSearch, categories, hasSeller }: DrawerListProps) => {
  const [query, setQuery] = useState("");

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "My Account", path: "/account/profile" },
    { label: "Orders", path: "/account/orders" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Cart", path: "/cart" },
    { label: hasSeller ? "Seller Dashboard" : "Become Seller", path: hasSeller ? "/seller" : "/become-seller" },
  ];

  return (
    <div className="nav-drawer">
      <div className="flex items-center justify-between">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>Browse</h3>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </div>

      <div className="nav-search" style={{ height: 42 }}>
        <SearchRoundedIcon sx={{ color: "#64748B", fontSize: 20 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && query.trim() && onSearch(query.trim())}
          placeholder="Search"
        />
        <button onClick={() => query.trim() && onSearch(query.trim())}>
          <SearchRoundedIcon sx={{ fontSize: 19 }} />
        </button>
      </div>

      <div>
        <p className="section-kicker" style={{ marginBottom: 8 }}>Quick Links</p>
        <div className="nav-drawer-list">
          {quickLinks.map((link) => (
            <button
              key={link.path}
              className="nav-drawer-item"
              onClick={() => onNavigate(link.path)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-kicker" style={{ marginBottom: 8 }}>Categories</p>
        <div className="nav-drawer-list">
          {categories.map((category) => (
            <button
              key={category.categoryId}
              className="nav-drawer-item"
              onClick={() => onNavigate(`/products/${category.categoryId}`)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawerList;
