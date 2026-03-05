import React from "react";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import UserAddressCard from "./UserAddressCard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.css";

const Addresses = () => {
  // ✅ Granular selector
  const addresses = useAppSelector((s) => s.user.user?.addresses ?? []);

  return (
    <div>
      <div className="amz-card" style={{ marginBottom: 16 }}>
        <div className="amz-card-header">
          <span>Manage Addresses</span>
          <button className="amz-btn-primary" style={{ fontSize: "0.8125rem", padding: "4px 12px" }}>
            <AddIcon style={{ fontSize: "0.875rem" }} />
            Add New Address
          </button>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="amz-card">
          <div className="amz-empty-state">
            <LocationOnIcon style={{ fontSize: "3rem", color: "#d5d9d9" }} />
            <div className="amz-empty-title">No addresses saved</div>
            <div className="amz-empty-desc">
              Add a delivery address to make checkout faster.
            </div>
            <button className="amz-btn-primary" style={{ marginTop: 8 }}>
              Add Address
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {addresses.map((item) => (
            <UserAddressCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;