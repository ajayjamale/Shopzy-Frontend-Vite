import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchPayoutsBySeller } from "../../../store/seller/payoutSlice";
import type { Payouts } from "../../../types/payoutsType";
import { getSellerToken } from "../../../utils/authToken";

const C = {
  navy: "#1E293B",
  white: "#FFFFFF",
  bg: "#F3F3F3",
  border: "#DCE5E8",
  soft: "#EAEDEE",
  text: "#0F172A",
  mid: "#64748B",
  dim: "#8D9095",
  link: "#0E7490",
  green: "#067D62",
};

const TH_STYLE: React.CSSProperties = {
  padding: "11px 16px",
  fontSize: 12,
  fontWeight: 700,
  color: C.white,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  borderRight: "1px solid rgba(255,255,255,0.08)",
};

const PayoutsTable = () => {
  const dispatch = useAppDispatch();
  const { payouts } = useAppSelector((s) => s);

  useEffect(() => {
    dispatch(fetchPayoutsBySeller(getSellerToken()));
  }, [dispatch]);

  const rows: Payouts[] = payouts.payouts ?? [];

  return (
    <div
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: "hidden",
        background: C.white,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ background: C.navy }}>
              <th style={{ ...TH_STYLE, textAlign: "left" }}>Date</th>
              <th style={{ ...TH_STYLE, textAlign: "left" }}>Amount</th>
              <th style={{ ...TH_STYLE, textAlign: "right", borderRight: "none" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    padding: "40px 0",
                    textAlign: "center",
                    fontSize: 14,
                    color: C.dim,
                  }}
                >
                  No payouts found.
                </td>
              </tr>
            ) : (
              rows.map((item, i) => (
                <tr
                  key={item.id}
                  style={{ background: i % 2 === 0 ? C.white : "#FAFAFA", verticalAlign: "top" }}
                >
                  <td
                    style={{
                      padding: "13px 16px",
                      borderBottom: `1px solid ${C.soft}`,
                      fontSize: 13,
                      color: C.link,
                      fontWeight: 600,
                    }}
                  >
                    {new Date(item.date).toLocaleDateString("en-IN")}
                    <div style={{ fontSize: 12, color: C.dim }}>#{item.id}</div>
                  </td>

                  <td
                    style={{
                      padding: "13px 16px",
                      borderBottom: `1px solid ${C.soft}`,
                      fontSize: 14,
                      color: C.text,
                    }}
                  >
                    ₹{item.amount.toLocaleString("en-IN")}
                    <div style={{ fontSize: 12, color: C.mid }}>
                      Transactions: {item.transactions.length}
                    </div>
                  </td>

                  <td
                    style={{
                      padding: "13px 16px",
                      borderBottom: `1px solid ${C.soft}`,
                      textAlign: "right",
                      fontSize: 13,
                      color: C.mid,
                    }}
                  >
                    {item.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div
          style={{
            padding: "9px 16px",
            borderTop: `1px solid ${C.soft}`,
            background: C.bg,
            fontSize: 12,
            color: C.mid,
            textAlign: "right" as const,
          }}
        >
          {rows.length} payout{rows.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default PayoutsTable;
