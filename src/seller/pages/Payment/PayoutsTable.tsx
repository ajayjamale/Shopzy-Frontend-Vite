import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchPayoutsBySeller } from "../../../Redux Toolkit/Seller/payoutSlice";
import type { Order, OrderItem } from "../../../types/orderTypes";

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

const PayoutsTable = () => {
  const dispatch        = useAppDispatch();
  const { sellerOrder } = useAppSelector((s) => s);

  useEffect(() => {
    dispatch(fetchPayoutsBySeller(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const rows: Order[] = sellerOrder.orders ?? [];

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
              <th style={{ ...TH_STYLE, textAlign: "left"  }}>Amount</th>
              <th style={{ ...TH_STYLE, textAlign: "right", borderRight: "none" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} style={{
                  padding: "40px 0", textAlign: "center",
                  fontSize: 14, color: C.dim,
                }}>
                  No payouts found.
                </td>
              </tr>
            ) : rows.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? C.white : "#FAFAFA", verticalAlign: "top" }}>

                {/* date / id */}
                <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.soft}`,
                  fontSize: 13, color: C.link, fontWeight: 600 }}>
                  #{item.id}
                </td>

                {/* products */}
                <td style={{ padding: "13px 16px", borderBottom: `1px solid ${C.soft}` }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {item.orderItems.map((orderItem: OrderItem) => (
                      <div key={orderItem.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <img
                          src={orderItem.product.images[0]}
                          alt={orderItem.product.title}
                          style={{
                            width: 52, height: 52, objectFit: "cover",
                            borderRadius: 3, border: `1px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{orderItem.product.title}</span>
                          <span style={{ fontSize: 12, color: C.mid }}>₹{orderItem.product.sellingPrice}</span>
                          <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                            {orderItem.product.color && (
                              <span style={{ fontSize: 11, color: C.dim, background: C.bg,
                                border: `1px solid ${C.border}`, borderRadius: 2, padding: "1px 5px" }}>
                                {orderItem.product.color}
                              </span>
                            )}
                            {orderItem.size && (
                              <span style={{ fontSize: 11, color: C.dim, background: C.bg,
                                border: `1px solid ${C.border}`, borderRadius: 2, padding: "1px 5px" }}>
                                {orderItem.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                {/* status placeholder */}
                <td style={{
                  padding: "13px 16px", borderBottom: `1px solid ${C.soft}`,
                  textAlign: "right", fontSize: 13, color: C.mid,
                }}>
                  —
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div style={{
          padding: "9px 16px", borderTop: `1px solid ${C.soft}`,
          background: C.bg, fontSize: 12, color: C.mid, textAlign: "right" as const,
        }}>
          {rows.length} payout{rows.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default PayoutsTable;