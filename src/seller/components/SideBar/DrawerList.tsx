import { useLocation, useNavigate } from "react-router-dom";
import type { Seller } from "../../../types/sellerTypes";
import { isSellerNavItemActive, sellerMenuGroups } from "../../sellerNavigation";

type SellerDrawerListProps = {
  profile?: Seller | null;
};

const statusTone = (status?: string) => {
  const value = (status || "").toUpperCase();
  if (value === "ACTIVE") {
    return { bg: "#E8F8F4", color: "#0F766E", border: "#BFE8DE" };
  }
  if (value === "PENDING_VERIFICATION") {
    return { bg: "#FFF8E8", color: "#92400E", border: "#F2D08A" };
  }
  if (["SUSPENDED", "BANNED", "DEACTIVATED", "CLOSED"].includes(value)) {
    return { bg: "#FFF1F4", color: "#BE123C", border: "#F6CBD6" };
  }
  return { bg: "#F4F7FA", color: "#475569", border: "#D8E1E8" };
};

const SellerDrawerList = ({ profile }: SellerDrawerListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sellerName =
    profile?.sellerName ||
    profile?.businessDetails?.businessName ||
    "Seller Workspace";
  const tone = statusTone(profile?.accountStatus);

  return (
    <aside
      style={{
        width: 264,
        minHeight: "100%",
        background: "#ffffff",
        borderRight: "1px solid #DCE8EC",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #E6EFF2", display: "grid", gap: 10 }}>
        <div>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748B", fontWeight: 700 }}>
            Seller Console
          </p>
          <h2 style={{ fontSize: "1.2rem", marginTop: 4, color: "#0F172A" }}>Shopzy Seller</h2>
        </div>

        <div
          style={{
            border: "1px solid #E7EFF2",
            borderRadius: 12,
            background: "#FFFFFF",
            padding: "12px 13px",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{sellerName}</div>
          {profile?.email && (
            <div style={{ fontSize: 12, color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {profile.email}
            </div>
          )}
          {profile?.accountStatus && (
            <span
              style={{
                justifySelf: "start",
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 9px",
                borderRadius: 10,
                background: tone.bg,
                color: tone.color,
                border: `1px solid ${tone.border}`,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {profile.accountStatus.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>

      <nav style={{ padding: 12, display: "grid", gap: 12, alignContent: "start", overflowY: "auto" }}>
        {sellerMenuGroups.map((group) => (
          <div key={group.title} style={{ display: "grid", gap: 6 }}>
            <p
              style={{
                margin: "2px 6px 0",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#94A3B8",
                fontWeight: 800,
              }}
            >
              {group.title}
            </p>

            {group.items.map((item) => {
              const active = isSellerNavItemActive(location, item);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    border: "1px solid",
                    borderColor: active ? "#6DB4AD" : "#E7EFF2",
                    background: active ? "#EAF7F5" : "#FFFFFF",
                    color: active ? "#0F766E" : "#334155",
                    borderRadius: 10,
                    textAlign: "left",
                    padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: active ? "0 8px 22px rgba(15, 118, 110, 0.08)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active ? "#FFFFFF" : "#F2F7F9",
                      border: "1px solid #DCE8EC",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ fontSize: "0.86rem", fontWeight: 800, color: active ? "#0F766E" : "#0F172A" }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid #E6EFF2", padding: "12px 14px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("seller_jwt");
            navigate("/");
          }}
          style={{
            width: "100%",
            border: "1px solid #F4CDD5",
            background: "#FFF1F4",
            color: "#BE123C",
            borderRadius: 8,
            padding: "9px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SellerDrawerList;
