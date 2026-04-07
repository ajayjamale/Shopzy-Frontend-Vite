import React, { useCallback, useEffect, useMemo, useState } from "react";
import { clearReturnError, fetchReturnRequests, updateReturnStatus } from "../../../Redux Toolkit/Customer/ReturnSlice";
import { fetchSellerOrders } from "../../../Redux Toolkit/Seller/sellerOrderSlice";
import { fetchSellerReport } from "../../../Redux Toolkit/Seller/sellerSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import type { ReturnStatus } from "../../../types/orderTypes";
import { getSellerToken } from "../../../util/authToken";

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

const SellerReturns: React.FC = () => {
  const dispatch = useAppDispatch();
  const { returns } = useAppSelector((s) => s);
  const jwt = useMemo(() => getSellerToken(), []);
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const syncSellerData = useCallback(() => {
    if (!jwt) return;
    dispatch(fetchReturnRequests({ jwt }));
    dispatch(fetchSellerOrders(jwt));
    dispatch(fetchSellerReport(jwt));
  }, [dispatch, jwt]);

  useEffect(() => {
    if (!jwt) return;
    syncSellerData();
    const refreshOnFocus = () => syncSellerData();
    window.addEventListener("focus", refreshOnFocus);
    const intervalId = window.setInterval(syncSellerData, 30000);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshOnFocus);
      dispatch(clearReturnError());
    };
  }, [dispatch, jwt, syncSellerData]);

  const rows = useMemo(() => {
    return returns.requests.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return [item.id, item.orderId, item.orderItemId, item.reason, item.description, item.status]
        .map((v) => String(v ?? "").toLowerCase())
        .some((v) => v.includes(q));
    });
  }, [returns.requests, statusFilter, query]);

  const handleStatusUpdate = async (id: number | undefined, current: ReturnStatus | undefined, next: ReturnStatus) => {
    if (!id || !jwt || !next || current === next) return;
    try {
      await dispatch(updateReturnStatus({ jwt, id, status: next })).unwrap();
      syncSellerData();
    } catch {
      // Handled by return slice error state.
    }
  };

  if (!jwt) {
    return <div style={{ padding: 20 }}>Seller token not found. Please login again.</div>;
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: "#111827" }}>Returns</h2>
          <p style={{ margin: "6px 0 0", color: "#4B5563", fontSize: 13 }}>
            Track buyer requests and update return progress.
          </p>
        </div>
        <button
          onClick={syncSellerData}
          style={{
            border: "none",
            background: "#FF9900",
            color: "#111827",
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
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          background: "#fff",
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
          placeholder="Search by return/order/reason/status"
          style={{ border: "1px solid #D1D5DB", borderRadius: 10, padding: "10px 12px" }}
        />
      </div>

      {returns.error && (
        <div
          style={{
            marginTop: 12,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1080 }}>
            <thead>
              <tr style={{ background: "#111827", color: "#fff" }}>
                {["Return", "Order", "Reason", "Qty", "Status", "Created", "Update"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 12px", fontSize: 12, letterSpacing: "0.03em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {returns.loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "26px 0", color: "#6B7280" }}>
                    Loading returns...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "26px 0", color: "#6B7280" }}>
                    No return requests found.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>#{item.id}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
                      <div>Order #{item.orderId}</div>
                      <div style={{ color: "#6B7280", marginTop: 4 }}>Item #{item.orderItemId}</div>
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
                      <div style={{ fontWeight: 700 }}>{item.reason}</div>
                      {item.description && <div style={{ color: "#6B7280", marginTop: 4 }}>{item.description}</div>}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>{item.quantity}</td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
                      {item.status ?? "N/A"}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontSize: 13 }}>
                      <select
                        value={item.status ?? "REQUESTED"}
                        onChange={(e) => handleStatusUpdate(item.id, item.status, e.target.value as ReturnStatus)}
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

export default SellerReturns;
