import { useLocation, useNavigate } from "react-router-dom";

const menu = [
  ["Overview", "/seller"],
  ["Orders", "/seller/orders"],
  ["Returns", "/seller/returns"],
  ["Inventory", "/seller/inventory"],
  ["Products", "/seller/products"],
  ["Add Product", "/seller/add-product"],
  ["Payments", "/seller/payment"],
  ["Settlements", "/seller/settlements"],
  ["Transactions", "/seller/transaction"],
  ["Account", "/seller/account"],
];

const SellerDrawerList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      style={{
        width: 250,
        minHeight: "100%",
        background: "#ffffff",
        borderRight: "1px solid #DCE8EC",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #E6EFF2" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748B", fontWeight: 700 }}>Seller Console</p>
        <h2 style={{ fontSize: "1.25rem", marginTop: 4 }}>Shopzy Pro</h2>
      </div>

      <nav style={{ padding: 10, display: "grid", gap: 6, alignContent: "start" }}>
        {menu.map(([label, path]) => {
          const active = location.pathname === path || location.pathname.startsWith(`${path}/`);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                border: "1px solid",
                borderColor: active ? "#6DB4AD" : "transparent",
                background: active ? "#EAF7F5" : "transparent",
                color: active ? "#0F766E" : "#334155",
                borderRadius: 11,
                textAlign: "left",
                padding: "9px 11px",
                fontSize: "0.84rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid #E6EFF2", padding: "12px 14px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("seller_jwt");
            navigate("/");
          }}
          style={{
            width: "100%",
            border: "1px solid #F4CDD5",
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

export default SellerDrawerList;
