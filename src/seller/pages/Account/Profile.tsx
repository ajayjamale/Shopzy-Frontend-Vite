import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store";
import ProfileFieldCard     from "./ProfileFildCard";
import PersonalDetailsForm  from "./PersionalDetailsForm";
import BusinessDetailsForm  from "./BussinessDetailsForm";
import PickupAddressForm    from "./PickupAddressForm";
import BankDetailsForm      from "./BankDetailsForm";

/* ── palette ─────────────────────────────────────────── */
const C = {
  navy:       "#1E293B",
  navyD:      "#0F172A",
  orange:     "#0F766E",
  orangeD:    "#0B5F59",
  white:      "#FFFFFF",
  bg:         "#F3F3F3",
  border:     "#DCE5E8",
  borderSoft: "#EAEDEE",
  text:       "#0F172A",
  mid:        "#64748B",
  dim:        "#8D9095",
  link:       "#0E7490",
  green:      "#067D62",
  greenBg:    "#E6F4F1",
  red:        "#CC0C39",
  redBg:      "#FFF0F0",
};

/* ── inline icons ────────────────────────────────────── */
const Ic = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const PENCIL = "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";
const CHECK  = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z";
const CLOSE  = "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z";

/* ── tab definitions ─────────────────────────────────── */
type TabId = "personal" | "business" | "address" | "bank";

const TABS: { id: TabId; label: string }[] = [
  { id: "personal",  label: "Personal Details"  },
  { id: "business",  label: "Business Details"  },
  { id: "address",   label: "Pickup Address"    },
  { id: "bank",      label: "Bank Details"      },
];

/* ── edit button ─────────────────────────────────────── */
const EditBtn = ({ onClick }: { onClick: () => void }) => {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "5px 14px", borderRadius: 3,
        border: "1px solid #C45500",
        background: h
          ? "linear-gradient(135deg,#0B5F59,#0F766E)"
          : "linear-gradient(to bottom,#FFB84D,#0F766E)",
        color: "#111", fontSize: 12.5, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 1px 0 rgba(255,255,255,.3) inset",
        transition: "background .14s",
      }}>
      <Ic d={PENCIL} size={13} /> Edit
    </button>
  );
};

/* ── drawer (slide-in panel) ─────────────────────────── */
const Drawer = ({
  open, title, onClose, children,
}: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode;
}) => (
  <>
    {/* backdrop */}
    {open && (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(15,17,17,0.45)", zIndex: 900,
      }} />
    )}
    {/* panel */}
    <div style={{
      position:   "fixed",
      top:        0, right: 0, bottom: 0,
      width:      400,
      background: C.white,
      boxShadow:  "-4px 0 24px rgba(0,0,0,0.15)",
      zIndex:     1000,
      display:    "flex",
      flexDirection: "column",
      transform:  open ? "translateX(0)" : "translateX(100%)",
      transition: "transform .26s cubic-bezier(.4,0,.2,1)",
    }}>
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: `1px solid ${C.border}`,
        background: "linear-gradient(to bottom,#f7f8fa,#e7e9ec)",
        flexShrink: 0,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: C.mid, display: "flex", padding: 4, borderRadius: 3,
        }}>
          <Ic d={CLOSE} size={18} />
        </button>
      </div>
      {/* body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
        {children}
      </div>
    </div>
  </>
);

/* ── toast ───────────────────────────────────────────── */
const Toast = ({
  open, error, message, onClose,
}: {
  open: boolean; error: boolean; message: string; onClose: () => void;
}) => {
  useEffect(() => {
    if (open) { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }
  }, [open]);

  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 16, right: 16, zIndex: 2000,
      display: "flex", alignItems: "center", gap: 10,
      background: error ? C.redBg : C.greenBg,
      border: `1px solid ${error ? C.red : C.green}`,
      borderLeft: `4px solid ${error ? C.red : C.green}`,
      borderRadius: 4, padding: "11px 14px 11px 12px",
      fontSize: 13, color: C.text, fontWeight: 500,
      boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
      maxWidth: 320,
    }}>
      <Ic d={error ? CLOSE : CHECK} size={16} />
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.mid, padding: 0 }}>
        <Ic d={CLOSE} size={14} />
      </button>
    </div>
  );
};

/* ── status badge ────────────────────────────────────── */
const StatusBadge = ({ status }: { status?: string }) => {
  const active = status?.toUpperCase() === "ACTIVE";
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      color:      active ? C.green : C.mid,
      background: active ? C.greenBg : C.bg,
      border:     `1px solid ${active ? C.green : C.border}`,
      borderRadius: 2, padding: "2px 8px",
    }}>
      {status || "—"}
    </span>
  );
};

/* ── tab content ─────────────────────────────────────── */
type DrawerId = TabId | null;

const TabContent = ({
  tab,
  profile,
  onEdit,
}: {
  tab:     TabId;
  profile: any;
  onEdit:  () => void;
}) => {
  const sections: Record<TabId, { label: string; rows: { key: string; val?: string }[] }> = {
    personal: {
      label: "Personal Details",
      rows: [
        { key: "Seller Name",  val: profile?.sellerName },
        { key: "Email",        val: profile?.email      },
        { key: "Mobile",       val: profile?.mobile     },
      ],
    },
    business: {
      label: "Business Details",
      rows: [
        { key: "Business Name",  val: profile?.businessDetails?.businessName },
        { key: "GSTIN",          val: profile?.gstin                         },
        { key: "Account Status", val: profile?.accountStatus                 },
      ],
    },
    address: {
      label: "Pickup Address",
      rows: [
        { key: "Address", val: profile?.pickupAddress?.address },
        { key: "City",    val: profile?.pickupAddress?.city    },
        { key: "State",   val: profile?.pickupAddress?.state   },
        { key: "Mobile",  val: profile?.pickupAddress?.mobile  },
      ],
    },
    bank: {
      label: "Bank Details",
      rows: [
        { key: "Account Holder", val: profile?.bankDetails?.accountHolderName },
        { key: "Account Number", val: profile?.bankDetails?.accountNumber      },
        { key: "IFSC Code",      val: profile?.bankDetails?.ifscCode           },
      ],
    },
  };

  const s = sections[tab];

  return (
    <div>
      {/* section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        background: "linear-gradient(to bottom,#f7f8fa,#e7e9ec)",
        border: `1px solid ${C.border}`,
        borderBottom: "none",
        borderRadius: "4px 4px 0 0",
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{s.label}</h2>
        <EditBtn onClick={onEdit} />
      </div>

      {/* rows */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "0 0 4px 4px", overflow: "hidden" }}>
        {s.rows.map((r) => (
          <ProfileFieldCard key={r.key} keys={r.key} value={r.val} />
        ))}
      </div>
    </div>
  );
};

/* ── Profile ─────────────────────────────────────────── */
const Profile = () => {
  const { sellers }                 = useAppSelector((s) => s);
  const [activeTab, setActiveTab]   = useState<TabId>("personal");
  const [drawerOpen, setDrawerOpen] = useState<DrawerId>(null);
  const [toastOpen,  setToastOpen]  = useState(false);

  useEffect(() => {
    if (sellers.profileUpdated || sellers.error) setToastOpen(true);
  }, [sellers.profileUpdated, sellers.error]);

  const drawerTitle: Record<TabId, string> = {
    personal: "Edit Personal Details",
    business: "Edit Business Details",
    address:  "Edit Pickup Address",
    bank:     "Edit Bank Details",
  };

  const renderDrawerForm = () => {
    if (!drawerOpen) return null;
    const close = () => setDrawerOpen(null);
    switch (drawerOpen) {
      case "personal":  return <PersonalDetailsForm  onClose={close} />;
      case "business":  return <BusinessDetailsForm  onClose={close} />;
      case "address":   return <PickupAddressForm     onClose={close} />;
      case "bank":      return <BankDetailsForm       onClose={close} />;
    }
  };

  return (
    <div style={{ fontFamily: "inherit", maxWidth: 820, padding: "20px 24px" }}>

      {/* ── page header ──────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: C.link, marginBottom: 8 }}>
          Seller Central &rsaquo; <span style={{ color: C.mid }}>Account</span> &rsaquo;{" "}
          <span style={{ color: C.mid }}>Profile</span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
              {sellers.profile?.sellerName || "Seller Account"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
              <span style={{ fontSize: 13, color: C.mid }}>{sellers.profile?.email}</span>
              <StatusBadge status={sellers.profile?.accountStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* ── tab bar ──────────────────────────────────── */}
      <div style={{
        display: "flex", borderBottom: `2px solid ${C.border}`,
        marginBottom: 20, gap: 0,
      }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding:     "10px 18px",
              border:      "none",
              borderBottom: active ? `2px solid ${C.orange}` : "2px solid transparent",
              marginBottom: -2,
              background:  "transparent",
              fontSize:    13.5,
              fontWeight:  active ? 700 : 500,
              color:       active ? C.orange : C.mid,
              cursor:      "pointer",
              fontFamily:  "inherit",
              transition:  "color .14s, border-color .14s",
              whiteSpace:  "nowrap" as const,
            }}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── tab content ──────────────────────────────── */}
      <TabContent
        tab={activeTab}
        profile={sellers.profile}
        onEdit={() => setDrawerOpen(activeTab)}
      />

      {/* ── slide-in edit drawer ──────────────────────── */}
      <Drawer
        open={drawerOpen !== null}
        title={drawerOpen ? drawerTitle[drawerOpen] : ""}
        onClose={() => setDrawerOpen(null)}
      >
        {renderDrawerForm()}
      </Drawer>

      {/* ── toast ────────────────────────────────────── */}
      <Toast
        open={toastOpen}
        error={Boolean(sellers.error)}
        message={sellers.error ? sellers.error : "Profile updated successfully"}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default Profile;