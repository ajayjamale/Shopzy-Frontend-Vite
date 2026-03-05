import React from "react";
import AddCardIcon from "@mui/icons-material/AddCard";
import LockIcon from "@mui/icons-material/Lock";
import "./Profile.css";

const SavedCards = () => (
  <div>
    <div className="amz-card" style={{ marginBottom: 16 }}>
      <div className="amz-card-header">Saved Payment Methods</div>
    </div>

    <div className="amz-card">
      <div className="amz-empty-state">
        <div className="amz-empty-icon">
          <AddCardIcon />
        </div>
        <div className="amz-empty-title">No saved cards</div>
        <div className="amz-empty-desc">
          Save your credit or debit card for faster checkout. Your payment info is protected with 128-bit SSL encryption.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#565959" }}>
          <LockIcon style={{ fontSize: "0.875rem" }} />
          Secured by shop.in
        </div>

        <button className="amz-btn-primary" style={{ marginTop: 12, padding: "8px 24px" }}>
          Add a credit or debit card
        </button>
      </div>
    </div>
  </div>
);

export default SavedCards;