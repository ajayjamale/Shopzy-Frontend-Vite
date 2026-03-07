import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchSellerOrders, updateOrderStatus } from "../../../Redux Toolkit/Seller/sellerOrderSlice";
import type { Order, OrderItem } from "../../../types/orderTypes";

/* ── palette ─────────────────────────────────────────── */
const C = {
  navy:    "#232F3E",
  orange:  "#FF9900",
  white:   "#FFFFFF",
  bg:      "#F3F3F3",
  border:  "#D5D9D9",
  soft:    "#EAEDEE",
  text:    "#0F1111",
  mid:     "#565959",
  dim:     "#8D9095",
  link:    "#007185",
};

/* ── status config ───────────────────────────────────── */
const STATUS: Record<string, { color: string; bg: string }> = {
  PENDING:   { color: "#E07B00", bg: "#FFF3CD" },
  PLACED:    { color: "#007185", bg: "#E6F4F6" },
  CONFIRMED: { color: "#5A4FCF", bg: "#EDECFB" },
  SHIPPED:   { color: "#1E6EC8", bg: "#E8F1FB" },
  DELIVERED: { color: "#067D62", bg: "#E6F4F1" },
  CANCELLED: { color: "#CC0C39", bg: "#FFF0F0" },
};

const STATUS_LIST = ["PENDING","PLACED","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"];

const getStatus = (s: string) => STATUS[s] ?? { color: C.mid, bg: C.bg };

/* ── tiny chevron icon ───────────────────────────────── */
const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);

/* ── status badge ────────────────────────────────────── */
const StatusBadge = ({ status }: { status: string }) => {
  const s = getStatus(status);
  return (
    <span style={{
      display: "inline-block",
      fontSize: 11, fontWeight: 700,
      color: s.color, background: s.bg,
      border: `1px solid ${s.color}40`,
      borderRadius: 2, padding: "2px 9px",
      letterSpacing: "0.03em",
      whiteSpace: "nowrap" as const,
    }}>
      {status}
    </span>
  );
};

/* ── status dropdown ─────────────────────────────────── */
const StatusDropdown = ({
  orderId,
  current,
  onUpdate,
}: {
  orderId: number;
  current: string;
  onUpdate: (orderId: number, status: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [hover, setHover] = useState(false);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 10px", borderRadius: 3,
          border: "1px solid #C45500",
          background: hover
            ? "linear-gradient(to bottom,#f0a030,#df7921)"
            : "linear-gradient(to bottom,#FFB84D,#FF9900)",
          color: "#111", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 1px 0 rgba(255,255,255,.3) inset",
          whiteSpace: "nowrap" as const,
        }}
      >
        Update <ChevronDown />
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 4px)",
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
          zIndex: 100, minWidth: 130,
          overflow: "hidden",
        }}>
          {STATUS_LIST.map((s) => {
            const cfg = getStatus(s);
            return (
              <button
                key={s}
                onClick={() => { onUpdate(orderId, s); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", padding: "8px 12px",
                  background: s === current ? C.bg : C.white,
                  border: "none", borderBottom: `1px solid ${C.soft}`,
                  cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12.5, fontWeight: s === current ? 700 : 400,
                  color: C.text, textAlign: "left" as const,
                  transition: "background .1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = s === current ? C.bg : C.white)}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: cfg.color, flexShrink: 0,
                }} />
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── order row ───────────────────────────────────────── */
const OrderRow = ({
  order,
  onUpdate,
  zebra,
}: {
  order: Order;
  onUpdate: (id: number, status: string) => void;
  zebra: boolean;
}) => (
  <tr style={{ background: zebra ? "#FAFAFA" : C.white, verticalAlign: "top" }}>
    {/* order id */}
    <td style={{ padding: "14px 16px", fontSize: 13, color: C.link, fontWeight: 600,
      borderBottom: `1px solid ${C.soft}`, whiteSpace: "nowrap" as const }}>
      #{order.id}
    </td>

    {/* products */}
    <td style={{ padding: "14px 16px", borderBottom: `1px solid ${C.soft}` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {order.orderItems.map((item: OrderItem) => (
          <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <img
              src={item.product.images[0]}
              alt={item.product.title}
              style={{
                width: 60, height: 60, objectFit: "cover",
                borderRadius: 3, border: `1px solid ${C.border}`,
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.product.title}</span>
              <span style={{ fontSize: 12, color: C.mid }}>₹{item.product.sellingPrice}</span>
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                {item.product.color && (
                  <span style={{ fontSize: 11, color: C.dim, background: C.bg,
                    border: `1px solid ${C.border}`, borderRadius: 2, padding: "1px 6px" }}>
                    {item.product.color}
                  </span>
                )}
                {item.size && (
                  <span style={{ fontSize: 11, color: C.dim, background: C.bg,
                    border: `1px solid ${C.border}`, borderRadius: 2, padding: "1px 6px" }}>
                    {item.size}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </td>

    {/* shipping address */}
    <td style={{ padding: "14px 16px", fontSize: 13, color: C.text,
      borderBottom: `1px solid ${C.soft}`, minWidth: 180 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontWeight: 600 }}>{order.shippingAddress.name}</span>
        <span style={{ color: C.mid }}>{order.shippingAddress.address}</span>
        <span style={{ color: C.mid }}>
          {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pinCode}
        </span>
        <span style={{ color: C.mid, marginTop: 2 }}>
          <strong>Mob:</strong> {order.shippingAddress.mobile}
        </span>
      </div>
    </td>

    {/* status */}
    <td style={{ padding: "14px 16px", borderBottom: `1px solid ${C.soft}`,
      textAlign: "center" as const, verticalAlign: "middle" }}>
      <StatusBadge status={order.orderStatus} />
    </td>

    {/* update */}
    <td style={{ padding: "14px 16px", borderBottom: `1px solid ${C.soft}`,
      textAlign: "right" as const, verticalAlign: "middle" }}>
      <StatusDropdown
        orderId={order.id}
        current={order.orderStatus}
        onUpdate={onUpdate}
      />
    </td>
  </tr>
);

/* ── OrderTable ──────────────────────────────────────── */
export default function OrderTable() {
  const dispatch        = useAppDispatch();
  const { sellerOrder } = useAppSelector((s) => s);

  useEffect(() => {
    dispatch(fetchSellerOrders(localStorage.getItem("jwt") || ""));
  }, [dispatch]);

  const handleUpdate = (orderId: number, status: string) => {
    dispatch(updateOrderStatus({
      jwt: localStorage.getItem("jwt") || "",
      orderId,
      orderStatus: status,
    }));
  };

  const orders: Order[] = sellerOrder.orders ?? [];

  return (
    <div style={{ fontFamily: "inherit" }}>

      {/* page header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>All Orders</h1>
          <p style={{ fontSize: 13, color: C.mid, marginTop: 3 }}>
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* table */}
      <div style={{
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        overflow: "hidden",
        background: C.white,
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>

            {/* head */}
            <thead>
              <tr style={{ background: C.navy }}>
                {["Order ID", "Products", "Shipping Address", "Status", "Update"].map((h, i) => (
                  <th key={h} style={{
                    padding: "11px 16px",
                    fontSize: 12, fontWeight: 700,
                    color: C.white,
                    textAlign: i >= 3 ? (i === 4 ? "right" : "center") : "left" as any,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                    whiteSpace: "nowrap" as const,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* body */}
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: "48px 0", textAlign: "center" as const,
                    fontSize: 14, color: C.dim,
                  }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onUpdate={handleUpdate}
                    zebra={i % 2 !== 0}
                  />
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* footer */}
        {orders.length > 0 && (
          <div style={{
            padding: "10px 16px",
            borderTop: `1px solid ${C.soft}`,
            background: C.bg,
            fontSize: 12, color: C.mid,
            textAlign: "right" as const,
          }}>
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}