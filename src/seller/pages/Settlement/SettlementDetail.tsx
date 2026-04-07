import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  fetchSettlementById,
  updateSettlementStatus,
} from "../../../Redux Toolkit/Seller/settlementSlice";
import type { SettlementStatus } from "../../../types/settlementTypes";
import { getSellerToken } from "../../../util/authToken";

const C = {
  text: "#0F1111",
  mid: "#4B5563",
  dim: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",
  bg: "#F5F6F8",
  green: "#0F9D58",
  red: "#CC0C39",
  orange: "#F59E0B",
  blue: "#2563EB",
};

const statusColors: Record<string, { color: string; bg: string }> = {
  PENDING: { color: "#F59E0B", bg: "#FEF3C7" },
  PROCESSING: { color: "#2563EB", bg: "#E0E7FF" },
  COMPLETED: { color: "#0F9D58", bg: "#E6F4F1" },
  FAILED: { color: "#CC0C39", bg: "#FEE2E2" },
  CANCELLED: { color: "#6B7280", bg: "#F3F4F6" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = statusColors[status] || { color: C.dim, bg: C.bg };
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
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
      {status.toLowerCase()}
    </span>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
    <span style={{ color: C.mid }}>{label}</span>
    <span style={{ fontWeight: 700, color: C.text }}>{value ?? "—"}</span>
  </div>
);

const formatCurrency = (v?: number) =>
  `₹${(v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const SettlementDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { settlement } = useAppSelector((s) => s);
  const jwt = getSellerToken();

  useEffect(() => {
    if (id && jwt) {
      dispatch(fetchSettlementById({ jwt, id: Number(id) }));
    }
  }, [dispatch, id, jwt]);

  const data = settlement.current;

  const handleStatus = (status: SettlementStatus) => {
    if (!data) return;
    dispatch(updateSettlementStatus({ jwt, id: data.id, status }));
  };

  return (
    <div style={{ padding: 16, background: C.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>
            Settlement #{id}
          </h1>
          <p style={{ margin: "4px 0 0", color: C.mid }}>Detailed payout breakdown</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              padding: "8px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Back
          </button>
        </div>
      </div>

      {!data ? (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
            color: C.mid,
          }}
        >
          {settlement.loading ? "Loading settlement..." : settlement.error || "Settlement not found"}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {/* Overview */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: C.dim, letterSpacing: "0.08em" }}>STATUS</div>
                <StatusBadge status={data.settlementStatus} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: C.dim }}>Net Amount</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>
                  {formatCurrency(data.netSettlementAmount)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <InfoRow label="Order" value={`#${data.orderId}`} />
              <InfoRow label="Transaction" value={data.transactionId ?? "—"} />
              <InfoRow label="Payment Method" value={data.paymentMethod} />
              <InfoRow label="Settlement Date" value={data.settlementDate?.split("T")[0] ?? "—"} />
            </div>
          </div>

          {/* Charges */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, color: C.dim, letterSpacing: "0.08em", marginBottom: 8 }}>
              AMOUNT BREAKDOWN
            </div>
            <InfoRow label="Gross Amount" value={formatCurrency(data.grossAmount)} />
            <InfoRow label="Commission" value={formatCurrency(data.commissionAmount)} />
            <InfoRow label="Platform Fee" value={formatCurrency(data.platformFee)} />
            <InfoRow label="Tax" value={formatCurrency(data.taxAmount)} />
            <div style={{ height: 1, background: C.border, margin: "10px 0" }} />
            <InfoRow label="Net Payable" value={formatCurrency(data.netSettlementAmount)} />
          </div>

          {/* Notes / actions */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 12, color: C.dim, letterSpacing: "0.08em", marginBottom: 8 }}>NOTES</div>
            <div style={{ fontSize: 14, color: C.mid, minHeight: 48 }}>
              {data.remarks ?? "No remarks added."}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s as SettlementStatus)}
                  disabled={settlement.loading}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: data.settlementStatus === s ? "#E0E7FF" : C.card,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {s.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettlementDetail;
