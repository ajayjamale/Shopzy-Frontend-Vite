import React, { useState } from "react";
import TransactionTable from "./TransactionTable";
import PayoutsTable     from "./PayoutsTable";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const C = {
  navy:    "#232F3E",
  orange:  "#FF9900",
  white:   "#FFFFFF",
  bg:      "#F3F3F3",
  border:  "#D5D9D9",
  soft:    "#EAEDEE",
  text:    "#0F1111",
  mid:     "#565959",
  dim:     "#8D9095",
  link:    "#007185",
  green:   "#067D62",
  greenBg: "#E6F4F1",
};

const TABS = [{ name: "Transaction" }];

/* ── summary card ────────────────────────────────────── */
const SummaryCard = ({
  label, value, footer,
}: {
  label: string; value: string; footer: string;
}) => (
  <div style={{
    background: C.white,
    border: `1px solid ${C.border}`,
    borderTop: `3px solid ${C.orange}`,
    borderRadius: 4,
    padding: "18px 20px",
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, textTransform: "uppercase" as const,
      letterSpacing: "0.04em", marginBottom: 10 }}>
      {label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
      {value}
    </div>
    <div style={{ height: 1, background: C.soft, margin: "12px 0" }} />
    <div style={{ fontSize: 13, color: C.mid }}>{footer}</div>
  </div>
);

/* ── Payment ─────────────────────────────────────────── */
const Payment = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].name);
  const { sellers }               = useAppSelector((s) => s);

  return (
    <div style={{ fontFamily: "inherit" }}>

      {/* page heading */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Payments</h1>
        <p style={{ fontSize: 13, color: C.mid, marginTop: 3 }}>
          Earnings overview &amp; transaction history
        </p>
      </div>

      {/* summary cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 14,
        marginBottom: 28,
      }}>
        <SummaryCard
          label="Total Earnings"
          value={`₹${(sellers.report?.totalEarnings ?? 0).toLocaleString("en-IN")}`}
          footer="Last payment: ₹0"
        />
      </div>

      {/* tab bar */}
      <div style={{
        display: "flex",
        borderBottom: `2px solid ${C.border}`,
        marginBottom: 16,
        gap: 0,
      }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              style={{
                padding: "9px 18px",
                border: "none",
                borderBottom: `2px solid ${active ? C.orange : "transparent"}`,
                marginBottom: -2,
                background: "transparent",
                fontSize: 13.5, fontWeight: active ? 700 : 500,
                color: active ? C.orange : C.mid,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color .14s, border-color .14s",
                whiteSpace: "nowrap" as const,
              }}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* tab content */}
      <div>
        {activeTab === "Transaction" ? <TransactionTable /> : <PayoutsTable />}
      </div>

    </div>
  );
};

export default Payment;