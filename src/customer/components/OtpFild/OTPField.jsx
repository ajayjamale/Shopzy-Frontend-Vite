import { useState, useRef, useEffect } from 'react'
/* ── shared hook for OTP state ───────────────────────── */
function useOTPState(length) {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const [focused, setFocused] = useState(null)
  const refs = useRef([])
  const handleChange = (e, i) => {
    const v = e.target.value.replace(/[^0-9]/g, '')
    if (v.length > 1) return
    const next = [...otp]
    next[i] = v
    setOtp(next)
    if (v && i < length - 1) refs.current[i + 1]?.focus()
  }
  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, length)
    const next = [...otp]
    pasted.split('').forEach((c, i) => {
      next[i] = c
    })
    setOtp(next)
    const nxt = next.findIndex((v) => !v)
    refs.current[nxt === -1 ? length - 1 : nxt]?.focus()
  }
  return { otp, focused, setFocused, refs, handleChange, handleKeyDown, handlePaste }
}
/* ── OTPInput component ──────────────────────────────── */
function OTPInput({ length = 6, onChange, error = false }) {
  const { otp, focused, setFocused, refs, handleChange, handleKeyDown, handlePaste } =
    useOTPState(length)
  const filled = otp.filter(Boolean).length
  useEffect(() => {
    onChange(otp.join(''))
  }, [otp])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Progress track */}
      <div
        style={{
          height: 2,
          background: '#e5e7eb',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 2,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(filled / length) * 100}%`,
            background: error ? '#ef4444' : 'linear-gradient(90deg,#0d9488,#14b8a6)',
            borderRadius: 2,
            transition: 'width .25s ease, background .2s',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {otp.map((digit, i) => {
          const isFocus = focused === i,
            isFill = Boolean(digit)
          return (
            <div key={i} style={{ position: 'relative', flex: 1 }}>
              <input
                ref={(el) => {
                  refs.current[i] = el
                }}
                id={`otp-input-${i}`}
                type="text"
                inputMode="numeric"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onFocus={() => setFocused(i)}
                onBlur={() => setFocused(null)}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  minWidth: 0,
                  maxWidth: 56,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "'DM Mono','Fira Code',monospace",
                  border: '2px solid',
                  borderColor: error
                    ? '#ef4444'
                    : isFocus
                      ? '#0d9488'
                      : isFill
                        ? '#99f6e4'
                        : '#e5e7eb',
                  borderRadius: 12,
                  outline: 'none',
                  background: error ? '#fef2f2' : isFocus || isFill ? '#f0fdfa' : '#fafafa',
                  color: error ? '#ef4444' : '#0f172a',
                  boxShadow: isFocus
                    ? '0 0 0 3px rgba(13,148,136,.15)'
                    : error
                      ? '0 0 0 3px rgba(239,68,68,.1)'
                      : '0 1px 3px rgba(0,0,0,.06)',
                  transition: 'all .18s ease',
                  caretColor: '#0d9488',
                  cursor: 'text',
                }}
              />
              {isFill && !isFocus && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: error ? '#ef4444' : '#0d9488',
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
/* ── OTPField component ──────────────────────────────── */
function OTPField({ label, error, helperText }) {
  const { otp, focused, setFocused, refs, handleChange, handleKeyDown, handlePaste } =
    useOTPState(6)
  const filled = otp.filter(Boolean).length
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 12,
          letterSpacing: '.02em',
          color: error ? '#ef4444' : '#374151',
          fontFamily: 'system-ui,sans-serif',
        }}
      >
        {label}
      </label>

      <div
        style={{
          height: 2,
          background: '#e5e7eb',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(filled / 6) * 100}%`,
            background: error ? '#ef4444' : 'linear-gradient(90deg,#0d9488,#14b8a6)',
            borderRadius: 2,
            transition: 'width .25s',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {otp.map((digit, i) => {
          const isFocus = focused === i,
            isFill = Boolean(digit)
          return (
            <div key={i} style={{ position: 'relative', flex: 1 }}>
              <input
                ref={(el) => {
                  refs.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onFocus={() => setFocused(i)}
                onBlur={() => setFocused(null)}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  minWidth: 0,
                  maxWidth: 52,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "'DM Mono','Fira Code',monospace",
                  border: '2px solid',
                  borderColor: error
                    ? '#ef4444'
                    : isFocus
                      ? '#0d9488'
                      : isFill
                        ? '#99f6e4'
                        : '#e5e7eb',
                  borderRadius: 12,
                  outline: 'none',
                  background: error ? '#fef2f2' : isFocus || isFill ? '#f0fdfa' : '#fafafa',
                  color: error ? '#ef4444' : '#0f172a',
                  boxShadow: isFocus
                    ? '0 0 0 3px rgba(13,148,136,.15)'
                    : error
                      ? '0 0 0 3px rgba(239,68,68,.1)'
                      : '0 1px 3px rgba(0,0,0,.06)',
                  transition: 'all .18s ease',
                  caretColor: '#0d9488',
                }}
              />
              {isFill && !isFocus && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: error ? '#ef4444' : '#0d9488',
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {helperText && (
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: error ? '#ef4444' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: 'system-ui,sans-serif',
          }}
        >
          {error ? '⚠ ' : 'ℹ '}
          {helperText}
        </p>
      )}
    </div>
  )
}
/* ── Preview page ────────────────────────────────────── */
export default function App() {
  const [otpValue, setOtpValue] = useState('')
  const [showError, setShowError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const handleVerify = () => {
    if (otpValue.length < 6) {
      setShowError(true)
      return
    }
    setShowError(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0fdfa 0%,#e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'system-ui,sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              fontSize: 26,
            }}
          >
            🔐
          </div>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}
          >
            Verify your identity
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
            We sent a 6-digit code to your phone. Enter it below to continue.
          </p>

          {/* ── OTPInput demo ── */}
          <div style={{ marginBottom: 28 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                margin: '0 0 10px',
              }}
            >
              OTPInput component
            </p>
            <OTPInput length={6} onChange={setOtpValue} error={showError} />
          </div>

          {/* ── OTPField demo ── */}
          <div style={{ paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                margin: '0 0 10px',
              }}
            >
              OTPField component
            </p>
            <OTPField
              label="Verification Code"
              error={showError}
              helperText={
                showError
                  ? 'Invalid OTP. Please check and try again.'
                  : 'Enter the 6-digit code sent to +91 98765 XXXXX'
              }
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleVerify}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: submitted
                ? 'linear-gradient(135deg,#16a34a,#22c55e)'
                : 'linear-gradient(135deg,#0d9488,#14b8a6)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all .2s ease',
              boxShadow: '0 4px 16px rgba(13,148,136,.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {submitted ? '✓ Verified!' : 'Verify Code'}
          </button>

          {/* Resend */}
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
            Didn't receive it?{' '}
            <span
              style={{ color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => {
                setOtpValue('')
                setShowError(false)
              }}
            >
              Resend code
            </span>
          </p>
        </div>

        {/* Live value display */}
        <div
          style={{
            marginTop: 16,
            background: 'rgba(0,0,0,0.06)',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 12, color: '#64748b' }}>OTP value:</span>
          <span
            style={{
              fontFamily: "'DM Mono','Fira Code',monospace",
              fontSize: 16,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '0.2em',
            }}
          >
            {otpValue || '——————'}
          </span>
        </div>
      </div>
    </div>
  )
}
