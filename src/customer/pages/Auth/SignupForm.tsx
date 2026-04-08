import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { sendLoginSignupOtp, signup } from "../../../Redux Toolkit/Customer/AuthSlice";
import OTPInput from "../../components/OtpFild/OTPInput";
import "./Auth.css";

const schema = Yup.object({
  fullName: Yup.string().min(2, "Minimum 2 characters").required("Required"),
  email: Yup.string().email("Enter a valid email").required("Required"),
  phoneNumber: Yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit number").required("Required"),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const otpSent = useAppSelector((state) => state.auth.otpSent);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: schema,
    onSubmit: () => undefined,
  });

  const sendOtp = async () => {
    const errors = await formik.validateForm();
    formik.setTouched({ fullName: true, email: true, phoneNumber: true });
    if (Object.keys(errors).length) return;

    await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
    setTimer(30);
    setTimerActive(true);
  };

  const verifyAndSignup = () => {
    if (otp.length !== 6) return;
    dispatch(
      signup({
        fullName: formik.values.fullName,
        email: formik.values.email,
        mobile: formik.values.phoneNumber,
        otp,
        navigate,
      })
    );
  };

  useEffect(() => {
    if (!timerActive) return;
    if (timer === 0) {
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  return (
    <div className="grid gap-4">
      {[
        ["Full Name", "fullName", "text", "Alex Johnson"],
        ["Mobile", "phoneNumber", "tel", "9876543210"],
        ["Email", "email", "email", "you@example.com"],
      ].map(([label, key, type, placeholder]) => (
        <div className="auth-field" key={key}>
          <label>{label}</label>
          <input
            type={type}
            name={key}
            value={(formik.values as any)[key]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="auth-input"
            placeholder={placeholder as string}
            disabled={otpSent}
          />
          {formik.touched[key as keyof typeof formik.touched] && formik.errors[key as keyof typeof formik.errors] && (
            <span className="auth-error">{(formik.errors as any)[key]}</span>
          )}
        </div>
      ))}

      {otpSent && (
        <div className="auth-otp">
          <p>
            Enter the OTP sent to <strong>{formik.values.email}</strong>
          </p>
          <OTPInput length={6} onChange={setOtp} error={false} />
          <p>
            {timerActive ? (
              <>Resend in {timer}s</>
            ) : (
              <button type="button" className="btn-secondary" style={{ height: 32 }} onClick={sendOtp}>
                Resend OTP
              </button>
            )}
          </p>
        </div>
      )}

      {!otpSent ? (
        <button type="button" className="btn-primary w-full" onClick={sendOtp} disabled={loading}>
          {loading ? "Sending OTP..." : "Continue"}
        </button>
      ) : (
        <button type="button" className="btn-primary w-full" onClick={verifyAndSignup} disabled={loading || otp.length !== 6}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      )}
    </div>
  );
};

export default SignupForm;
