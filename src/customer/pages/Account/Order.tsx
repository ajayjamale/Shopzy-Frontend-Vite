import React, { useEffect } from "react";
import OrderItemCard from "./OrderItemCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchUserOrderHistory } from "../../../Redux Toolkit/Customer/OrderSlice";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import "./Profile.css";

const Order = () => {
  const dispatch = useAppDispatch();

  // ✅ Granular selectors
  const jwt       = useAppSelector((s) => s.auth.jwt);
  const orders    = useAppSelector((s) => s.orders.orders);
  const loading   = useAppSelector((s) => s.orders.loading);

  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem("jwt") || ""));
  }, [jwt]);

  if (loading) {
    return (
      <div className="amz-card">
        <div className="amz-card-header">Order History</div>
        <div className="amz-card-body">
          {[1,2,3].map((i) => (
            <div key={i} style={{ height: 100, background: "#f0f2f2", borderRadius: 3, marginBottom: 12, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </div>
    );
  }

  const orderList = orders || [];

  return (
    <div>
      <div className="amz-card" style={{ marginBottom: 16 }}>
        <div className="amz-card-header">
          <span>Order History</span>
          <span style={{ fontSize: "0.8125rem", fontWeight: "normal", color: "#565959" }}>
            {orderList.length} order{orderList.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {orderList.length === 0 ? (
        <div className="amz-card">
          <div className="amz-empty-state">
            <ShoppingBagIcon style={{ fontSize: "3rem", color: "#d5d9d9" }} />
            <div className="amz-empty-title">You have not placed any orders yet</div>
            <div className="amz-empty-desc">When you place an order, it will appear here.</div>
            <a href="/" className="amz-btn-primary" style={{ marginTop: 8 }}>Start Shopping</a>
          </div>
        </div>
      ) : (
        orderList.map((order) => (
          <div key={order.id} className="amz-order-card">
            {/* Order header */}
            <div className="amz-order-card-header">
              <div className="amz-order-meta">
                <span className="amz-order-meta-label">Order placed</span>
                <span className="amz-order-meta-value">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </span>
              </div>
              <div className="amz-order-meta">
                <span className="amz-order-meta-label">Total</span>
                <span className="amz-order-meta-value">₹{order.totalSellingPrice?.toLocaleString("en-IN") || "—"}</span>
              </div>
              <div className="amz-order-meta">
                <span className="amz-order-meta-label">Items</span>
                <span className="amz-order-meta-value">{order.orderItems?.length}</span>
              </div>
              <div className="amz-order-meta" style={{ marginLeft: "auto" }}>
                <span className="amz-order-meta-label">Order # {order.id}</span>
                <span
                  className={`amz-badge ${
                    order.orderStatus === "DELIVERED" ? "amz-badge-green"
                    : order.orderStatus === "CANCELLED" ? "amz-badge-red"
                    : "amz-badge-orange"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="amz-card-body" style={{ padding: 0 }}>
              {order.orderItems?.map((item) => (
                <OrderItemCard key={item.id} item={item} order={order} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;