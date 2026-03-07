import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { sendLoginOtp, verifyLoginOtp } from "../../../Redux Toolkit/Seller/sellerAuthenticationSlice";

/* ─── design tokens (shared) ─────────────────────────── */
const C = {
  orange:"#FF9900", navy:"#131921", blue:"#0F6094",
  red:"#C40000",    green:"#007600", greenBg:"#EAF7EA",
  white:"#FFFFFF",  bg:"#F3F3F3",   border:"#CCCCCC",
  borderFoc:"#E77600", shadowFoc:"rgba(231,118,0,0.35)",
  text:"#0F1111",   textMid:"#565959", textLight:"#8D8D8D",
  divider:"#E7E7E7", lightBlue:"#E8F4FD",
};

/* ─── OTP box component ───────────────────────────────── */
function OTPInput({ length = 6, onChange }: { length?: number; onChange: (v: string) => void }) {
  const [vals, setVals] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const nv = [...vals]; nv[i] = digit; setVals(nv); onChange(nv.join(""));
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (vals[i]) { const nv = [...vals]; nv[i] = ""; setVals(nv); onChange(nv.join("")); }
      else if (i > 0) refs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && i > 0)        refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length-1) refs.current[i + 1]?.focus();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const t = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,length);
    const nv = Array(length).fill(""); t.split("").forEach((c,i) => nv[i]=c);
    setVals(nv); onChange(nv.join(""));
    refs.current[Math.min(t.length, length-1)]?.focus();
  };

  return (
    <div style={{ display:"flex", gap:8 }}>
      {vals.map((v, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          value={v} maxLength={1} inputMode="numeric"
          onChange={e => update(i, e.target.value)}
          onKeyDown={e => onKey(i, e)} onPaste={onPaste}
          style={{
            width:44, height:50, textAlign:"center", fontSize:22, fontWeight:700,
            border:`1px solid ${C.border}`, borderRadius:3, outline:"none",
            color:C.text, background:C.white, fontFamily:"inherit",
            transition:"border-color .15s, box-shadow .15s",
          }}
          onFocus={e => { e.target.style.borderColor=C.borderFoc; e.target.style.boxShadow=`0 0 0 3px ${C.shadowFoc}`; }}
          onBlur={e  => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
        />
      ))}
    </div>
  );
}

const Spin = () => (
  <span style={{ display:"inline-block", width:16, height:16, border:"2px solid rgba(0,0,0,0.2)", borderTopColor:C.text, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
);

/* ─── SellerLoginForm ─────────────────────────────────── */
const SellerLoginForm = () => {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();
  const { sellerAuth } = useAppSelector(store => store);

  const [email, setEmail]   = useState("");
  const [otp,   setOtp]     = useState("");
  const [timer, setTimer]   = useState(0);
  const [emailTouched, setEmailTouched] = useState(false);

  // countdown
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /** Send OTP — calls your real Redux thunk */
  const handleSendOtp = () => {
    if (!validEmail) { setEmailTouched(true); return; }
    dispatch(sendLoginOtp(email));
    setTimer(30);
  };

  /** Verify OTP — calls your real Redux thunk */
  const handleLogin = () => {
    dispatch(verifyLoginOtp({ email, otp, navigate }));
  };

  const otpSent = sellerAuth.otpSent;
  const loading = sellerAuth.loading;

  return (
    <>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

        {/* Title */}
        <div style={{ marginBottom:4 }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:C.text, margin:0 }}>Seller Sign In</h3>
          <p style={{ fontSize:12.5, color:C.textMid, marginTop:5, lineHeight:1.5 }}>
            Enter your registered email. We'll send a one-time password — no saved password needed.
          </p>
        </div>

        {/* Email */}
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:13, fontWeight:700, color:C.text }}>
            Registered Email <span style={{ color:C.red }}>*</span>
          </label>
          <input
            type="email" value={email} placeholder="seller@example.com"
            onChange={e => { setEmail(e.target.value); setEmailTouched(false); }}
            onBlur={() => setEmailTouched(true)}
            disabled={otpSent}
            style={{
              width:"100%", padding:"9px 12px", fontSize:13, color:C.text,
              border:`1px solid ${emailTouched && !validEmail ? C.red : C.border}`,
              borderRadius:3, outline:"none", fontFamily:"inherit",
              background: otpSent ? C.bg : C.white,
              boxShadow: emailTouched && !validEmail ? `0 0 0 3px rgba(196,0,0,0.15)` : "none",
            }}
            onFocus={e => { if(!otpSent){ e.target.style.borderColor=C.borderFoc; e.target.style.boxShadow=`0 0 0 3px ${C.shadowFoc}`; }}}
            onBlur2={e => { e.target.style.borderColor=C.border; e.target.style.boxShadow="none"; }}
          />
          {emailTouched && !validEmail && (
            <span style={{ fontSize:12, color:C.red }}>Enter a valid email address</span>
          )}
        </div>

        {/* OTP section — only shown after real otpSent from Redux */}
        {otpSent && (
          <div style={{ display:"flex", flexDirection:"column", gap:10, animation:"fadeUp .3s ease" }}>
            <label style={{ fontSize:13, fontWeight:700, color:C.text }}>
              One-Time Password <span style={{ color:C.red }}>*</span>
            </label>
            <OTPInput length={6} onChange={setOtp} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:C.textLight }}>
                Sent to <strong style={{ color:C.text }}>{email}</strong>
              </span>
              {timer > 0
                ? <span style={{ fontSize:12, color:C.textMid }}>Resend in {timer}s</span>
                : (
                  <button onClick={handleSendOtp} disabled={loading}
                    style={{ background:"none", border:"none", color:C.blue, fontSize:12, fontWeight:600, cursor:"pointer", padding:0, textDecoration:"underline" }}>
                    Resend OTP
                  </button>
                )
              }
            </div>
          </div>
        )}

        {/* Primary button */}
        <button
          onClick={otpSent ? handleLogin : handleSendOtp}
          disabled={loading || !email}
          style={{
            width:"100%", padding:"11px", fontSize:13.5, fontWeight:600,
            background:"linear-gradient(to bottom,#f7dfa5,#f0c14b)",
            border:"1px solid #a88734", borderRadius:3, cursor: loading||!email ? "not-allowed":"pointer",
            opacity: loading||!email ? .6 : 1,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            fontFamily:"inherit", color:C.text,
          }}>
          {loading ? <Spin /> : otpSent ? "Sign in to Seller Central" : "Send OTP"}
        </button>

        {!otpSent && (
          <p style={{ fontSize:12, color:C.textLight, textAlign:"center", lineHeight:1.55 }}>
            A 6-digit OTP will be emailed to you. It expires in 10 minutes.
          </p>
        )}
      </div>
    </>
  );
};

export default SellerLoginForm;