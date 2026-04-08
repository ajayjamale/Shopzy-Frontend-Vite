import React, { useEffect, useMemo, useState } from "react";
import { clearReturnError, fetchReturnRequests, updateReturnStatus } from "../../../store/customer/ReturnSlice";
import { useAppDispatch, useAppSelector } from "../../../store";
import type { ReturnRequest, ReturnStatus } from "../../../types/orderTypes";
import { getAdminToken } from "../../../utils/authToken";

const ALL_STATUSES: ReturnStatus[] = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "PICKUP_SCHEDULED",
  "RECEIVED",
  "REFUND_INITIATED",
  "REFUNDED",
];

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const cell: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #E5E7EB",
  fontSize: 13,
  color: "#111827",
  verticalAlign: "top",
};

const statusStyle = (status?: ReturnStatus): React.CSSProperties => ({
  display: "inline-block",
  borderRadius: 999,
  padding: "4px 10px",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.02em",
  background:
    status === "REFUNDED"
      ? "#DCFCE7"
      : status === "REJECTED"
      ? "#FEE2E2"
      : "#FEF3C7",
  color:
    status === "REFUNDED"
      ? "#166534"
      : status === "REJECTED"
      ? "#991B1B"
      : "#92400E",
});

const AdminReturns: React.FC = () => {
  const dispatch = useAppDispatch();
  const { returns } = useAppSelector((s) => s);
  const jwt = useMemo(() => getAdminToken(), []);
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [comments, setComments] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!jwt) return;
    dispatch(fetchReturnRequests({ jwt }));
    return () => {
      dispatch(clearReturnError());
    };
  }, [dispatch, jwt]);

  const rows = useMemo(() => {
    return returns.requests.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return [
        item.id,
        item.orderId,
        item.orderItemId,
        item.userId,
        item.sellerId,
        item.reason,
        item.description,
        item.adminComment,
        item.status,
      ]
        .map((v) => String(v ?? "").toLowerCase())
        .some((v) => v.includes(q));
    });
  }, [returns.requests, statusFilter, query]);

  const handleStatusUpdate = (item: ReturnRequest, status: ReturnStatus) => {
    if (!item.id || !jwt || item.status === status) return;
    dispatch(
      updateReturnStatus({
        jwt,
        id: item.id,
        status,
        adminComment: comments[item.id]?.trim() || undefined,
      })
    );
  };

  if (!jwt) {
    return <div style={{ padding: 20 }}>Admin token not found. Please login again.</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24 }}>Return Management</h2>
          <p style={{ margin: "6px 0 0", color: "#4B5563", fontSize: 13 }}>
            Review customer return requests and update lifecycle states.
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchReturnRequests({ jwt }))}
          style={{
            border: "none",
            background: "#111827",
            color: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          marginTop: 14,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 12,
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 12,
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReturnStatus | "ALL")}
          style={{ border: "1px solid #D1D5DB", borderRadius: 10, padding: "10px 12px" }}
        >
          <option value="ALL">All statuses</option>
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by return/order/user/seller/reason"
          style={{ border: "1px solid #D1D5DB", borderRadius: 10, padding: "10px 12px" }}
        />
      </div>

      {returns.error && (
        <div
          style={{
            marginTop: 12,
            background: "#FEE2E2",
            border: "1px solid #FCA5A5",
            color: "#991B1B",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {returns.error}
        </div>
      )}

      <div style={{ marginTop: 14, border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1320 }}>
            <thead>
              <tr style={{ background: "#111827", color: "#fff" }}>
                {["Return", "Order", "Buyer/Seller", "Reason", "Qty", "Status", "Admin Comment", "Created", "Action"].map((h) => (
                  <th key={h} style={{ padding: "11px 12px", textAlign: "left", fontSize: 12, letterSpacing: "0.03em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {returns.loading ? (
                <tr>
                  <td colSpan={9} style={{ ...cell, textAlign: "center", padding: "26px 0", color: "#6B7280" }}>
                    Loading returns...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...cell, textAlign: "center", padding: "26px 0", color: "#6B7280" }}>
                    No return requests found.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id}>
                    <td style={cell}>#{item.id}</td>
                    <td style={cell}>
                      <div>Order #{item.orderId}</div>
                      <div style={{ color: "#6B7280", marginTop: 4 }}>Item #{item.orderItemId}</div>
                    </td>
                    <td style={cell}>
                      <div>User #{item.userId ?? "N/A"}</div>
                      <div style={{ color: "#6B7280", marginTop: 4 }}>Seller #{item.sellerId ?? "N/A"}</div>
                    </td>
                    <td style={cell}>
                      <div style={{ fontWeight: 700 }}>{item.reason}</div>
                      {item.description && <div style={{ color: "#6B7280", marginTop: 4 }}>{item.description}</div>}
                    </td>
                    <td style={cell}>{item.quantity}</td>
                    <td style={cell}>
                      <span style={statusStyle(item.status)}>{item.status ?? "N/A"}</span>
                    </td>
                    <td style={cell}>
                      <textarea
                        value={comments[item.id ?? 0] ?? item.adminComment ?? ""}
                        onChange={(e) =>
                          setComments((prev) => ({
                            ...prev,
                            [item.id ?? 0]: e.target.value,
                          }))
                        }
                        rows={2}
                        placeholder="Optional note"
                        style={{
                          width: 240,
                          border: "1px solid #D1D5DB",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 12,
                          resize: "vertical",
                        }}
                      />
                    </td>
                    <td style={cell}>{formatDateTime(item.createdAt)}</td>
                    <td style={cell}>
                      <select
                        value={item.status ?? "REQUESTED"}
                        onChange={(e) => handleStatusUpdate(item, e.target.value as ReturnStatus)}
                        style={{ border: "1px solid #D1D5DB", borderRadius: 8, padding: "8px 10px", minWidth: 170 }}
                      >
                        {ALL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
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

export default AdminReturns;
