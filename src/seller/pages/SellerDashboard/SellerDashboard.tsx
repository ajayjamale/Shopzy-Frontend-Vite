import React, { useState } from "react";
import SellerRoutes     from "../../../routes/SellerRoutes";
import SellerDrawerList from "../../components/SideBar/DrawerList";

/* ── Amazon tokens ──────────────────────────────────── */
const C = {
  navy:    "#232F3E",
  navyD:   "#131921",
  navyL:   "#37475A",
  orange:  "#FF9900",
  white:   "#FFFFFF",
  bg:      "#F3F3F3",
  border:  "#DDDDDD",
  text:    "#0F1111",
  mid:     "#565959",
  dim:     "#767676",
  link:    "#007185",
};

/* ── Search bar ─────────────────────────────────────── */
const SearchBar = () => (
  <div style={{ flex: 1, maxWidth: 600, display: "flex", height: 38 }}>
    {/* category select */}
    <select style={{
      background: "linear-gradient(to bottom,#f3f3f3,#ddd)",
      border: "none", borderRadius: "4px 0 0 4px",
      borderRight: "1px solid #cdba96",
      padding: "0 8px", fontSize: 12,
      color: C.text, cursor: "pointer",
      outline: "none", fontFamily: "inherit",
    }}>
      <option>All</option>
      <option>Orders</option>
      <option>Products</option>
    </select>

    <input
      placeholder="Search orders, products, customers…"
      style={{
        flex: 1, border: "none", outline: "none",
        padding: "0 12px", fontSize: 14, color: C.text,
        background: C.white,
      }}
    />

    {/* search button */}
    <button style={{
      background: "linear-gradient(to bottom,#f3d078,#e8a613)",
      border: "none", borderRadius: "0 4px 4px 0",
      padding: "0 14px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={C.navyD}>
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    </button>
  </div>
);

/* ── Topbar ─────────────────────────────────────────── */
const Topbar = ({ onMenuToggle }: { onMenuToggle: () => void }) => (
  <>
    {/* primary nav bar */}
    <header style={{
      height: 58, flexShrink: 0,
      background: C.navyD,
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: 14,
    }}>
      {/* hamburger */}
      <button onClick={onMenuToggle} style={{
        background: "none", border: "1px solid transparent",
        borderRadius: 3, width: 36, height: 36, cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 4, flexShrink: 0,
        color: C.white,
      }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.white)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ width: 18, height: 2, background: C.white, borderRadius: 1 }} />
        ))}
      </button>

      {/* logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: C.white, letterSpacing: "-0.02em" }}>shopzy</span>
        <span style={{ fontSize: 10, color: C.orange, fontWeight: 700, marginTop: 8, letterSpacing: "0.02em" }}>seller</span>
      </div>

      <SearchBar />

      {/* right icons */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        {/* notifications */}
        <button style={{
          background: "none", border: "1px solid transparent",
          borderRadius: 3, padding: "4px 8px",
          cursor: "pointer", color: C.white, position: "relative",
          display: "flex", alignItems: "center", gap: 4,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.white)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.white}>
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span style={{
            position: "absolute", top: 2, right: 4,
            width: 16, height: 16, borderRadius: "50%",
            background: C.orange, color: C.navyD,
            fontSize: 9, fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>3</span>
        </button>

        {/* account */}
        <button style={{
          background: "none", border: "1px solid transparent",
          borderRadius: 3, padding: "4px 8px",
          cursor: "pointer", textAlign: "left" as const,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.white)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          <div style={{ fontSize: 10, color: "#ccc" }}>Hello, Seller</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>Account &amp; Settings ▾</div>
        </button>
      </div>
    </header>

    {/* secondary nav bar */}
    <div style={{
      height: 36, background: C.navyL,
      display: "flex", alignItems: "center",
      padding: "0 16px", gap: 2, flexShrink: 0,
    }}>
      {["Catalog", "Inventory", "Pricing", "Orders", "Advertising", "Reports", "Performance"].map((item) => (
        <button key={item} style={{
          background: "none", border: "1px solid transparent",
          borderRadius: 3, padding: "4px 10px",
          cursor: "pointer", fontFamily: "inherit",
          fontSize: 13, fontWeight: 600, color: C.white,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.white)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
        >
          {item}
        </button>
      ))}
    </div>
  </>
);

/* ── SellerDashboard ─────────────────────────────────── */
const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Amazon+Ember:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Amazon Ember', 'Arial', sans-serif;
          background: #F3F3F3;
          -webkit-font-smoothing: antialiased;
        }
        input, button, select { font-family: inherit; }
        ::-webkit-scrollbar       { width: 6px; }
        ::-webkit-scrollbar-track { background: #F3F3F3; }
        ::-webkit-scrollbar-thumb { background: #BBBBBB; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #999; }
      `}</style>

      <div style={{
        display: "flex", height: "100vh",
        overflow: "hidden",
        fontFamily: "'Amazon Ember', 'Arial', sans-serif",
      }}>

        {/* sidebar */}
        <div style={{
          flexShrink: 0,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-220px)",
          transition: "transform .22s ease",
          zIndex: 10,
        }}>
          <SellerDrawerList />
        </div>

        {/* right column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />

          <main style={{
            flex: 1, overflowY: "auto",
            padding: "18px 20px",
            background: C.bg,
          }}>
            <SellerRoutes />
          </main>
        </div>

      </div>
    </>
  );
};

export default SellerDashboard;