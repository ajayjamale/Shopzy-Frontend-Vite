import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import "./Profile.css";

const UserDetails = () => {
  const { user } = useAppSelector((store) => store);

  const getInitials = () => {
    if (!user.user?.fullName) return "U";
    return user.user.fullName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}>
        <h1 className="amz-page-title" style={{ margin: 0 }}>Personal Details</h1>
        <button className="amz-btn-primary" style={{ padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <EditIcon style={{ fontSize: "0.875rem" }} />
          Edit
        </button>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="amz-user-avatar-circle">
          {getInitials()}
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Name */}
        <div className="amz-card">
          <div className="amz-card-body">
            <div style={{ fontSize: "0.75rem", color: "#565959", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
              Full Name
            </div>
            <div style={{ fontSize: "0.9375rem", color: "#0f1111", fontWeight: 700 }}>
              {user.user?.fullName || "—"}
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="amz-card">
          <div className="amz-card-body">
            <div style={{ fontSize: "0.75rem", color: "#565959", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
              Email Address
            </div>
            <div style={{ fontSize: "0.9375rem", color: "#0f1111" }}>
              {user.user?.email || "—"}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="amz-card">
          <div className="amz-card-body">
            <div style={{ fontSize: "0.75rem", color: "#565959", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
              Mobile Number
            </div>
            <div style={{ fontSize: "0.9375rem", color: "#0f1111" }}>
              {user.user?.mobile || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;