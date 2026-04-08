import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../store";
import { createSeller } from "../../../store/seller/sellerAuthenticationSlice";

const C = {
  text: "#0E1B2C",
  muted: "#65798A",
  border: "#CFE0E5",
  borderFocus: "#0F766E",
  focusRing: "rgba(15,118,110,0.18)",
  teal: "#0F766E",
  tealDark: "#0C5E58",
  error: "#B42318",
  errorBg: "#FEF0EE",
  softBg: "#F6FAFC",
  divider: "#DDE9ED",
};

type SellerFormValues = {
  mobile: string;
  gstin: string;
  pickupAddress: {
    name: string;
    mobile: string;
    pincode: string;
    address: string;
    locality: string;
    city: string;
    state: string;
  };
  bankDetails: {
    accountNumber: string;
    confirmAccount: string;
    ifscCode: string;
    accountHolderName: string;
  };
  sellerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessDetails: {
    businessName: string;
  };
  otp: string;
};

const STEPS = [
  {
    title: "Contact and tax",
    subtitle: "Primary contact details used for account verification.",
  },
  {
    title: "Pickup address",
    subtitle: "Where your products will be picked for shipping.",
  },
  {
    title: "Bank details",
    subtitle: "Used for seller payouts and settlement processing.",
  },
  {
    title: "Business login",
    subtitle: "Store profile and credentials for Seller Central.",
  },
];

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 44,
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  background: "#fff",
  outline: "none",
  color: C.text,
  fontSize: 14,
  padding: "0 12px",
  transition: "border-color .16s, box-shadow .16s",
};

const Spinner = () => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.45)",
      borderTopColor: "#fff",
      display: "inline-block",
      animation: "seller-spin 0.7s linear infinite",
    }}
  />
);

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  error,
  helper,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
  helper?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
        {label}
        {required ? <span style={{ color: C.error, marginLeft: 2 }}>*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...inputBaseStyle,
          borderColor: error ? C.error : C.border,
          boxShadow: error ? "0 0 0 3px rgba(180,35,24,0.14)" : "none",
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = C.borderFocus;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${C.focusRing}`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? C.error : C.border;
          e.currentTarget.style.boxShadow = error ? "0 0 0 3px rgba(180,35,24,0.14)" : "none";
        }}
      />
      {error ? <span style={{ color: C.error, fontSize: 12 }}>{error}</span> : null}
      {!error && helper ? <span style={{ color: C.muted, fontSize: 12 }}>{helper}</span> : null}
    </div>
  );
}

const SellerAccountForm = () => {
  const dispatch = useAppDispatch();
  const sellerAuth = useAppSelector((state) => state.sellerAuth);

  const [activeStep, setActiveStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const formik = useFormik<SellerFormValues>({
    initialValues: {
      mobile: "",
      gstin: "",
      pickupAddress: {
        name: "",
        mobile: "",
        pincode: "",
        address: "",
        locality: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        confirmAccount: "",
        ifscCode: "",
        accountHolderName: "",
      },
      sellerName: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessDetails: {
        businessName: "",
      },
      otp: "",
    },
    onSubmit: (values) => {
      const payload = {
        mobile: values.mobile.trim(),
        gstin: values.gstin.trim().toUpperCase(),
        pickupAddress: {
          name: values.pickupAddress.name.trim(),
          mobile: values.pickupAddress.mobile.trim(),
          pincode: values.pickupAddress.pincode.trim(),
          address: values.pickupAddress.address.trim(),
          locality: values.pickupAddress.locality.trim(),
          city: values.pickupAddress.city.trim(),
          state: values.pickupAddress.state.trim(),
        },
        bankDetails: {
          accountNumber: values.bankDetails.accountNumber.trim(),
          ifscCode: values.bankDetails.ifscCode.trim().toUpperCase(),
          accountHolderName: values.bankDetails.accountHolderName.trim(),
        },
        sellerName: values.sellerName.trim(),
        email: values.email.trim().toLowerCase(),
        businessDetails: {
          businessName: values.businessDetails.businessName.trim(),
        },
        password: values.password,
        accountStatus: "PENDING_VERIFICATION",
        otp: values.otp || "",
      };

      dispatch(createSeller(payload as any));
    },
  });

  const passwordMismatch = useMemo(
    () => Boolean(formik.values.confirmPassword) && formik.values.password !== formik.values.confirmPassword,
    [formik.values.confirmPassword, formik.values.password]
  );

  const accountMismatch = useMemo(
    () =>
      Boolean(formik.values.bankDetails.confirmAccount) &&
      formik.values.bankDetails.accountNumber !== formik.values.bankDetails.confirmAccount,
    [formik.values.bankDetails.accountNumber, formik.values.bankDetails.confirmAccount]
  );

  const validateStep = (step: number): string => {
    const { values } = formik;
    if (step === 0) {
      if (!/^\d{10}$/.test(values.mobile.trim())) return "Enter a valid 10-digit mobile number.";
      if (!/^[0-9A-Z]{15}$/i.test(values.gstin.trim())) return "Enter a valid 15-character GSTIN.";
      return "";
    }
    if (step === 1) {
      const p = values.pickupAddress;
      if (!p.name.trim() || !p.mobile.trim() || !p.pincode.trim() || !p.address.trim() || !p.locality.trim() || !p.city.trim() || !p.state.trim()) {
        return "Please complete all pickup address fields.";
      }
      if (!/^\d{10}$/.test(p.mobile.trim())) return "Pickup mobile must be a valid 10-digit number.";
      if (!/^\d{6}$/.test(p.pincode.trim())) return "Pincode must be 6 digits.";
      return "";
    }
    if (step === 2) {
      const b = values.bankDetails;
      if (!b.accountHolderName.trim() || !b.accountNumber.trim() || !b.ifscCode.trim()) {
        return "Please complete all bank details.";
      }
      if (accountMismatch) return "Account number and confirmation do not match.";
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(b.ifscCode.trim())) return "Enter a valid IFSC code.";
      return "";
    }
    if (step === 3) {
      if (!values.businessDetails.businessName.trim()) return "Business name is required.";
      if (!values.sellerName.trim()) return "Seller display name is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return "Enter a valid email address.";
      if (values.password.length < 8) return "Password must be at least 8 characters.";
      if (passwordMismatch) return "Password and confirm password do not match.";
    }
    return "";
  };

  const continueFlow = () => {
    const err = validateStep(activeStep);
    setStepError(err);
    if (err) return;

    if (activeStep < STEPS.length - 1) {
      setActiveStep((current) => current + 1);
      return;
    }

    formik.handleSubmit();
  };

  const stepCardHeader = (
    <header
      style={{
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        background: C.softBg,
        padding: "13px 14px",
        display: "grid",
        gap: 4,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, color: C.text }}>{STEPS[activeStep].title}</h3>
      <p style={{ margin: 0, fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>{STEPS[activeStep].subtitle}</p>
    </header>
  );

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <style>{`
        @keyframes seller-spin { to { transform: rotate(360deg); } }
        @media (max-width: 760px) {
          .seller-reg-grid-2,
          .seller-reg-grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "10px 10px 12px",
          background: C.softBg,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8 }}>
          {STEPS.map((step, index) => {
            const done = index < activeStep;
            const active = index === activeStep;
            return (
              <div key={step.title} style={{ textAlign: "center", display: "grid", gap: 6 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    margin: "0 auto",
                    border: `1px solid ${done || active ? C.teal : C.border}`,
                    background: done || active ? C.teal : "#fff",
                    color: done || active ? "#fff" : C.muted,
                    fontSize: 12,
                    fontWeight: 800,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {index + 1}
                </div>
                <span style={{ fontSize: 11.5, color: active ? C.text : C.muted, fontWeight: active ? 700 : 600 }}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {stepCardHeader}

      {activeStep === 0 && (
        <div style={{ display: "grid", gap: 12 }}>
          <Field
            label="Mobile number"
            required
            name="mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            placeholder="10-digit mobile number"
            helper="This number is used for account notifications."
          />
          <Field
            label="GSTIN"
            required
            name="gstin"
            value={formik.values.gstin}
            onChange={formik.handleChange}
            placeholder="15-character GSTIN"
            helper="Example: 22AAAAA0000A1Z5"
          />
        </div>
      )}

      {activeStep === 1 && (
        <div style={{ display: "grid", gap: 12 }}>
          <div className="seller-reg-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field
              label="Contact name"
              required
              name="pickupAddress.name"
              value={formik.values.pickupAddress.name}
              onChange={formik.handleChange}
            />
            <Field
              label="Pickup mobile"
              required
              name="pickupAddress.mobile"
              value={formik.values.pickupAddress.mobile}
              onChange={formik.handleChange}
            />
          </div>
          <Field
            label="Address line"
            required
            name="pickupAddress.address"
            value={formik.values.pickupAddress.address}
            onChange={formik.handleChange}
            placeholder="House no, building, street"
          />
          <Field
            label="Locality"
            required
            name="pickupAddress.locality"
            value={formik.values.pickupAddress.locality}
            onChange={formik.handleChange}
          />
          <div className="seller-reg-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field
              label="Pincode"
              required
              name="pickupAddress.pincode"
              value={formik.values.pickupAddress.pincode}
              onChange={formik.handleChange}
            />
            <Field
              label="City"
              required
              name="pickupAddress.city"
              value={formik.values.pickupAddress.city}
              onChange={formik.handleChange}
            />
            <Field
              label="State"
              required
              name="pickupAddress.state"
              value={formik.values.pickupAddress.state}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div style={{ display: "grid", gap: 12 }}>
          <Field
            label="Account holder name"
            required
            name="bankDetails.accountHolderName"
            value={formik.values.bankDetails.accountHolderName}
            onChange={formik.handleChange}
          />
          <div className="seller-reg-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field
              label="Account number"
              required
              name="bankDetails.accountNumber"
              value={formik.values.bankDetails.accountNumber}
              onChange={formik.handleChange}
            />
            <Field
              label="Confirm account number"
              required
              name="bankDetails.confirmAccount"
              value={formik.values.bankDetails.confirmAccount}
              onChange={formik.handleChange}
              error={accountMismatch ? "Account numbers do not match." : ""}
            />
          </div>
          <Field
            label="IFSC code"
            required
            name="bankDetails.ifscCode"
            value={formik.values.bankDetails.ifscCode}
            onChange={(e) => formik.setFieldValue("bankDetails.ifscCode", e.target.value.toUpperCase())}
            placeholder="Example: HDFC0001234"
          />
        </div>
      )}

      {activeStep === 3 && (
        <div style={{ display: "grid", gap: 12 }}>
          <div className="seller-reg-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field
              label="Business name"
              required
              name="businessDetails.businessName"
              value={formik.values.businessDetails.businessName}
              onChange={formik.handleChange}
            />
            <Field
              label="Seller display name"
              required
              name="sellerName"
              value={formik.values.sellerName}
              onChange={formik.handleChange}
            />
          </div>

          <Field
            label="Business email"
            required
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="business@example.com"
          />

          <div className="seller-reg-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field
              label="Password"
              required
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              helper="Minimum 8 characters."
            />
            <Field
              label="Confirm password"
              required
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={passwordMismatch ? "Passwords do not match." : ""}
            />
          </div>
        </div>
      )}

      {(stepError || sellerAuth.error) && (
        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${C.error}40`,
            background: C.errorBg,
            color: C.error,
            padding: "9px 10px",
            fontSize: 12.5,
            lineHeight: 1.45,
          }}
        >
          {stepError || sellerAuth.error}
        </div>
      )}

      <div
        style={{
          marginTop: 2,
          paddingTop: 12,
          borderTop: `1px solid ${C.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (activeStep === 0) return;
            setStepError("");
            setActiveStep((current) => current - 1);
          }}
          disabled={activeStep === 0 || sellerAuth.loading}
          style={{
            minHeight: 42,
            borderRadius: 11,
            border: `1px solid ${C.border}`,
            background: "#fff",
            color: C.text,
            fontSize: 13,
            fontWeight: 700,
            padding: "0 14px",
            cursor: activeStep === 0 || sellerAuth.loading ? "not-allowed" : "pointer",
            opacity: activeStep === 0 || sellerAuth.loading ? 0.55 : 1,
          }}
        >
          Back
        </button>

        <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 700 }}>
          Step {activeStep + 1} / {STEPS.length}
        </span>

        <button
          type="button"
          onClick={continueFlow}
          disabled={sellerAuth.loading}
          style={{
            minHeight: 42,
            borderRadius: 11,
            border: `1px solid ${C.tealDark}`,
            background: `linear-gradient(135deg, ${C.tealDark}, ${C.teal})`,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            padding: "0 16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: sellerAuth.loading ? "not-allowed" : "pointer",
            opacity: sellerAuth.loading ? 0.65 : 1,
          }}
        >
          {sellerAuth.loading ? <Spinner /> : null}
          {activeStep === STEPS.length - 1 ? "Create seller account" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default SellerAccountForm;
