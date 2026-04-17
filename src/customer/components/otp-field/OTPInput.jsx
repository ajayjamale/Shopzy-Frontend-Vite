import { useState, useEffect, useRef } from 'react'
const OTPInput = ({ length, onChange, error = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const [focused, setFocused] = useState(null)
  const inputRefs = useRef([])
  useEffect(() => {
    onChange(otp.join(''))
  }, [otp])
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputRefs.current[index + 1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, length)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char
    })
    setOtp(newOtp)
    const nextEmpty = newOtp.findIndex((v) => !v)
    const focusIdx = nextEmpty === -1 ? length - 1 : nextEmpty
    inputRefs.current[focusIdx]?.focus()
  }
  const filledCount = otp.filter(Boolean).length
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Progress track */}
      <div
        style={{
          height: 2,
          background: '#e5e7eb',
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(filledCount / length) * 100}%`,
            background: error ? '#ef4444' : 'linear-gradient(90deg, #0d9488, #14b8a6)',
            borderRadius: 2,
            transition: 'width 0.25s ease, background 0.2s ease',
          }}
        />
      </div>

      {/* Boxes */}
      <div
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        {otp.map((digit, index) => {
          const isFocused = focused === index
          const isFilled = Boolean(digit)
          const isError = error
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                flex: 1,
              }}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  minWidth: 0,
                  maxWidth: 56,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "'DM Mono', 'Fira Code', monospace",
                  border: '2px solid',
                  borderColor: isError
                    ? '#ef4444'
                    : isFocused
                      ? '#0d9488'
                      : isFilled
                        ? '#99f6e4'
                        : '#e5e7eb',
                  borderRadius: 12,
                  outline: 'none',
                  background: isError
                    ? '#fef2f2'
                    : isFocused
                      ? '#f0fdfa'
                      : isFilled
                        ? '#f0fdfa'
                        : '#fafafa',
                  color: isError ? '#ef4444' : '#0f172a',
                  boxShadow: isFocused
                    ? '0 0 0 3px rgba(13,148,136,0.15)'
                    : isError
                      ? '0 0 0 3px rgba(239,68,68,0.1)'
                      : '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.18s ease',
                  cursor: 'text',
                  caretColor: '#0d9488',
                }}
              />
              {/* Filled dot indicator */}
              {isFilled && !isFocused && (
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
export default OTPInput
export const OTPField = ({ label, error, helperText }) => {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [focused, setFocused] = useState(null)
  const inputRefs = useRef([])
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char
    })
    setOtp(newOtp)
  }
  const filledCount = otp.filter(Boolean).length
  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      {/* Label */}
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: error ? '#ef4444' : '#374151',
          marginBottom: 12,
          letterSpacing: '0.02em',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {label}
      </label>

      {/* Progress bar */}
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
            width: `${(filledCount / 6) * 100}%`,
            background: error ? '#ef4444' : 'linear-gradient(90deg, #0d9488, #14b8a6)',
            borderRadius: 2,
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* OTP boxes */}
      <div
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        {otp.map((digit, index) => {
          const isFocused = focused === index
          const isFilled = Boolean(digit)
          return (
            <div
              key={index}
              style={{
                position: 'relative',
                flex: 1,
              }}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  minWidth: 0,
                  maxWidth: 52,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "'DM Mono', 'Fira Code', monospace",
                  border: '2px solid',
                  borderColor: error
                    ? '#ef4444'
                    : isFocused
                      ? '#0d9488'
                      : isFilled
                        ? '#99f6e4'
                        : '#e5e7eb',
                  borderRadius: 12,
                  outline: 'none',
                  background: error
                    ? '#fef2f2'
                    : isFocused
                      ? '#f0fdfa'
                      : isFilled
                        ? '#f0fdfa'
                        : '#fafafa',
                  color: error ? '#ef4444' : '#0f172a',
                  boxShadow: isFocused
                    ? '0 0 0 3px rgba(13,148,136,0.15)'
                    : error
                      ? '0 0 0 3px rgba(239,68,68,0.1)'
                      : '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.18s ease',
                  caretColor: '#0d9488',
                }}
              />
              {isFilled && !isFocused && (
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

      {/* Helper / error text */}
      {helperText && (
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: error ? '#ef4444' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {error ? '⚠ ' : 'ℹ '}
          {helperText}
        </p>
      )}
    </div>
  )
}
