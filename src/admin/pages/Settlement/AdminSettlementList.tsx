import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSettlementSummary,
  fetchSettlements,
  updateSettlementStatus,
} from "../../../Redux Toolkit/Seller/settlementSlice";
import type { SettlementStatus } from "../../../types/settlementTypes";
import { getAdminToken } from "../../../util/authToken";

const C = {
  text: "#0F1111",
  mid: "#4B5563",
  dim: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  bg: "#F5F6F8",
  accent: "#FF9900",
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

const formatCurrency = (v?: number) =>
  `₹${(v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const StatusSelect = ({
  current,
  onChange,
}: {
  current: SettlementStatus;
  onChange: (v: SettlementStatus) => void;
}) => (
  <select
    value={current}
    onChange={(e) => onChange(e.target.value as SettlementStatus)}
    style={{
      padding: "6px 8px",
      borderRadius: 8,
      border: `1px solid ${C.border}`,
      fontSize: 12,
    }}
  >
    {statusOptions
      .filter((s) => s !== "ALL")
      .map((s) => (
        <option key={s} value={s}>
          {s.toLowerCase()}
        </option>
      ))}
  </select>
);

const AdminSettlementList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { settlement } = useAppSelector((s) => s);
  const jwt = useMemo(() => getAdminToken(), []);

  const [status, setStatus] = useState<SettlementStatus | "ALL">("ALL");
  const [sellerId, setSellerId] = useState<string>("");

  const load = () => {
    if (!jwt) return;
    const query = {
      status: status === "ALL" ? undefined : status,
      sellerId: sellerId ? Number(sellerId) : undefined,
      size: 30,
      sort: "createdAt,desc",
    };
    dispatch(fetchSettlements({ jwt, query }));
    dispatch(fetchSettlementSummary({ jwt, query }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sellerId]);

  const handleStatus = (id: number, next: SettlementStatus) => {
    dispatch(updateSettlementStatus({ jwt, id, status: next }));
  };

  const summary = settlement.summary;

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text }}>Settlement Console</h1>
          <p style={{ margin: "4px 0 0", color: C.mid }}>Monitor payouts across all sellers</p>
        </div>
        <button
          onClick={load}
          style={{
            border: "none",
            background: C.accent,
            color: "#111",
            padding: "9px 14px",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: C.card,
          border: `1px solid ${C.border}`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SettlementStatus | "ALL")}
            style={{ padding: "9px 10px", borderRadius: 10, border: `1px solid ${C.border}` }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Seller ID</label>
          <input
            placeholder="Filter by seller"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            style={{ padding: "9px 10px", borderRadius: 10, border: `1px solid ${C.border}` }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, color: C.dim, letterSpacing: "0.08em" }}>NET PAYABLE</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{formatCurrency(summary?.totalNetAmount)}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, color: C.dim, letterSpacing: "0.08em" }}>PENDING</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{summary?.pendingCount ?? 0}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, color: C.dim, letterSpacing: "0.08em" }}>FAILED/CANCELLED</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
            {(summary?.failedCount ?? 0) + (summary?.cancelledCount ?? 0)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: "hidden",
          background: C.card,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
            <thead>
              <tr style={{ background: "#232F3E", color: "#fff" }}>
                {["ID", "Seller", "Order", "Net Amount", "Status", "Date", "Action"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textAlign: i >= 3 ? "right" : "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settlement.loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "30px 0", color: C.mid }}>
                    Loading settlements…
                  </td>
                </tr>
              ) : settlement.items.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "30px 0", color: C.mid }}>
                    No settlements found.
                  </td>
                </tr>
              ) : (
                settlement.items.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{ background: idx % 2 ? "#F9FAFB" : C.card, borderBottom: `1px solid ${C.border}` }}
                  >
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "#2563EB" }}>#{item.id}</td>
                    <td style={{ padding: "12px 14px", color: C.text }}>
                      <div style={{ fontWeight: 600 }}>Seller #{item.sellerId}</div>
                      <div style={{ fontSize: 12, color: C.dim }}>{item.transactionId ?? "—"}</div>
                    </td>
                    <td style={{ padding: "12px 14px", color: C.mid }}>Order #{item.orderId}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700 }}>
                      {formatCurrency(item.netSettlementAmount)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <StatusSelect current={item.settlementStatus} onChange={(v) => handleStatus(item.id, v)} />
                    </td>
                    <td style={{ padding: "12px 14px", color: C.dim, textAlign: "right" }}>
                      {item.settlementDate?.split("T")[0] ?? item.createdAt?.split("T")[0] ?? "—"}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <button
                        onClick={() => navigate(`/admin/settlements/${item.id}`)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: `1px solid ${C.border}`,
                          background: C.card,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSettlementList;
