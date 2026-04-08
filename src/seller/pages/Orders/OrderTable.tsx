import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSellerOrders, updateOrderStatus } from "../../../store/seller/sellerOrderSlice";
import { Order, OrderItem, OrderStatus } from "../../../types/orderTypes";
import { getSellerToken } from "../../../utils/authToken";

/* ── palette ─────────────────────────────────────────── */
const C = {
  navy:    "#1E293B",
  orange:  "#0F766E",
  white:   "#FFFFFF",
  bg:      "#F3F3F3",
  border:  "#DCE5E8",
  soft:    "#EAEDEE",
  text:    "#0F172A",
  mid:     "#64748B",
  dim:     "#8D9095",
  link:    "#0E7490",
};

/* ── status config ───────────────────────────────────── */
const STATUS: Record<string, { color: string; bg: string }> = {
  PENDING:   { color: "#E07B00", bg: "#FFF3CD" },
  PLACED:    { color: "#0E7490", bg: "#E6F4F6" },
  CONFIRMED: { color: "#5A4FCF", bg: "#EDECFB" },
  SHIPPED:   { color: "#1E6EC8", bg: "#E8F1FB" },
  DELIVERED: { color: "#067D62", bg: "#E6F4F1" },
  CANCELLED: { color: "#CC0C39", bg: "#FFF0F0" },
  RETURN_REQUESTED: { color: "#7C3AED", bg: "#F3E8FF" },
  REFUND_INITIATED: { color: "#2563EB", bg: "#DBEAFE" },
  RETURNED: { color: "#0F766E", bg: "#CCFBF1" },
};

const STATUS_LIST = ["PENDING","PLACED","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"];
const RETURN_FLOW_STATUSES = new Set(["RETURN_REQUESTED", "REFUND_INITIATED", "RETURNED"]);

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
  const [hover, setHover] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState({
    top: 0,
    left: 0,
    width: 170,
    maxHeight: 280,
  });

  const updateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = Math.max(rect.width, 170);
    const estimatedHeight = Math.min(STATUS_LIST.length * 37 + 10, 280);
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const placeAbove = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    const availableSpace = placeAbove ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(120, Math.min(280, availableSpace - 6));
    const top = placeAbove
      ? Math.max(8, rect.top - Math.min(estimatedHeight, maxHeight) - 6)
      : rect.bottom + 6;
    const left = Math.min(
      Math.max(8, rect.right - width),
      window.innerWidth - width - 8,
    );

    setMenuStyle({ top, left, width, maxHeight });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "5px 10px", borderRadius: 3,
          border: "1px solid #C45500",
          background: hover
            ? "linear-gradient(135deg,#0B5F59,#0F766E)"
            : "linear-gradient(to bottom,#FFB84D,#0F766E)",
          color: "#111", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 1px 0 rgba(255,255,255,.3) inset",
          whiteSpace: "nowrap" as const,
        }}
      >
        Update <ChevronDown />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              maxHeight: menuStyle.maxHeight,
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.22)",
              zIndex: 4000,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {STATUS_LIST.map((s, index) => {
              const cfg = getStatus(s);
              return (
                <button
                  key={s}
                  onClick={() => {
                    onUpdate(orderId, s);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "8px 12px",
                    background: s === current ? C.bg : C.white,
                    border: "none",
                    borderBottom: index < STATUS_LIST.length - 1 ? `1px solid ${C.soft}` : "none",
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
          </div>,
          document.body,
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
}) => {
  const isReturnManaged = RETURN_FLOW_STATUSES.has(order.orderStatus);
  return (
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
      {isReturnManaged ? (
        <span style={{ fontSize: 12, color: C.mid, fontWeight: 600 }}>
          Manage in Returns
        </span>
      ) : (
        <StatusDropdown
          orderId={order.id}
          current={order.orderStatus}
          onUpdate={onUpdate}
        />
      )}
    </td>
  </tr>
  );
};

/* ── OrderTable ──────────────────────────────────────── */
export default function OrderTable() {
  const dispatch        = useAppDispatch();
  const { sellerOrder } = useAppSelector((s) => s);
  const jwt = useMemo(() => getSellerToken(), []);

  const refreshOrders = useCallback(() => {
    if (!jwt) return;
    dispatch(fetchSellerOrders(jwt));
  }, [dispatch, jwt]);

  useEffect(() => {
    if (!jwt) return;
    refreshOrders();
    const onFocus = () => refreshOrders();
    window.addEventListener("focus", onFocus);
    const intervalId = window.setInterval(refreshOrders, 30000);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [jwt, refreshOrders]);

  const handleUpdate = (orderId: number, status: string) => {
    if (!jwt) return;
    dispatch(updateOrderStatus({
      jwt,
      orderId,
      orderStatus: status as OrderStatus,
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
