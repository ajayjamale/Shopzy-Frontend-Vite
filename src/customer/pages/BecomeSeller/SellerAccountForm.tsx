import { useState, useRef } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createSeller } from "../../../Redux Toolkit/Seller/sellerAuthenticationSlice";

/* ─── tokens ─────────────────────────────────────────── */
const C = {
  orange:"#FF9900", blue:"#0F6094", red:"#C40000",
  green:"#007600",  greenBg:"#EAF7EA", white:"#FFFFFF",
  bg:"#F3F3F3",     border:"#CCCCCC", borderFoc:"#E77600",
  shadowFoc:"rgba(231,118,0,0.35)", lightBlue:"#E8F4FD",
  text:"#0F1111",   textMid:"#565959", textLight:"#8D8D8D",
  divider:"#E7E7E7", orangeBg:"rgba(255,153,0,0.08)",
};

/* ─── icons ──────────────────────────────────────────── */
const Ic = ({ d, size=16, color="currentColor", sw=1.8 }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d={d}/>
  </svg>
);
const P = {
  check:"M20 6L9 17l-5-5", chevR:"M9 18l6-6-6-6", chevL:"M15 18l-6-6 6-6",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
  phone:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.48-1.48a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  map:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z M12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z",
  bank:"M3 21h18 M3 10h18 M5 6l7-3 7 3 M4 10v11 M20 10v11 M8 14v3 M12 14v3 M16 14v3",
  bldg:"M3 21h18 M9 21V7l3-4 3 4v14 M3 21V11l6-4 M21 21V11l-6-4",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  info:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01",
  mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
};

/* ─── atoms ──────────────────────────────────────────── */
const Spin = () => (
  <span style={{ display:"inline-block", width:15, height:15, border:"2px solid rgba(0,0,0,0.2)", borderTopColor:C.text, borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
);

function InfoBox({ children, type="info" }: any) {
  const cfg: any = {
    info:    { bg:C.lightBlue, bdr:"#B3D9F0", fg:C.blue,  icon:P.info  },
    warning: { bg:"#FFFBEF",   bdr:"#F0D28B", fg:"#7A5100",icon:P.info },
  }[type];
  return (
    <div style={{ background:cfg.bg, border:`1px solid ${cfg.bdr}`, borderRadius:4, padding:"10px 14px", display:"flex", gap:9, alignItems:"flex-start" }}>
      <Ic d={cfg.icon} size={14} color={cfg.fg}/>
      <span style={{ fontSize:12.5, color:cfg.fg, lineHeight:1.55 }}>{children}</span>
    </div>
  );
}

function Field({ label, name, value, onChange, onBlur, error, helperText, type="text", placeholder, required }: any) {
  const [showP, setShowP] = useState(false);
  const isP = type === "password";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      <label style={{ fontSize:13, fontWeight:700, color:C.text }}>
        {label}{required && <span style={{ color:C.red, marginLeft:2 }}>*</span>}
      </label>
      <div style={{ position:"relative" }}>
        <input name={name} value={value} onChange={onChange}
          type={isP && !showP ? "password" : "text"} placeholder={placeholder}
          style={{
            width:"100%", padding:"9px 12px", paddingRight: isP ? 34 : 12,
            fontSize:13, color:C.text, background:C.white, fontFamily:"inherit",
            border:`1px solid ${error ? C.red : C.border}`, borderRadius:3, outline:"none",
            boxShadow: error ? "0 0 0 3px rgba(196,0,0,0.15)" : "none",
            transition:"border-color .15s, box-shadow .15s",
          }}
          onFocus={e => { e.target.style.borderColor=C.borderFoc; e.target.style.boxShadow=`0 0 0 3px ${C.shadowFoc}`; }}
          onBlur={e => { 
            onBlur?.(e); 
            e.target.style.borderColor=error?C.red:C.border; 
            e.target.style.boxShadow=error?"0 0 0 3px rgba(196,0,0,0.15)":"none"; 
          }}
        />
        {isP && (
          <button type="button" onClick={() => setShowP(v => !v)}
            style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", padding:0 }}>
            <Ic d={showP ? P.eyeOff : P.eye} size={15} color={C.blue}/>
          </button>
        )}
      </div>
      {error && helperText   && <span style={{ fontSize:12, color:C.red      }}>{helperText}</span>}
      {!error && helperText  && <span style={{ fontSize:12, color:C.textLight }}>{helperText}</span>}
    </div>
  );
}

/* ─── Stepper ────────────────────────────────────────── */
const STEPS = [
  { short:"Contact", icon:P.phone },
  { short:"Address", icon:P.map   },
  { short:"Bank",    icon:P.bank  },
  { short:"Business",icon:P.bldg  },
];

function Stepper({ active }: { active: number }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", marginBottom:28 }}>
      {STEPS.map((s, i) => {
        const done=i<active, cur=i===active, last=i===STEPS.length-1;
        return (
          <div key={s.short} style={{ display:"flex", alignItems:"flex-start", flex:last?0:1 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{
                width:36, height:36, borderRadius:"50%", flexShrink:0,
                background: done ? C.orange : C.white,
                border:`2px solid ${done||cur ? C.orange : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow: cur ? "0 0 0 4px rgba(255,153,0,0.18)" : "none",
                animation: cur ? "ringPulse 2.4s ease infinite" : "none",
                transition:"all .35s ease",
              }}>
                {done
                  ? <Ic d={P.check} size={15} color={C.white} sw={2.5}/>
                  : <Ic d={s.icon}  size={14} color={cur ? C.orange : C.border}/>}
              </div>
              <span style={{ fontSize:10.5, fontWeight:cur?700:done?600:400, color:cur?C.orange:done?C.text:C.textLight, whiteSpace:"nowrap" }}>
                {s.short}
              </span>
            </div>
            {!last && (
              <div style={{ flex:1, paddingTop:17, paddingInline:4 }}>
                <div style={{ height:2, background:C.divider, borderRadius:2, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", inset:0, background:C.orange, width:done?"100%":cur?"40%":"0%", transition:"width .55s cubic-bezier(.4,0,.2,1)" }}/>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step panels ────────────────────────────────────── */
function Step1({ formik }: any) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"fadeUp .28s ease" }}>
      <div style={{ paddingBottom:14, borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, background:C.orangeBg, border:"1px solid rgba(255,153,0,0.2)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d={P.phone} size={15} color={C.orange}/>
          </div>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text }}>Contact & Tax Details</h3>
        </div>
      </div>
      <Field required label="Mobile Number" name="mobile"
        value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile ? formik.errors.mobile as string : "10-digit Indian mobile number"}
        placeholder="e.g. 9876543210"/>
      <Field required label="GSTIN Number" name="gstin"
        value={formik.values.gstin} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.gstin && Boolean(formik.errors.gstin)}
        helperText={formik.touched.gstin ? formik.errors.gstin as string : "15-character GST Identification Number"}
        placeholder="e.g. 22AAAAA0000A1Z5"/>
      <InfoBox type="info">Your GSTIN is verified with the GST portal in real time. Ensure it is active and linked to your business.</InfoBox>
    </div>
  );
}

function Step2({ formik }: any) {
  const pa = "pickupAddress";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeUp .28s ease" }}>
      <div style={{ paddingBottom:14, borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, background:C.orangeBg, border:"1px solid rgba(255,153,0,0.2)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d={P.map} size={15} color={C.orange}/>
          </div>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text }}>Pickup Address</h3>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field required label="Full Name" name={`${pa}.name`}
          value={formik.values.pickupAddress.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.pickupAddress?.name && Boolean(formik.errors.pickupAddress?.name)}
          helperText={(formik.touched.pickupAddress?.name && formik.errors.pickupAddress?.name as string) || ""}
          placeholder="Contact person"/>
        <Field required label="Mobile" name={`${pa}.mobile`}
          value={formik.values.pickupAddress.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.pickupAddress?.mobile && Boolean(formik.errors.pickupAddress?.mobile)}
          helperText={(formik.touched.pickupAddress?.mobile && formik.errors.pickupAddress?.mobile as string)||""}
          placeholder="10-digit number"/>
      </div>
      <Field required label="Flat / House No, Building, Street" name={`${pa}.address`}
        value={formik.values.pickupAddress.address} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
        helperText={(formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address as string)||""}
        placeholder="e.g. 12A, Sunrise Apartments, MG Road"/>
      <Field required label="Locality / Town" name={`${pa}.locality`}
        value={formik.values.pickupAddress.locality} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.pickupAddress?.locality && Boolean(formik.errors.pickupAddress?.locality)}
        helperText={(formik.touched.pickupAddress?.locality && formik.errors.pickupAddress?.locality as string)||""}
        placeholder="Area or town name"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        <Field required label="Pincode" name={`${pa}.pincode`}
          value={formik.values.pickupAddress.pincode} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.pickupAddress?.pincode && Boolean(formik.errors.pickupAddress?.pincode)}
          helperText={(formik.touched.pickupAddress?.pincode && formik.errors.pickupAddress?.pincode as string)||""}
          placeholder="6 digits"/>
        <Field required label="City" name={`${pa}.city`}
          value={formik.values.pickupAddress.city} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
          helperText={(formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city as string)||""}/>
        <Field required label="State" name={`${pa}.state`}
          value={formik.values.pickupAddress.state} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.pickupAddress?.state && Boolean(formik.errors.pickupAddress?.state)}
          helperText={(formik.touched.pickupAddress?.state && formik.errors.pickupAddress?.state as string)||""}/>
      </div>
    </div>
  );
}

function Step3({ formik }: any) {
  const bk = "bankDetails";
  const mismatch = formik.values.bankDetails.confirmAccount &&
    formik.values.bankDetails.accountNumber !== formik.values.bankDetails.confirmAccount;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"fadeUp .28s ease" }}>
      <div style={{ paddingBottom:14, borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, background:C.orangeBg, border:"1px solid rgba(255,153,0,0.2)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d={P.bank} size={15} color={C.orange}/>
          </div>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text }}>Bank Account Details</h3>
        </div>
      </div>
      <InfoBox type="warning">Ensure your account is active and linked to your PAN. Incorrect details can delay payouts.</InfoBox>
      <Field required label="Account Holder Name" name={`${bk}.accountHolderName`}
        value={formik.values.bankDetails.accountHolderName} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.bankDetails?.accountHolderName && Boolean(formik.errors.bankDetails?.accountHolderName)}
        helperText={(formik.touched.bankDetails?.accountHolderName && formik.errors.bankDetails?.accountHolderName as string)||"Exactly as per bank records"}
        placeholder="As per bank records"/>
      <Field required label="Account Number" name={`${bk}.accountNumber`}
        value={formik.values.bankDetails.accountNumber} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.bankDetails?.accountNumber && Boolean(formik.errors.bankDetails?.accountNumber)}
        helperText={(formik.touched.bankDetails?.accountNumber && formik.errors.bankDetails?.accountNumber as string)||""}
        placeholder="Enter account number"/>
      <Field required label="Confirm Account Number" name={`${bk}.confirmAccount`}
        value={formik.values.bankDetails.confirmAccount} onChange={formik.handleChange}
        error={Boolean(mismatch)} helperText={mismatch ? "Account numbers do not match" : ""}
        placeholder="Re-enter to confirm"/>
      <Field required label="IFSC Code" name={`${bk}.ifscCode`}
        value={formik.values.bankDetails.ifscCode}
        onChange={e => formik.setFieldValue(`${bk}.ifscCode`, (e.target as HTMLInputElement).value.toUpperCase())}
        onBlur={formik.handleBlur}
        error={formik.touched.bankDetails?.ifscCode && Boolean(formik.errors.bankDetails?.ifscCode)}
        helperText={(formik.touched.bankDetails?.ifscCode && formik.errors.bankDetails?.ifscCode as string)||"11-char code — e.g. SBIN0001234"}
        placeholder="e.g. HDFC0001234"/>
      <InfoBox type="info"><Ic d={P.shield} size={12} color={C.blue}/> Banking data is encrypted with 256-bit SSL.</InfoBox>
    </div>
  );
}

function Step4({ formik }: any) {
  const passMatch = formik.values.confirmPassword &&
    formik.values.password !== formik.values.confirmPassword;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeUp .28s ease" }}>
      <div style={{ paddingBottom:14, borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, background:C.orangeBg, border:"1px solid rgba(255,153,0,0.2)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ic d={P.bldg} size={15} color={C.orange}/>
          </div>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text }}>Business & Login Details</h3>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field required label="Business / Store Name" name="businessDetails.businessName"
          value={formik.values.businessDetails.businessName} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.businessDetails?.businessName && Boolean(formik.errors.businessDetails?.businessName)}
          helperText={(formik.touched.businessDetails?.businessName && formik.errors.businessDetails?.businessName as string)||"Displayed to customers"}
          placeholder="Your brand or store name"/>
        <Field required label="Seller Display Name" name="sellerName"
          value={formik.values.sellerName} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
          helperText={(formik.touched.sellerName && formik.errors.sellerName as string)||""}
          placeholder="Your public seller name"/>
      </div>
      <Field required label="Business Email" name="email"
        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={(formik.touched.email && formik.errors.email as string)||"Used for notifications & invoices"}
        placeholder="business@example.com"/>
      <Field label="Registered Business Address" name="businessDetails.businessAddress"
        value={formik.values.businessDetails.businessAddress || ""} onChange={formik.handleChange}
        placeholder="Official registered address"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field required label="Password" name="password" type="password"
          value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={(formik.touched.password && formik.errors.password as string)||"Minimum 8 characters"}
          placeholder="Create a strong password"/>
        <Field required label="Confirm Password" name="confirmPassword" type="password"
          value={formik.values.confirmPassword || ""} onChange={formik.handleChange}
          error={Boolean(passMatch)} helperText={passMatch ? "Passwords do not match" : ""}
          placeholder="Re-enter password"/>
      </div>
      <div style={{ background:C.bg, border:`1px solid ${C.divider}`, borderRadius:4, padding:"11px 14px" }}>
        <p style={{ fontSize:12, color:C.textMid, lineHeight:1.65 }}>
          By creating an account you agree to Amazon's{" "}
          <a href="#" style={{ color:C.blue }}>Seller Agreement</a>,{" "}
          <a href="#" style={{ color:C.blue }}>Privacy Notice</a>, and{" "}
          <a href="#" style={{ color:C.blue }}>Conditions of Use</a>.
        </p>
      </div>
    </div>
  );
}

/* ─── SellerAccountForm ───────────────────────────────── */
const SellerAccountForm = () => {
  const dispatch = useAppDispatch();
  const { sellerAuth } = useAppSelector(store => store);
  const [activeStep, setActiveStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      mobile: "", gstin: "",
      pickupAddress: { name:"", mobile:"", pincode:"", address:"", locality:"", city:"", state:"" },
      /* confirmAccount is UI-only — not sent to API */
      bankDetails: { accountNumber:"", confirmAccount:"", ifscCode:"", accountHolderName:"" },
      sellerName: "", email: "", password: "", confirmPassword: "",
      businessDetails: { businessName:"", businessEmail:"", businessMobile:"", logo:"", banner:"", businessAddress:"" },
      otp: "",
    },
    onSubmit: (values) => {
      // strip UI-only fields before dispatching
      const { bankDetails: { confirmAccount, ...bank }, confirmPassword, ...rest } = values as any;
      dispatch(createSeller({ ...rest, bankDetails: bank }));
    },
  });

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) { setActiveStep(s => s + 1); return; }
    formik.handleSubmit();
  };

  const loading = sellerAuth.loading;

  return (
    <>
      <style>{`
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes ringPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,153,0,0.45)}60%{box-shadow:0 0 0 7px rgba(255,153,0,0)} }
      `}</style>

      <Stepper active={activeStep}/>

      <div style={{ minHeight:300 }}>
        {activeStep === 0 && <Step1 formik={formik}/>}
        {activeStep === 1 && <Step2 formik={formik}/>}
        {activeStep === 2 && <Step3 formik={formik}/>}
        {activeStep === 3 && <Step4 formik={formik}/>}
      </div>

      {/* Navigation */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:22, paddingTop:16, borderTop:`1px solid ${C.divider}` }}>
        <button onClick={() => setActiveStep(s => s-1)} disabled={activeStep === 0}
          style={{ background:"linear-gradient(to bottom,#f7f8f8,#e7e9ec)", border:"1px solid #adb1b8", borderRadius:3, padding:"9px 18px", fontWeight:500, fontSize:13, cursor:activeStep===0?"not-allowed":"pointer", opacity:activeStep===0?.55:1, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          <Ic d={P.chevL} size={14}/> Back
        </button>

        <span style={{ fontSize:11.5, color:C.textLight }}>Step {activeStep+1} of {STEPS.length}</span>

        <button onClick={handleNext} disabled={loading}
          style={{ background:"linear-gradient(to bottom,#f7dfa5,#f0c14b)", border:"1px solid #a88734", borderRadius:3, padding:"9px 22px", fontWeight:600, fontSize:13, cursor:loading?"not-allowed":"pointer", opacity:loading?.6:1, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", color:C.text }}>
          {loading ? <Spin/> : activeStep === STEPS.length-1
            ? "Create Account"
            : <><span>Continue</span><Ic d={P.chevR} size={14}/></>}
        </button>
      </div>
    </>
  );
};

export default SellerAccountForm;