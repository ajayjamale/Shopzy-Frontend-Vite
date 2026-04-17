import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store'
import {
  resetSellerAuthState,
  sendLoginOtp,
  verifyLoginOtp,
} from '../../../store/seller/sellerAuthenticationSlice'
const C = {
  text: '#0E1B2C',
  muted: '#637789',
  border: '#CFE0E5',
  borderFocus: '#0F766E',
  focusRing: 'rgba(15,118,110,0.2)',
  error: '#B42318',
  errorBg: '#FEF0EE',
  teal: '#0F766E',
  tealDark: '#0C5E58',
  tealSoft: '#E5F5F2',
  surface: '#F8FBFC',
}
const Spinner = () => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.45)',
      borderTopColor: '#fff',
      display: 'inline-block',
      animation: 'seller-spin 0.7s linear infinite',
    }}
  />
)
function OtpField({ length = 6, onChange, disabled }) {
  const [digits, setDigits] = useState(Array.from({ length }, () => ''))
  const inputRefs = useRef([])
  const emit = (next) => onChange(next.join(''))
  const update = (index, raw) => {
    const value = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = value
    setDigits(next)
    emit(next)
    if (value && index < length - 1) inputRefs.current[index + 1]?.focus()
  }
  const onKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
        emit(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputRefs.current[index + 1]?.focus()
  }
  const onPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next = Array.from({ length }, (_, i) => pasted[i] || '')
    setDigits(next)
    emit(next)
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus()
  }
  useEffect(() => {
    if (!disabled) return
    setDigits(Array.from({ length }, () => ''))
    onChange('')
  }, [disabled, length, onChange])
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 8 }}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          value={digit}
          disabled={disabled}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => update(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={onPaste}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: disabled ? '#F1F6F8' : '#fff',
            textAlign: 'center',
            color: C.text,
            fontSize: 21,
            fontWeight: 700,
            outline: 'none',
            transition: 'border-color .18s, box-shadow .18s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = C.borderFocus
            e.currentTarget.style.boxShadow = `0 0 0 3px ${C.focusRing}`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = C.border
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      ))}
    </div>
  )
}
const SellerLoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { sellerAuth } = useAppSelector((store) => store)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [timer, setTimer] = useState(0)
  const loading = sellerAuth.loading
  const otpSent = sellerAuth.otpSent
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  useEffect(() => {
    if (timer <= 0) return
    const timeoutId = window.setTimeout(() => setTimer((current) => current - 1), 1000)
    return () => window.clearTimeout(timeoutId)
  }, [timer])
  const sendOtp = () => {
    if (!validEmail) {
      setEmailTouched(true)
      return
    }
    dispatch(sendLoginOtp(email.trim()))
    setTimer(30)
  }
  const verifyOtp = () => {
    if (!validEmail || otp.length !== 6) return
    dispatch(verifyLoginOtp({ email: email.trim(), otp, navigate }))
  }
  const useAnotherEmail = () => {
    setOtp('')
    setTimer(0)
    dispatch(resetSellerAuthState())
  }
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <style>{`
        @keyframes seller-spin { to { transform: rotate(360deg); } }
      `}</style>

      <section
        style={{
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          background: C.surface,
          padding: '16px 16px 14px',
          display: 'grid',
          gap: 6,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, color: C.text, lineHeight: 1.2 }}>Seller Login</h2>
        <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          Sign in with email OTP to access your seller dashboard.
        </p>
      </section>

      <div style={{ display: 'grid', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
          Registered email <span style={{ color: C.error }}>*</span>
        </label>
        <input
          type="email"
          value={email}
          disabled={otpSent}
          placeholder="seller@example.com"
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailTouched(false)
          }}
          onBlur={() => setEmailTouched(true)}
          style={{
            width: '100%',
            borderRadius: 12,
            border: `1px solid ${emailTouched && !validEmail ? C.error : C.border}`,
            minHeight: 46,
            padding: '0 12px',
            outline: 'none',
            fontSize: 14,
            color: C.text,
            background: otpSent ? '#F2F7F8' : '#fff',
            boxShadow: emailTouched && !validEmail ? '0 0 0 3px rgba(180,35,24,0.16)' : 'none',
          }}
          onFocus={(e) => {
            if (!otpSent) {
              e.currentTarget.style.borderColor = C.borderFocus
              e.currentTarget.style.boxShadow = `0 0 0 3px ${C.focusRing}`
            }
          }}
          onBlurCapture={(e) => {
            if (!emailTouched || validEmail) {
              e.currentTarget.style.borderColor = emailTouched && !validEmail ? C.error : C.border
              e.currentTarget.style.boxShadow =
                emailTouched && !validEmail ? '0 0 0 3px rgba(180,35,24,0.16)' : 'none'
            }
          }}
        />
        {emailTouched && !validEmail && (
          <span style={{ color: C.error, fontSize: 12 }}>Please enter a valid email address.</span>
        )}
      </div>

      {otpSent && (
        <section
          style={{
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            background: '#fff',
            padding: '14px 12px',
            display: 'grid',
            gap: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              alignItems: 'baseline',
            }}
          >
            <label style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>
              Enter OTP
            </label>
            <button
              type="button"
              onClick={useAnotherEmail}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: '#0F6094',
                fontSize: 12,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Use another email
            </button>
          </div>
          <OtpField onChange={setOtp} disabled={loading} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 12, color: C.muted }}>
              Sent to <strong style={{ color: C.text }}>{email.trim()}</strong>
            </span>
            {timer > 0 ? (
              <span style={{ fontSize: 12, color: C.muted }}>Resend in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#0F6094',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Resend OTP
              </button>
            )}
          </div>
        </section>
      )}

      {sellerAuth.error && (
        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${C.error}44`,
            background: C.errorBg,
            color: C.error,
            fontSize: 12.5,
            padding: '9px 10px',
            lineHeight: 1.45,
          }}
        >
          {sellerAuth.error}
        </div>
      )}

      <button
        type="button"
        disabled={loading || !email.trim() || (otpSent && otp.length !== 6)}
        onClick={otpSent ? verifyOtp : sendOtp}
        style={{
          minHeight: 48,
          border: '1px solid #0B5E58',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${C.tealDark}, ${C.teal})`,
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor:
            loading || !email.trim() || (otpSent && otp.length !== 6) ? 'not-allowed' : 'pointer',
          opacity: loading || !email.trim() || (otpSent && otp.length !== 6) ? 0.62 : 1,
        }}
      >
        {loading ? <Spinner /> : null}
        {otpSent ? 'Verify and sign in' : 'Send OTP'}
      </button>

      {!otpSent && (
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: C.muted,
            textAlign: 'center',
            lineHeight: 1.55,
          }}
        >
          We will send a 6-digit OTP to your seller email.
        </p>
      )}
    </div>
  )
}
export default SellerLoginForm
