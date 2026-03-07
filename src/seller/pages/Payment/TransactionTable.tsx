import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchTransactionsBySeller } from "../../../Redux Toolkit/Seller/transactionSlice";
import type { Transaction } from "../../../types/Transaction";
import { redableDateTime } from "../../../util/redableDateTime";

const C = {
  navy:   "#232F3E",
  white:  "#FFFFFF",
  bg:     "#F3F3F3",
  border: "#D5D9D9",
  soft:   "#EAEDEE",
  text:   "#0F1111",
  mid:    "#565959",
  dim:    "#8D9095",
  link:   "#007185",
  green:  "#067D62",
};

const TH_STYLE: React.CSSProperties = {
  padding: "11px 16px",
  fontSize: 12, fontWeight: 700,
  color: C.white,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  borderRight: "1px solid rgba(255,255,255,0.08)",
};

export default function TransactionTable() {
  const dispatch                    = useAppDispatch();
  const { transaction }             = useAppSelector((s) => s);

  useEffect(() => {
    dispatch(fetchTransactionsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const rows: Transaction[] = transaction.transactions ?? [];

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: 4,
      overflow: "hidden",
      background: C.white,
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ background: C.navy }}>
              <th style={{ ...TH_STYLE, textAlign: "left"  }}>Date</th>
              <th style={{ ...TH_STYLE, textAlign: "left"  }}>Customer</th>
              <th style={{ ...TH_STYLE, textAlign: "left"  }}>Order</th>
              <th style={{ ...TH_STYLE, textAlign: "right", borderRight: "none" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} style={{
                  padding: "40px 0", textAlign: "center",
                  fontSize: 14, color: C.dim,
                }}>
                  No transactions found.
                </td>
              </tr>
            ) : rows.map((item, i) => {
              const parts = redableDateTime(item.date).split("at");
              return (
                <tr key={item.id} style={{ background: i % 2 === 0 ? C.white : "#FAFAFA", verticalAlign: "top" }}>

                  {/* date */}
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.soft}`, whiteSpace: "nowrap" as const }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{parts[0]?.trim()}</div>
                    {parts[1] && (
                      <div style={{ fontSize: 11, color: C.mid, marginTop: 2 }}>{parts[1].trim()}</div>
                    )}
                  </td>

                  {/* customer */}
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.soft}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.customer.fullName}</div>
                    <div style={{ fontSize: 12, color: C.link, marginTop: 2 }}>{item.customer.email}</div>
                    <div style={{ fontSize: 12, color: C.mid, marginTop: 1 }}>{item.customer.mobile}</div>
                  </td>

                  {/* order */}
                  <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.soft}`, fontSize: 13, color: C.text }}>
                    Order <span style={{ fontWeight: 700, color: C.link }}>#{item.order.id}</span>
                  </td>

                  {/* amount */}
                  <td style={{
                    padding: "13px 16px", borderBottom: `1px solid ${C.soft}`,
                    textAlign: "right", fontSize: 14, fontWeight: 700, color: C.green,
                    whiteSpace: "nowrap" as const,
                  }}>
                    ₹{item.order.totalSellingPrice.toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div style={{
          padding: "9px 16px", borderTop: `1px solid ${C.soft}`,
          background: C.bg, fontSize: 12, color: C.mid, textAlign: "right" as const,
        }}>
          {rows.length} transaction{rows.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}