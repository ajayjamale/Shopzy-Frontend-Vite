import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSettlementSummary,
  fetchSettlements,
  setSettlementFilters,
} from "../../../Redux Toolkit/Seller/settlementSlice";
import type { SettlementStatus } from "../../../types/settlementTypes";
import SettlementTable from "./SettlementTable";
import { getSellerToken } from "../../../util/authToken";

const C = {
  text: "#0F1111",
  mid: "#4B5563",
  dim: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  bg: "#F5F6F8",
  accent: "#F59E0B",
};

const statusOptions: (SettlementStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "ELIGIBLE",
  "ON_HOLD",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

const SummaryCard = ({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "danger" | "muted";
}) => {
  const toneColor =
    tone === "success" ? "#0F9D58" : tone === "danger" ? "#CC0C39" : tone === "muted" ? "#6B7280" : C.text;
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "16px 18px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        minHeight: 120,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: toneColor, marginTop: 6 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: C.mid, marginTop: 6 }}>{hint}</div>}
    </div>
  );
};

const SettlementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { settlement } = useAppSelector((s) => s);
  const jwt = useMemo(() => getSellerToken(), []);

  const [status, setStatus] = useState<SettlementStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const refresh = () => {
    if (!jwt) return;
    const query = {
      status: status === "ALL" ? undefined : status,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    };
    dispatch(setSettlementFilters(query));
    dispatch(fetchSettlements({ jwt, query }));
    dispatch(fetchSettlementSummary({ jwt, query }));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fromDate, toDate]);

  const summary = settlement.summary;
  const formatCurrency = (v?: number) =>
    `₹${(v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>Settlements</h1>
          <p style={{ margin: "4px 0 0", color: C.mid }}>
            Track payouts, fees, and statuses for your completed orders.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/seller/payment")}
            style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              borderRadius: 10,
              padding: "9px 14px",
              cursor: "pointer",
              fontWeight: 600,
              color: C.text,
            }}
          >
            Back to Payments
          </button>
          <button
            onClick={refresh}
            style={{
              border: "none",
              background: C.accent,
              color: "#111",
              borderRadius: 10,
              padding: "9px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 12,
          background: C.card,
          border: `1px solid ${C.border}`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: "0.04em" }}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SettlementStatus | "ALL")}
            style={{
              padding: "9px 10px",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              fontSize: 14,
            }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: "0.04em" }}>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: "9px 10px",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              fontSize: 14,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim, letterSpacing: "0.04em" }}>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
            style={{
              padding: "9px 10px",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <SummaryCard
          label="Net Payable"
          value={formatCurrency(summary?.totalNetAmount)}
          hint="After commissions, platform fees, and taxes"
          tone="success"
        />
        <SummaryCard
          label="Gross Volume"
          value={formatCurrency(summary?.totalGrossAmount)}
          hint={formatCurrency(summary?.totalCommission) + " commission, " + formatCurrency(summary?.totalPlatformFee) + " platform"}
        />
        <SummaryCard
          label="Pending Settlements"
          value={`${summary?.pendingCount ?? 0}`}
          hint="Awaiting processing"
          tone="muted"
        />
        <SummaryCard
          label="Failed / Cancelled"
          value={`${(summary?.failedCount ?? 0) + (summary?.cancelledCount ?? 0)}`}
          hint="Requires follow-up"
          tone="danger"
        />
      </div>

      {/* Table */}
      <div style={{ marginTop: 18 }}>
        <SettlementTable
          items={settlement.items}
          loading={settlement.loading}
          error={settlement.error}
          onRetry={refresh}
        />
      </div>
    </div>
  );
};

export default SettlementPage;
