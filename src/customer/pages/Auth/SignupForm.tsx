import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { sendLoginSignupOtp, signup } from '../../../Redux Toolkit/Customer/AuthSlice';
import OTPInput from '../../components/OtpFild/OTPInput';
import './Auth.css';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Enter your name')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Enter your email address'),
  phoneNumber: Yup.string()
    .required('Enter your mobile number')
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ✅ Select only primitives — prevents "returned root state" warning
  const loading = useAppSelector((state) => state.auth.loading);
  const otpSent = useAppSelector((state) => state.auth.otpSent);

  const [otp, setOtp]                     = useState('');
  const [timer, setTimer]                 = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const formik = useFormik({
    initialValues: { fullName: '', email: '', phoneNumber: '' },
    validationSchema,
    onSubmit: () => {},
  });

  const handleSendOtp = async () => {
    const errors = await formik.validateForm();
    formik.setTouched({ fullName: true, email: true, phoneNumber: true });
    if (Object.keys(errors).length === 0) {
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

  const handleSignUp = () => {
    if (otp.length === 6) {
      dispatch(signup({
        fullName: formik.values.fullName,
        email: formik.values.email,
        phoneNumber: formik.values.phoneNumber,
        otp,
        navigate,
      }));
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

  // Helper for clean input props
  const field = (name: 'fullName' | 'email' | 'phoneNumber') => ({
    name,
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    disabled: otpSent,
    className: `auth-input-horizontal ${
      formik.touched[name] && formik.errors[name] ? 'error' : ''
    }`,
  });

  const isValid = (name: 'fullName' | 'email' | 'phoneNumber') =>
    Boolean(formik.values[name]) && !formik.errors[name];

  const showError = (name: 'fullName' | 'email' | 'phoneNumber') =>
    formik.touched[name] && formik.errors[name]
      ? <p className="auth-error-horizontal">{formik.errors[name]}</p>
      : null;

  return (
    <div className="auth-form-horizontal">

      {/* Full Name */}
      <div className="auth-form-group-horizontal">
        <label className="auth-label-horizontal">Your name</label>
        <div className="auth-input-wrapper-horizontal">
          <input type="text" {...field('fullName')} placeholder="First and last name" autoComplete="name" autoFocus />
          {isValid('fullName') && <span className="auth-input-valid-horizontal">✓</span>}
        </div>
        {showError('fullName')}
      </div>

      {/* Mobile */}
      <div className="auth-form-group-horizontal">
        <label className="auth-label-horizontal">Mobile number</label>
        <div className="auth-input-wrapper-horizontal">
          <input type="tel" {...field('phoneNumber')} placeholder="10-digit mobile number" maxLength={10} autoComplete="tel" />
          {isValid('phoneNumber') && <span className="auth-input-valid-horizontal">✓</span>}
        </div>
        {showError('phoneNumber')}
      </div>

      {/* Email */}
      <div className="auth-form-group-horizontal">
        <label className="auth-label-horizontal">Email</label>
        <div className="auth-input-wrapper-horizontal">
          <input type="email" {...field('email')} autoComplete="email" />
          {isValid('email') && <span className="auth-input-valid-horizontal">✓</span>}
        </div>
        {showError('email')}
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
            onClick={handleSignUp}
            disabled={loading || otp.length !== 6}
            className="auth-button-horizontal"
          >
            {loading
              ? <span className="auth-loading-container-horizontal"><span className="auth-loading-horizontal" />Creating account...</span>
              : 'Create your account'}
          </button>
        </div>
      )}

      {/* Continue button */}
      {!otpSent && (
        <>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || !formik.values.fullName || !formik.values.email || !formik.values.phoneNumber}
            className="auth-button-horizontal"
          >
            {loading
              ? <span className="auth-loading-container-horizontal"><span className="auth-loading-horizontal" />Sending OTP...</span>
              : 'Continue'}
          </button>

          <p className="auth-footer-horizontal" style={{ marginTop: '1rem' }}>
            By creating an account, you agree to shop.in's{' '}
            <a href="/conditions">Conditions of Use</a> and{' '}
            <a href="/privacy">Privacy Notice</a>.
          </p>
        </>
      )}
    </div>
  );
};

export default SignupForm;