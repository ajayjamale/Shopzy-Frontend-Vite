import React from "react";

interface ProfileFieldCardProps {
  keys:   string;
  value?: string;
}

const ProfileFieldCard = ({ keys, value }: ProfileFieldCardProps) => (
  <div style={{
    display:      "grid",
    gridTemplateColumns: "180px 1fr",
    alignItems:   "center",
    padding:      "13px 18px",
    borderBottom: "1px solid #EAEDEE",
    background:   "#FFFFFF",
    gap:          12,
  }}>
    <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>{keys}</span>
    <span style={{ fontSize: 14, color: "#0F1111", fontWeight: 500 }}>
      {value ?? <span style={{ color: "#B0B7BF", fontStyle: "italic" }}>Not provided</span>}
    </span>
  </div>
);

export default ProfileFieldCard;