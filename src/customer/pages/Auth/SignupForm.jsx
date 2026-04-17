import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { sendLoginSignupOtp, signup } from '../../../store/customer/AuthSlice'
import OTPInput from '../../components/otp-field/OTPInput'
import FormFeedbackToast, {
  getAsyncActionError,
  useFormFeedback,
} from '../../../components/forms/FormFeedbackToast'
import './Auth.css'
const schema = Yup.object({
  fullName: Yup.string().min(2, 'Minimum 2 characters').required('Required'),
  email: Yup.string().email('Enter a valid email').required('Required'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number')
    .required('Required'),
})
const SignupForm = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.auth.loading)
  const otpSent = useAppSelector((state) => state.auth.otpSent)
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const { feedback, showSuccess, showError, closeFeedback } = useFormFeedback()
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
    },
    validationSchema: schema,
    onSubmit: () => undefined,
  })
  const sendOtp = async () => {
    const errors = await formik.validateForm()
    formik.setTouched({ fullName: true, email: true, phoneNumber: true })
    if (Object.keys(errors).length) {
      showError('Please fill all required fields correctly.')
      return
    }

    const action = await dispatch(sendLoginSignupOtp({ email: formik.values.email }))
    if (sendLoginSignupOtp.fulfilled.match(action)) {
      showSuccess(otpSent ? 'OTP resent successfully.' : 'OTP sent successfully.')
      setTimer(30)
      setTimerActive(true)
      return
    }

    showError(getAsyncActionError(action, 'Failed to send OTP. Please try again.'))
  }
  const verifyAndSignup = async () => {
    if (otp.length !== 6) {
      showError('Please enter the 6-digit OTP.')
      return
    }

    const action = await dispatch(
      signup({
        fullName: formik.values.fullName,
        email: formik.values.email,
        mobile: formik.values.phoneNumber,
        otp,
        navigate,
      }),
    )
    if (signup.rejected.match(action)) {
      showError(getAsyncActionError(action, 'Signup failed. Please try again.'))
    }
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
    <>
      <div className="grid gap-4">
        {[
          ['Full Name', 'fullName', 'text', 'Alex Johnson'],
          ['Mobile', 'phoneNumber', 'tel', '9876543210'],
          ['Email', 'email', 'email', 'you@example.com'],
        ].map(([label, key, type, placeholder]) => (
          <div className="auth-field" key={key}>
            <label>{label}</label>
            <input
              type={type}
              name={key}
              value={formik.values[key]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="auth-input"
              placeholder={placeholder}
              disabled={otpSent}
            />
            {formik.touched[key] && formik.errors[key] && (
              <span className="auth-error">{formik.errors[key]}</span>
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
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary w-full"
            onClick={verifyAndSignup}
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        )}
      </div>

      <FormFeedbackToast feedback={feedback} onClose={closeFeedback} />
    </>
  )
}
export default SignupForm
