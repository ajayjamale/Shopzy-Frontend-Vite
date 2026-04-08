/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { signin, resetOtpState, sendLoginSignupOtp } from '../../../store/customer/AuthSlice';
import OTPInput from '../../../customer/components/OtpFild/OTPInput';

const emailSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: emailSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    if (!isTimerActive) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const startTimer = () => {
    setTimer(30);
    setIsTimerActive(true);
  };

  const handleSendOtp = async () => {
    const errors = await formik.validateForm();
    if (errors.email) {
      formik.setFieldTouched('email', true);
      return;
    }

    const action = await dispatch(sendLoginSignupOtp({ email: `signing_${formik.values.email}` }));
    if (sendLoginSignupOtp.fulfilled.match(action)) {
      startTimer();
    }
  };

  const handleResendOtp = async () => {
    const action = await dispatch(sendLoginSignupOtp({ email: `signing_${formik.values.email}` }));
    if (sendLoginSignupOtp.fulfilled.match(action)) {
      startTimer();
    }
  };

  const handleLogin = () => {
    if (otp.length < 6) return;
    dispatch(signin({ email: formik.values.email, otp, navigate }));
  };

  const hasEmailError = formik.touched.email && Boolean(formik.errors.email);

  return (
    <>
      <style>{`
        .alf-wrap { width: 100%; }

        .alf-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 4px; }
        .alf-label { font-size: 12px; font-weight: 600; color: #555; letter-spacing: 0.1px; }
        .alf-input-wrap {
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          background: #fafafa;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .alf-input-wrap:focus-within {
          border-color: #0F172A;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(19,25,33,0.08);
        }
        .alf-input-wrap.error { border-color: #e53935; background: #fff9f9; }
        .alf-input {
          width: 100%;
          padding: 10px 13px;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #0F172A;
          outline: none;
          border-radius: 8px;
          box-sizing: border-box;
        }
        .alf-input::placeholder { color: #bbb; }
        .alf-error-msg { font-size: 11px; color: #e53935; margin: 2px 0 0 2px; }
        .alf-error-banner {
          margin-top: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #b3261e;
          background: #fdecea;
          border: 1px solid #f7c6c2;
          border-radius: 8px;
          padding: 8px 10px;
        }

        .alf-otp-section {
          background: #f8fffe;
          border: 1px solid #c8e6e8;
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }
        .alf-otp-hint {
          font-size: 12px;
          color: #555;
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .alf-otp-hint strong { color: #0F172A; }
        .alf-resend-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #888;
          margin-top: 10px;
        }
        .alf-resend-btn {
          background: none;
          border: none;
          color: #0E7490;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }
        .alf-resend-btn:hover { color: #005f6b; }
        .alf-timer { color: #0E7490; font-weight: 600; }

        .alf-btn {
          width: 100%;
          padding: 11px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.15s, transform 0.1s;
          margin-top: 16px;
        }
        .alf-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }
        .alf-btn:hover:not(:disabled) { transform: translateY(-1px); }

        .alf-btn-primary {
          background: #0F172A;
          border: 1px solid #0F172A;
          color: #0F766E;
        }
        .alf-btn-primary:hover:not(:disabled) { background: #1f2937; }

        .alf-btn-otp {
          background: linear-gradient(to bottom, #FFD814, #F8B200);
          border: 1px solid #C7980A;
          color: #111;
        }
        .alf-btn-otp:hover:not(:disabled) { background: linear-gradient(to bottom, #f7ca00, #e5a800); }

        .alf-spin {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #0F766E;
          border-radius: 50%;
          animation: alf-spin 0.7s linear infinite;
        }
        .alf-spin-dark {
          border-color: rgba(0,0,0,0.15);
          border-top-color: #333;
        }
        @keyframes alf-spin { to { transform: rotate(360deg); } }

        .alf-edit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f5f5f5;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 12px;
        }
        .alf-edit-email { font-size: 13px; font-weight: 600; color: #0F172A; }
        .alf-edit-btn {
          font-size: 12px;
          color: #0E7490;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }
        .alf-edit-btn:hover { color: #005f6b; }
      `}</style>

      <div className="alf-wrap">
        {!auth.otpSent ? (
          <div className="alf-field">
            <label className="alf-label">Email Address</label>
            <div className={`alf-input-wrap ${hasEmailError ? 'error' : ''}`}>
              <input
                className="alf-input"
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                autoFocus
              />
            </div>
            {hasEmailError && <p className="alf-error-msg">{formik.errors.email}</p>}
          </div>
        ) : (
          <div className="alf-edit-row">
            <span className="alf-edit-email">Email: {formik.values.email}</span>
            <button
              className="alf-edit-btn"
              onClick={() => {
                dispatch(resetOtpState());
                setOtp('');
                setTimer(30);
                setIsTimerActive(false);
              }}
            >
              Change
            </button>
          </div>
        )}

        {auth.otpSent && (
          <div className="alf-otp-section">
            <p className="alf-otp-hint">
              A 6-digit OTP has been sent to <strong>{formik.values.email}</strong>. Enter it below to continue.
            </p>
            <OTPInput length={6} onChange={setOtp} error={false} />
            <div className="alf-resend-row">
              {isTimerActive ? (
                <>
                  Resend OTP in <span className="alf-timer">{timer}s</span>
                </>
              ) : (
                <>
                  Did not receive it?
                  <button className="alf-resend-btn" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {!auth.otpSent && (
          <button className="alf-btn alf-btn-primary" onClick={handleSendOtp} disabled={auth.loading}>
            {auth.loading ? (
              <>
                <span className="alf-spin" /> Sending...
              </>
            ) : (
              'Continue with OTP ->'
            )}
          </button>
        )}

        {auth.otpSent && (
          <button className="alf-btn alf-btn-otp" onClick={handleLogin} disabled={auth.loading || otp.length < 6}>
            {auth.loading ? (
              <>
                <span className="alf-spin alf-spin-dark" /> Verifying...
              </>
            ) : (
              'Login to Dashboard ->'
            )}
          </button>
        )}

        {auth.error && <div className="alf-error-banner">{auth.error}</div>}
      </div>
    </>
  );
};

export default AdminLoginForm;
