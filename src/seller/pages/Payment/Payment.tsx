import React, { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSettlementSummary,
  fetchSettlements,
} from "../../../Redux Toolkit/Seller/settlementSlice";
import type { Settlement } from "../../../types/settlementTypes";
import { useNavigate } from "react-router-dom";
import { getSellerToken } from "../../../util/authToken";

const C = {
  navy: "#232F3E",
  orange: "#FF9900",
  white: "#FFFFFF",
  bg: "#F3F3F3",
  border: "#D5D9D9",
  soft: "#EAEDEE",
  text: "#0F1111",
  mid: "#565959",
  dim: "#8D9095",
  link: "#007185",
  green: "#067D62",
  greenBg: "#E6F4F1",
};

const TABS = [{ name: "Transactions" }, { name: "Settlements" }];

const SummaryCard = ({
  label,
  value,
  footer,
}: {
  label: string;
  value: string;
  footer: string;
}) => (
  <div
    style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderTop: `3px solid ${C.orange}`,
      borderRadius: 4,
      padding: "18px 20px",
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: C.mid,
        textTransform: "uppercase" as const,
        letterSpacing: "0.04em",
        marginBottom: 10,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>
      {value}
    </div>
    <div style={{ height: 1, background: C.soft, margin: "12px 0" }} />
    <div style={{ fontSize: 13, color: C.mid }}>{footer}</div>
  </div>
);

const Payment = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].name);
  const dispatch = useAppDispatch();
  const { sellers, settlement } = useAppSelector((s) => s);
  const jwt = getSellerToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) return;
    dispatch(fetchSettlementSummary({ jwt, query: { size: 5 } }));
    dispatch(fetchSettlements({ jwt, query: { size: 5, sort: "settlementDate,desc" } }));
  }, [dispatch, jwt]);

  const netPayable = settlement.summary?.totalNetAmount ?? sellers.report?.totalEarnings ?? 0;
  const pending = settlement.summary?.pendingCount ?? 0;
  const completed = settlement.summary?.completedCount ?? 0;

  const SettlementPreview = () => {
    const items: Settlement[] = settlement.items ?? [];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {settlement.loading && (
          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "16px",
              background: C.white,
              color: C.mid,
            }}
          >
            Loading settlements…
          </div>
        )}
        {!settlement.loading && items.length === 0 && (
          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "16px",
              background: C.white,
              color: C.dim,
            }}
          >
            No settlement records yet.
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "14px 16px",
              background: C.white,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: C.dim }}>Settlement #{item.id}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
                ₹{item.netSettlementAmount.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 12, color: C.mid }}>Order #{item.orderId}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: C.dim }}>Status</div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#E6F4F1",
                  border: `1px solid ${C.border}`,
                  fontWeight: 700,
                  fontSize: 12,
                  color: C.green,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                {item.settlementStatus.toLowerCase()}
              </div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: C.mid }}>
          Showing latest {items.length} settlements. Visit the Settlements tab for details.
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Payments</h1>
        <p style={{ fontSize: 13, color: C.mid, marginTop: 3 }}>
          Earnings overview &amp; transaction history
        </p>
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => navigate("/seller/settlements")}
            style={{
              border: "1px solid " + C.border,
              background: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            View full settlement dashboard →
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <SummaryCard
          label="Net Earnings"
          value={`₹${(netPayable ?? 0).toLocaleString("en-IN")}`}
          footer="After fees & taxes"
        />
        <SummaryCard label="Pending Settlements" value={`${pending}`} footer="Awaiting processing" />
        <SummaryCard label="Completed Settlements" value={`${completed}`} footer="Paid to your account" />
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${C.border}`,
          marginBottom: 16,
          gap: 0,
        }}
      >
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
                fontSize: 13.5,
                fontWeight: active ? 700 : 500,
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

      <div>{activeTab === "Transactions" ? <TransactionTable /> : <SettlementPreview />}</div>
    </div>
  );
};

export default Payment;
