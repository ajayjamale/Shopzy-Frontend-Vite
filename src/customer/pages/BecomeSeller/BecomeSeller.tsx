import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import SellerAccountForm from "./SellerAccountForm";
import SellerLoginForm from "./SellerLoginForm";

const C = {
  orange:"#0F766E", navy:"#0F172A", navyMid:"#1E293B",
  blue:"#0F6094",   red:"#C40000",  green:"#007600",
  greenBg:"#EAF7EA", white:"#FFFFFF", bg:"#F3F3F3",
  border:"#CCCCCC", text:"#0F172A", textMid:"#64748B",
  textLight:"#8D8D8D", divider:"#E7E7E7",
};

/* ─── Toast (replaces MUI Snackbar — no dependency needed) ── */
function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"; onClose:()=>void }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 4500);
    const t2 = setTimeout(onClose, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const fg  = type === "error" ? C.red   : C.green;
  const bg  = type === "error" ? "#FFF3F3" : C.greenBg;
  const bdr = type === "error" ? "#FFBDBC" : "#B3DFBA";
  return (
    <div style={{
      background:bg, border:`1px solid ${bdr}`, borderRadius:5,
      padding:"12px 16px", display:"flex", gap:10, alignItems:"center",
      animation:`${out?"toastOut":"toastIn"} .35s ease both`,
      boxShadow:"0 4px 18px rgba(0,0,0,0.11)", maxWidth:340, minWidth:240,
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <span style={{ fontSize:13, color:fg, fontWeight:500, flex:1, lineHeight:1.45 }}>{msg}</span>
      <button onClick={onClose}
        style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:fg, opacity:.7, padding:0, lineHeight:1 }}>
        ×
      </button>
    </div>
  );
}

/* ─── Right promo panel ─────────────────────────────── */
function RightPanel() {
  return (
    <div style={{ padding:"40px 30px", height:"100%", display:"flex", flexDirection:"column", gap:28 }}>
      <div>
        <div style={{ display:"flex", alignItems:"baseline", gap:3, marginBottom:6 }}>
          <span className="logo" style={{ fontSize: 26, color: "#ffffff", fontWeight: 800 }}>Shopzy</span>
          <span style={{ fontSize:12, fontWeight:700, color:C.orange, letterSpacing:".06em", textTransform:"uppercase" }}>seller</span>
        </div>
        <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.5)", lineHeight:1.55 }}>
          Over 10 lakh sellers. 19 crore+ customers.<br/>Your growth starts here.
        </p>
      </div>

      {[
        ["Reach crores of customers",  "Instantly list on India's most trusted marketplace."],
        ["Fast, secure payments",       "Payments credited every 7 days to your bank."],
        ["Hassle-free fulfilment",       "Shopzy FBF handles packing, shipping & returns."],
        ["Seller protection & support", "A-to-Z Guarantee and 24/7 seller success team."],
      ].map(([t,d],i) => (
        <div key={t} style={{ display:"flex", gap:13, alignItems:"flex-start" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.orange, marginTop:5, flexShrink:0 }}/>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:2 }}>{t}</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.5 }}>{d}</p>
          </div>
        </div>
      ))}

      <div style={{ marginTop:"auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[["10L+","Sellers"],["19Cr+","Customers"],["160+","Countries"]].map(([n,l]) => (
          <div key={l} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:9, padding:"13px 6px", textAlign:"center" }}>
            <p style={{ fontSize:18, fontWeight:800, color:C.orange }}>{n}</p>
            <p style={{ fontSize:10.5, color:"rgba(255,255,255,0.38)", marginTop:2 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── BecomeSeller ──────────────────────────────────── */
const BecomeSeller = () => {
  const { sellerAuth } = useAppSelector(store => store);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [toasts, setToasts] = useState<{ id:number; msg:string; type:"success"|"error" }[]>([]);

  const addToast = (msg: string, type: "success"|"error") =>
    setToasts(t => [...t, { id: Date.now(), msg, type }]);
  const rmToast  = (id: number) =>
    setToasts(t => t.filter(x => x.id !== id));

  /* Mirror your original useEffect — show toast on Redux state changes */
  useEffect(() => {
    if (sellerAuth.error)        addToast(sellerAuth.error,        "error");
  }, [sellerAuth.error]);

  useEffect(() => {
    if (sellerAuth.sellerCreated) addToast(sellerAuth.sellerCreated, "success");
  }, [sellerAuth.sellerCreated]);

  useEffect(() => {
    if (sellerAuth.otpSent)       addToast("OTP sent to your email!", "success");
  }, [sellerAuth.otpSent]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; background:${C.bg}; }
        input, button { font-family:'DM Sans',sans-serif; }
        @keyframes toastIn  { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes toastOut { from{transform:translateX(0);opacity:1} to{transform:translateX(110%);opacity:0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Toast stack — replaces MUI Snackbar */}
      <div style={{ position:"fixed", top:18, right:18, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
        {toasts.map(t => <Toast key={t.id} {...t} onClose={() => rmToast(t.id)}/>)}
      </div>

      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>

        {/* Seller header */}
        <header style={{ background:C.navy, padding:"8px 24px", display:"flex", alignItems:"center", gap:16, borderBottom:`2px solid ${C.orange}` }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
            <span className="logo" style={{ fontSize: 22, color: "#ffffff", fontWeight: 800 }}>Shopzy</span>
            <span style={{ fontSize:11, fontWeight:700, color:C.orange, letterSpacing:".08em", textTransform:"uppercase" }}>seller central</span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.45)" }}>
              {isLoginPage ? "New to Shopzy?" : "Already a seller?"}
            </span>
            <button onClick={() => setIsLoginPage(v => !v)}
              style={{ background:"none", border:"1px solid rgba(255,255,255,0.22)", borderRadius:3, padding:"5px 13px", color:C.white, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {isLoginPage ? "Register" : "Sign In"}
            </button>
          </div>
        </header>

        {/* Main layout */}
        <div style={{ flex:1, display:"flex" }}>

          {/* Form panel */}
          <div style={{ width:560, flexShrink:0, background:C.white, borderRight:`1px solid ${C.divider}`, display:"flex", flexDirection:"column" }}>

            {/* Tab bar */}
            <div style={{ display:"flex", borderBottom:`1px solid ${C.divider}` }}>
              {(["Register","Sign In"] as const).map((tab, i) => {
                const on = isLoginPage === (i === 1);
                return (
                  <button key={tab} onClick={() => setIsLoginPage(i === 1)}
                    style={{ flex:1, padding:"13px", border:"none", fontFamily:"inherit",
                      background: on ? C.white : C.bg,
                      borderBottom:`3px solid ${on ? C.orange : "transparent"}`,
                      color: on ? C.text : C.textMid,
                      fontWeight: on ? 700 : 500, fontSize:13.5, cursor:"pointer", transition:"all .2s" }}>
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Form body */}
            <div style={{ flex:1, overflowY:"auto", padding:"26px 30px" }}>
              <div key={isLoginPage ? "login" : "register"} style={{ animation:"fadeUp .25s ease" }}>
                {isLoginPage ? <SellerLoginForm/> : <SellerAccountForm/>}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding:"13px 30px", borderTop:`1px solid ${C.divider}`, textAlign:"center" }}>
              <p style={{ fontSize:11, color:C.textLight, lineHeight:1.7 }}>
                <a href="#" style={{ color:C.blue }}>Conditions of Use</a>
                {" · "}
                <a href="#" style={{ color:C.blue }}>Privacy Notice</a>
                {" · "}
                <a href="#" style={{ color:C.blue }}>Help</a>
              </p>
              <p style={{ fontSize:11, color:C.textLight, marginTop:3 }}>
                © 1996–2025 Shopzy.com, Inc. or its affiliates. All rights reserved.
              </p>
            </div>
          </div>

          {/* Promo panel */}
          <div style={{ flex:1, background:C.navyMid, overflowY:"auto" }}>
            <RightPanel/>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeSeller;
