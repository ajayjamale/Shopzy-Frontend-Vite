import React from "react";
import type { Settlement, SettlementStatus } from "../../../types/settlementTypes";
import { useNavigate } from "react-router-dom";

const C = {
  navy: "#232F3E",
  white: "#FFFFFF",
  bg: "#F9FAFB",
  border: "#E5E7EB",
  soft: "#EEF1F4",
  text: "#0F1111",
  mid: "#4B5563",
  dim: "#9CA3AF",
  green: "#0F9D58",
  red: "#CC0C39",
  orange: "#F59E0B",
  blue: "#2563EB",
};

const STATUS: Record<SettlementStatus, { color: string; bg: string }> = {
  PENDING: { color: "#F59E0B", bg: "#FEF3C7" },
  PROCESSING: { color: "#2563EB", bg: "#E0E7FF" },
  ELIGIBLE: { color: "#0EA5E9", bg: "#E0F2FE" },
  ON_HOLD: { color: "#D97706", bg: "#FFF7ED" },
  COMPLETED: { color: "#0F9D58", bg: "#E6F4F1" },
  FAILED: { color: "#CC0C39", bg: "#FEE2E2" },
  CANCELLED: { color: "#6B7280", bg: "#F3F4F6" },
};

const formatCurrency = (value?: number) =>
  `₹${(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "—";

const StatusBadge = ({ status }: { status: SettlementStatus }) => {
  const s = STATUS[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 999,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}33`,
        letterSpacing: "0.02em",
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
      {status.toLowerCase()}
    </span>
  );
};

interface SettlementTableProps {
  items: Settlement[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const SettlementTable: React.FC<SettlementTableProps> = ({ items, loading, error, onRetry }) => {
  const navigate = useNavigate();

  const EmptyState = () => (
    <tr>
      <td colSpan={7} style={{ padding: "36px 0", textAlign: "center", color: C.dim, fontSize: 14 }}>
        {error ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <span>{error}</span>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.white,
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  color: C.text,
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          "No settlements available yet."
        )}
      </td>
    </tr>
  );

  const LoadingRow = () => (
    <tr>
      <td colSpan={7} style={{ padding: "28px 0", textAlign: "center", color: C.mid }}>
        Loading settlements…
      </td>
    </tr>
  );

  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        background: C.white,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
          <thead>
            <tr style={{ background: C.navy }}>
              {["Settlement", "Order", "Gross", "Fees / Commission", "Net Payable", "Status", "Date"].map(
                (h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.white,
                      letterSpacing: "0.04em",
                      textAlign: i >= 2 ? "right" : "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow />
            ) : items.length === 0 ? (
              <EmptyState />
            ) : (
              items.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    background: idx % 2 ? C.bg : C.white,
                    borderBottom: `1px solid ${C.soft}`,
                  }}
                >
                  <td style={{ padding: "14px", fontSize: 13, fontWeight: 700, color: C.blue }}>
                    #{item.id}
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{item.transactionId ?? "—"}</div>
                  </td>

                  <td style={{ padding: "14px", fontSize: 13, color: C.text }}>
                    <div style={{ fontWeight: 600 }}>Order #{item.orderId}</div>
                    <div style={{ fontSize: 12, color: C.dim }}>{item.orderReference ?? "Ref not provided"}</div>
                  </td>

                  <td style={{ padding: "14px", fontSize: 13, textAlign: "right", color: C.text }}>
                    {formatCurrency(item.grossAmount)}
                  </td>

                  <td style={{ padding: "14px", fontSize: 13, textAlign: "right", color: C.mid }}>
                    <div>Commission: {formatCurrency(item.commissionAmount)}</div>
                    <div>Platform: {formatCurrency(item.platformFee)}</div>
                    {item.taxAmount !== undefined && (
                      <div>Tax: {formatCurrency(item.taxAmount)}</div>
                    )}
                  </td>

                  <td style={{ padding: "14px", fontSize: 14, textAlign: "right", fontWeight: 700, color: C.green }}>
                    {formatCurrency(item.netSettlementAmount)}
                  </td>

                  <td style={{ padding: "14px", textAlign: "left" }}>
                    <StatusBadge status={item.settlementStatus} />
                  </td>

                  <td style={{ padding: "14px", textAlign: "right", fontSize: 12, color: C.mid, whiteSpace: "nowrap" }}>
                    {formatDate(item.settlementDate || item.createdAt)}
                    <div>
                      <button
                        onClick={() => navigate(`/seller/settlements/${item.id}`)}
                        style={{
                          marginTop: 6,
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: `1px solid ${C.border}`,
                          background: C.white,
                          cursor: "pointer",
                          fontSize: 12,
                          color: C.text,
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlementTable;
