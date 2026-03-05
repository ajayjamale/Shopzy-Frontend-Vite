import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import { useAppSelector } from '../../../Redux Toolkit/Store';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './Auth.css';

const Auth = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Select only the primitive fields needed — never select the whole slice object
  const jwt      = useAppSelector((state) => state.auth.jwt);
  const otpSent  = useAppSelector((state) => state.auth.otpSent);
  const error    = useAppSelector((state) => state.auth.error);

  // Redirect if already authenticated
  useEffect(() => {
    if (jwt) navigate('/');
  }, [jwt, navigate]);

  // Show toast on OTP sent or error
  useEffect(() => {
    if (otpSent || error) setSnackbarOpen(true);
  }, [otpSent, error]);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <div className="auth-horizontal-container">

      {/* Logo */}
      <div className="auth-brand-logo" onClick={() => navigate('/')}>
        <span className="auth-brand-logo-text">
          shop<span>.</span>in
        </span>
      </div>

      {/* Form Card */}
      <div className="auth-form-section-horizontal">
        <div className="auth-form-header">
          <h2>{isLoginPage ? 'Sign in' : 'Create account'}</h2>
          <p>
            {isLoginPage
              ? 'Enter your email to receive a one-time password'
              : 'Fill in your details to get started'}
          </p>
        </div>

        {isLoginPage ? <LoginForm /> : <SignupForm />}

        <div className="auth-toggle-horizontal">
          <span>{isLoginPage ? 'New to shop.in?' : 'Already have an account?'}</span>
          <button
            onClick={() => setIsLoginPage((prev) => !prev)}
            className="auth-toggle-button-horizontal"
          >
            {isLoginPage ? 'Create your account' : 'Sign in'}
          </button>
        </div>
      </div>

      {/* Legal footer */}
      <div className="auth-below-card">
        <div className="auth-below-divider">
          <span>Conditions of Use &nbsp;|&nbsp; Privacy Notice &nbsp;|&nbsp; Help</span>
        </div>
        <p>© 1996–2025, shop.in, Inc. or its affiliates</p>
      </div>

      {/* Toast */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          variant="filled"
          sx={{
            borderRadius: '3px',
            backgroundColor: error ? '#c40000' : '#067d62',
            color: '#ffffff',
            fontWeight: 500,
            fontSize: '0.875rem',
            fontFamily: "'Amazon Ember', 'Helvetica Neue', Arial, sans-serif",
            '& .MuiAlert-icon': { color: '#ffffff' },
          }}
        >
          {error
            ? typeof error === 'string' ? error : 'Something went wrong. Please try again.'
            : 'Verification code sent to your email!'}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;