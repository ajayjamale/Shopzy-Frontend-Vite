import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { sendLoginSignupOtp, signin } from '../../../Redux Toolkit/Customer/AuthSlice';
import OTPInput from '../../components/OtpFild/OTPInput';
import './Auth.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Enter your email address'),
});

const LoginForm = () => {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();

  // ✅ Select only primitives — prevents "returned root state" warning
  const loading  = useAppSelector((state) => state.auth.loading);
  const otpSent  = useAppSelector((state) => state.auth.otpSent);

  const [otp, setOtp]                   = useState('');
  const [timer, setTimer]               = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: () => {},
  });

  const handleSendOtp = async () => {
    const errors = await formik.validateForm();
    formik.setTouched({ email: true });
    if (Object.keys(errors).length === 0 && formik.values.email) {
      await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
      setIsTimerActive(true);
      setTimer(30);
    }
  };

  const handleResendOtp = async () => {
    await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
    setIsTimerActive(true);
    setTimer(30);
  };

  const handleSignIn = () => {
    if (otp.length === 6) {
      dispatch(signin({ email: formik.values.email, otp, navigate }));
    }
  };

  useEffect(() => {
    if (!isTimerActive || timer === 0) {
      setIsTimerActive(false);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  return (
    <div className="auth-form-horizontal">

      {/* Email */}
      <div className="auth-form-group-horizontal">
        <label className="auth-label-horizontal">Email or mobile phone number</label>
        <div className="auth-input-wrapper-horizontal">
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="email"
            autoFocus
            disabled={otpSent}
            className={`auth-input-horizontal ${
              formik.touched.email && formik.errors.email ? 'error' : ''
            }`}
          />
          {formik.values.email && !formik.errors.email && (
            <span className="auth-input-valid-horizontal">✓</span>
          )}
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="auth-error-horizontal">{formik.errors.email}</p>
        )}
      </div>

      {/* OTP Section */}
      {otpSent && (
        <div className="auth-otp-section-horizontal">
          <div className="auth-otp-box-horizontal">
            <p className="auth-otp-title-horizontal">Enter OTP</p>
            <p className="auth-otp-subtitle-horizontal">
              We've sent a One Time Password to{' '}
              <strong>{formik.values.email}</strong>
            </p>
            <div className="auth-otp-container-horizontal">
              <OTPInput length={6} onChange={setOtp} error={false} />
            </div>
            <div className="auth-timer-container-horizontal">
              {isTimerActive ? (
                <p className="auth-timer-text-horizontal">
                  Resend OTP in <span className="auth-timer-bold-horizontal">{timer}s</span>
                </p>
              ) : (
                <p className="auth-timer-text-horizontal">
                  Didn't receive it?{' '}
                  <button type="button" onClick={handleResendOtp} className="auth-resend-button-horizontal">
                    Resend OTP
                  </button>
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading || otp.length !== 6}
            className="auth-button-horizontal"
          >
            {loading
              ? <span className="auth-loading-container-horizontal"><span className="auth-loading-horizontal" />Verifying...</span>
              : 'Sign in'}
          </button>
        </div>
      )}

      {/* Continue button */}
      {!otpSent && (
        <>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || !formik.values.email || !!formik.errors.email}
            className="auth-button-horizontal"
          >
            {loading
              ? <span className="auth-loading-container-horizontal"><span className="auth-loading-horizontal" />Sending OTP...</span>
              : 'Continue'}
          </button>

          <p className="auth-footer-horizontal" style={{ marginTop: '1rem' }}>
            By continuing, you agree to shop.in's{' '}
            <a href="/conditions">Conditions of Use</a> and{' '}
            <a href="/privacy">Privacy Notice</a>.
          </p>
        </>
      )}
    </div>
  );
};

export default LoginForm;