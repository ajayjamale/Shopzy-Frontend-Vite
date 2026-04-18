import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { signin, resetOtpState, sendLoginSignupOtp } from '../../../store/customer/AuthSlice'
import OTPInput from '../../../customer/components/otp-field/OTPInput'
import FormFeedbackToast, {
  getAsyncActionError,
  useFormFeedback,
} from '../../../components/forms/FormFeedbackToast'
const emailSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
})
const AdminLoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { auth } = useAppSelector((store) => store)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const { feedback, showSuccess, showError, closeFeedback } = useFormFeedback()
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: emailSchema,
    onSubmit: () => {},
  })
  useEffect(() => {
    if (!isTimerActive) return
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsTimerActive(false)
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerActive])
  const startTimer = () => {
    setTimer(30)
    setIsTimerActive(true)
  }
  const handleSendOtp = async () => {
    const errors = await formik.validateForm()
    if (errors.email) {
      formik.setFieldTouched('email', true)
      showError('Please enter a valid admin email.')
      return
    }
    const action = await dispatch(sendLoginSignupOtp({ email: `signing_${formik.values.email}` }))
    if (sendLoginSignupOtp.fulfilled.match(action)) {
      startTimer()
      showSuccess('OTP sent to your admin email.')
      return
    }
    showError(getAsyncActionError(action, 'Unable to send OTP. Please try again.'))
  }
  const handleResendOtp = async () => {
    const action = await dispatch(sendLoginSignupOtp({ email: `signing_${formik.values.email}` }))
    if (sendLoginSignupOtp.fulfilled.match(action)) {
      startTimer()
      showSuccess('OTP resent successfully.')
      return
    }
    showError(getAsyncActionError(action, 'Unable to resend OTP. Please try again.'))
  }
  const handleLogin = async () => {
    if (otp.length < 6) {
      showError('Please enter the 6-digit OTP.')
      return
    }

    const action = await dispatch(signin({ email: formik.values.email, otp, navigate }))
    if (signin.rejected.match(action)) {
      showError(getAsyncActionError(action, 'Login failed. Please verify OTP and try again.'))
    }
  }
  const hasEmailError = formik.touched.email && Boolean(formik.errors.email)
  return (
    <>
      <style>{`
        .alf-wrap { width: 100%; }

        .alf-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 4px; }
        .alf-label {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .alf-input-wrap {
          border: 1px solid #d5e3e8;
          border-radius: 12px;
          background: #fff;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .alf-input-wrap:focus-within {
          border-color: #0F766E;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(15,118,110,0.14);
        }
        .alf-input-wrap.error { border-color: #be123c; background: #fff9fb; }
        .alf-input {
          width: 100%;
          padding: 11px 13px;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #0F172A;
          outline: none;
          border-radius: 8px;
          box-sizing: border-box;
        }
        .alf-input::placeholder { color: #94a3b8; }
        .alf-error-msg { font-size: 11px; color: #be123c; margin: 2px 0 0 2px; }
        .alf-error-banner {
          margin-top: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #be123c;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 12px;
          padding: 8px 10px;
        }

        .alf-otp-section {
          background: #f0faf8;
          border: 1px solid #cbe7e2;
          border-radius: 12px;
          padding: 16px;
          margin-top: 16px;
        }
        .alf-otp-hint {
          font-size: 12px;
          color: #475569;
          margin: 0 0 12px;
          line-height: 1.5;
        }
        .alf-otp-hint strong { color: #0F172A; }
        .alf-resend-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #64748b;
          margin-top: 10px;
        }
        .alf-resend-btn {
          background: none;
          border: none;
          color: #0F766E;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }
        .alf-resend-btn:hover { color: #0b5f59; }
        .alf-timer { color: #0F766E; font-weight: 700; }

        .alf-btn {
          width: 100%;
          padding: 11px 14px;
          border-radius: 999px;
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
          background: linear-gradient(130deg, #0F766E, #14B8A6);
          border: 1px solid #0b5f59;
          color: #fff;
          box-shadow: 0 10px 18px rgba(15,118,110,0.22);
        }
        .alf-btn-primary:hover:not(:disabled) {
          background: linear-gradient(130deg, #0b5f59, #0F766E);
        }

        .alf-btn-otp {
          background: linear-gradient(130deg, #0F766E, #14B8A6);
          border: 1px solid #0b5f59;
          color: #fff;
          box-shadow: 0 10px 18px rgba(15,118,110,0.22);
        }
        .alf-btn-otp:hover:not(:disabled) {
          background: linear-gradient(130deg, #0b5f59, #0F766E);
        }

        .alf-spin {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: alf-spin 0.7s linear infinite;
        }
        .alf-spin-dark {
          border-color: rgba(255,255,255,0.35);
          border-top-color: #fff;
        }
        @keyframes alf-spin { to { transform: rotate(360deg); } }

        .alf-edit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f7fcfd;
          border: 1px solid #d9e6ea;
          border-radius: 10px;
          padding: 8px 12px;
          margin-bottom: 12px;
        }
        .alf-edit-email { font-size: 13px; font-weight: 600; color: #0F172A; }
        .alf-edit-btn {
          font-size: 12px;
          color: #0F766E;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }
        .alf-edit-btn:hover { color: #0b5f59; }
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
                dispatch(resetOtpState())
                setOtp('')
                setTimer(30)
                setIsTimerActive(false)
              }}
            >
              Change
            </button>
          </div>
        )}

        {auth.otpSent && (
          <div className="alf-otp-section">
            <p className="alf-otp-hint">
              A 6-digit OTP has been sent to <strong>{formik.values.email}</strong>. Enter it below
              to continue.
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
          <button
            className="alf-btn alf-btn-primary"
            onClick={handleSendOtp}
            disabled={auth.loading}
          >
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
          <button
            className="alf-btn alf-btn-otp"
            onClick={handleLogin}
            disabled={auth.loading || otp.length < 6}
          >
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

      <FormFeedbackToast feedback={feedback} onClose={closeFeedback} />
    </>
  )
}
export default AdminLoginForm
