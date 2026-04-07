import React, { useState } from "react";
import SellerRoutes from "../../../routes/SellerRoutes";
import SellerDrawerList from "../../components/SideBar/DrawerList";

const C = {
  navy: "#232F3E",
  navyD: "#131921",
  navyL: "#37475A",
  orange: "#FF9900",
  white: "#FFFFFF",
  bg: "#F3F3F3",
};

const Topbar = ({ onMenuToggle }: { onMenuToggle: () => void }) => (
  <>
    <header
      style={{
        height: 58,
        flexShrink: 0,
        background: C.navyD,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 14,
      }}
    >
      <button
        onClick={onMenuToggle}
        style={{
          background: "none",
          border: "1px solid transparent",
          borderRadius: 3,
          width: 36,
          height: 36,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          color: C.white,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.white)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 18, height: 2, background: C.white, borderRadius: 1 }} />
        ))}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: C.white, letterSpacing: "-0.02em" }}>shopzy</span>
        <span style={{ fontSize: 10, color: C.orange, fontWeight: 700, marginTop: 8, letterSpacing: "0.02em" }}>
          seller
        </span>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.01em" }}>Dashboard</div>
      </div>
    </header>

    <div
      style={{
        height: 36,
        background: C.navyL,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 6,
        flexShrink: 0,
      }}
    >
      {["Orders", "Inventory", "Payments", "Settlements", "Reports"].map((item) => (
        <span
          key={item}
          style={{
            background: "none",
            border: "1px solid transparent",
            borderRadius: 3,
            padding: "4px 10px",
            fontSize: 13,
            fontWeight: 600,
            color: C.white,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  </>
);

const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          fontFamily: "'Amazon Ember','Arial',sans-serif",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-220px)",
            transition: "transform .22s ease",
            zIndex: 10,
          }}
        >
          <SellerDrawerList />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />

          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px 20px",
              background: C.bg,
            }}
          >
            <SellerRoutes />
          </main>
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
