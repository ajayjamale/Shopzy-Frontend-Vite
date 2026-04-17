import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { sendLoginSignupOtp, signin } from '../../../store/customer/AuthSlice'
import OTPInput from '../../components/OtpFild/OTPInput'
import './Auth.css'
const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
})
const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.auth.loading)
  const otpSent = useAppSelector((state) => state.auth.otpSent)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: schema,
    onSubmit: () => undefined,
  })
  const sendOtp = async () => {
    const errors = await formik.validateForm()
    formik.setTouched({ email: true })
    if (errors.email) return
    await dispatch(sendLoginSignupOtp({ email: formik.values.email }))
    setTimer(30)
    setTimerActive(true)
  }
  const verifyOtp = () => {
    if (otp.length !== 6) return
    dispatch(signin({ email: formik.values.email, otp, navigate }))
  }
  useEffect(() => {
    if (!timerActive) return
    if (timer === 0) {
      setTimerActive(false)
      return
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, timerActive])
  return (
    <div className="grid gap-4">
      <div className="auth-field">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="auth-input"
          placeholder="you@example.com"
          disabled={otpSent}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="auth-error">{formik.errors.email}</span>
        )}
      </div>

      {otpSent && (
        <div className="auth-otp">
          <p>
            Enter the 6-digit OTP sent to <strong>{formik.values.email}</strong>
          </p>
          <OTPInput length={6} onChange={setOtp} error={false} />
          <p>
            {timerActive ? (
              <>Resend in {timer}s</>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                style={{ height: 32 }}
                onClick={sendOtp}
              >
                Resend OTP
              </button>
            )}
          </p>
        </div>
      )}

      {!otpSent ? (
        <button type="button" className="btn-primary w-full" onClick={sendOtp} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary w-full"
          onClick={verifyOtp}
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Sign in'}
        </button>
      )}
    </div>
  )
}
export default LoginForm
