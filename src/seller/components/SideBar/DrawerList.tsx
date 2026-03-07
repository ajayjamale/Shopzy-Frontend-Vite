import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ── Amazon Seller Central palette ─────────────────── */
const C = {
  bg:     "#232F3E",
  bgDark: "#131921",
  hover:  "rgba(255,255,255,0.06)",
  active: "rgba(255,153,0,0.12)",
  border: "#3A4A5C",
  orange: "#FF9900",
  white:  "#FFFFFF",
  dim:    "#C8D0D9",
  label:  "#7B8FA6",
};

/* ── SVG icon ───────────────────────────────────────── */
const Ic = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="currentColor" style={{ flexShrink: 0 }} aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard:   "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  orders:      "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z",
  products:    "M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z",
  addProduct:  "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  payment:     "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
  transaction: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  account:     "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  logout:      "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
};

type IconKey = keyof typeof ICONS;

/* ── NavIcon (unchanged — keeps className compat) ───── */
const NavIcon = ({ iconKey, active }: { iconKey: IconKey; active?: boolean }) => (
  <span
    className={active ? "text-white" : "text-primary-color"}
    style={{ display: "inline-flex", alignItems: "center" }}
  >
    <Ic d={ICONS[iconKey]} />
  </span>
);

/* ── menu data ──────────────────────────────────────── */
interface MenuItem {
  name:       string;
  path:       string;
  icon:       React.ReactNode;
  activeIcon: React.ReactNode;
}

const menu: MenuItem[] = [
  { name: "Dashboard",   path: "/seller",             icon: <NavIcon iconKey="dashboard"   />, activeIcon: <NavIcon iconKey="dashboard"   active /> },
  { name: "Orders",      path: "/seller/orders",      icon: <NavIcon iconKey="orders"      />, activeIcon: <NavIcon iconKey="orders"      active /> },
  { name: "Products",    path: "/seller/products",    icon: <NavIcon iconKey="products"    />, activeIcon: <NavIcon iconKey="products"    active /> },
  { name: "Add Product", path: "/seller/add-product", icon: <NavIcon iconKey="addProduct"  />, activeIcon: <NavIcon iconKey="addProduct"  active /> },
  { name: "Payment",     path: "/seller/payment",     icon: <NavIcon iconKey="payment"     />, activeIcon: <NavIcon iconKey="payment"     active /> },
  { name: "Transaction", path: "/seller/transaction", icon: <NavIcon iconKey="transaction" />, activeIcon: <NavIcon iconKey="transaction" active /> },
];

const menu2: MenuItem[] = [
  { name: "Account", path: "/seller/account", icon: <NavIcon iconKey="account" />, activeIcon: <NavIcon iconKey="account" active /> },
  { name: "Logout",  path: "/",               icon: <NavIcon iconKey="logout"  />, activeIcon: <NavIcon iconKey="logout"  active /> },
];

/* ── NavRow ─────────────────────────────────────────── */
const NavRow = ({
  item,
  isActive,
  onClick,
}: {
  item:     MenuItem;
  isActive: boolean;
  onClick:  () => void;
}) => {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        10,
        width:      "100%",
        padding:    "9px 16px",
        border:     "none",
        borderLeft: `3px solid ${isActive ? C.orange : "transparent"}`,
        background: isActive ? C.active : hover ? C.hover : "transparent",
        cursor:     "pointer",
        fontFamily: "inherit",
        fontSize:   13.5,
        fontWeight: isActive ? 700 : 400,
        color:      isActive ? C.orange : hover ? C.white : C.dim,
        transition: "all .12s",
        textAlign:  "left" as const,
      }}
    >
      <span style={{ color: isActive ? C.orange : hover ? C.white : C.dim, display: "flex" }}>
        {isActive ? item.activeIcon : item.icon}
      </span>
      {item.name}
    </button>
  );
};

/* ── SellerDrawerList ───────────────────────────────── */
interface DrawerListProps {
  toggleDrawer?: any;
}

const SellerDrawerList = ({ toggleDrawer }: DrawerListProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    toggleDrawer?.();
  };

  return (
    <div style={{
      width:         220,
      height:        "100vh",
      background:    C.bg,
      display:       "flex",
      flexDirection: "column",
      fontFamily:    "inherit",
    }}>

      {/* brand */}
      <div style={{
        padding:      "14px 16px",
        borderBottom: `1px solid ${C.border}`,
        display:      "flex",
        alignItems:   "center",
        gap:          10,
        flexShrink:   0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 4,
          background: C.orange,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 17, color: C.bgDark, flexShrink: 0,
        }}>
          S
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.white, letterSpacing: "-0.01em" }}>
            Shopzy
          </div>
          <div style={{ fontSize: 9.5, color: C.label, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
            Seller Central
          </div>
        </div>
      </div>

      {/* primary nav */}
      <nav style={{ flex: 1, paddingTop: 6, overflowY: "auto" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: C.label,
          letterSpacing: "0.1em", textTransform: "uppercase" as const,
          padding: "10px 16px 4px",
        }}>
          Manage
        </div>

        {menu.map((item) => (
          <NavRow
            key={item.name}
            item={item}
            isActive={location.pathname === item.path}
            onClick={() => go(item.path)}
          />
        ))}

        <div style={{ height: 1, background: C.border, margin: "8px 0" }} />

        <div style={{
          fontSize: 10, fontWeight: 700, color: C.label,
          letterSpacing: "0.1em", textTransform: "uppercase" as const,
          padding: "6px 16px 4px",
        }}>
          Account
        </div>

        {menu2.map((item) => (
          <NavRow
            key={item.name}
            item={item}
            isActive={location.pathname === item.path}
            onClick={() => go(item.path)}
          />
        ))}
      </nav>

      {/* user footer */}
      <div style={{
        flexShrink:  0,
        background:  C.bgDark,
        borderTop:   `1px solid ${C.border}`,
        padding:     "11px 14px",
        display:     "flex",
        alignItems:  "center",
        gap:         10,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: C.orange,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.bgDark, fontWeight: 800, fontSize: 15, flexShrink: 0,
        }}>
          S
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: C.white,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
          }}>
            Seller Account
          </div>
          <div style={{ fontSize: 11, color: C.label }}>Pro Plan</div>
        </div>
      </div>

    </div>
  );
};

export default SellerDrawerList;