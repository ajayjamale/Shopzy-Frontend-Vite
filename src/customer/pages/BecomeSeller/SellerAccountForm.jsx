import { getIn, setIn, useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { createSeller } from '../../../store/seller/sellerAuthenticationSlice'

const C = {
  text: '#0E1B2C',
  muted: '#65798A',
  border: '#CFE0E5',
  borderFocus: '#0F766E',
  focusRing: 'rgba(15,118,110,0.18)',
  teal: '#0F766E',
  tealDark: '#0C5E58',
  error: '#B42318',
  errorBg: '#FEF0EE',
  softBg: '#F6FAFC',
  divider: '#DDE9ED',
}

const STEPS = [
  {
    title: 'Contact and tax',
    subtitle: 'Primary contact details used for account verification.',
  },
  {
    title: 'Pickup address',
    subtitle: 'Where your products will be picked for shipping.',
  },
  {
    title: 'Bank details',
    subtitle: 'Used for seller payouts and settlement processing.',
  },
  {
    title: 'Business login',
    subtitle: 'Store profile and credentials for Seller Central.',
  },
]

const STEP_FIELD_PATHS = [
  ['mobile', 'gstin'],
  [
    'pickupAddress.name',
    'pickupAddress.mobile',
    'pickupAddress.pincode',
    'pickupAddress.address',
    'pickupAddress.locality',
    'pickupAddress.city',
    'pickupAddress.state',
  ],
  [
    'bankDetails.accountHolderName',
    'bankDetails.accountNumber',
    'bankDetails.confirmAccount',
    'bankDetails.ifscCode',
  ],
  ['businessDetails.businessName', 'sellerName', 'email', 'password', 'confirmPassword'],
]

const validationSchema = Yup.object({
  mobile: Yup.string()
    .trim()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number.')
    .required('Mobile number is required.'),
  gstin: Yup.string()
    .trim()
    .matches(/^[0-9A-Z]{15}$/i, 'Enter a valid 15-character GSTIN.')
    .required('GSTIN is required.'),
  pickupAddress: Yup.object({
    name: Yup.string().trim().required('Contact name is required.'),
    mobile: Yup.string()
      .trim()
      .matches(/^\d{10}$/, 'Pickup mobile must be a valid 10-digit number.')
      .required('Pickup mobile is required.'),
    pincode: Yup.string().trim().matches(/^\d{6}$/, 'Pincode must be 6 digits.').required(),
    address: Yup.string().trim().required('Address line is required.'),
    locality: Yup.string().trim().required('Locality is required.'),
    city: Yup.string().trim().required('City is required.'),
    state: Yup.string().trim().required('State is required.'),
  }),
  bankDetails: Yup.object({
    accountHolderName: Yup.string().trim().required('Account holder name is required.'),
    accountNumber: Yup.string().trim().required('Account number is required.'),
    confirmAccount: Yup.string()
      .trim()
      .required('Please confirm account number.')
      .oneOf([Yup.ref('accountNumber')], 'Account numbers do not match.'),
    ifscCode: Yup.string()
      .trim()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/i, 'Enter a valid IFSC code.')
      .required('IFSC code is required.'),
  }),
  sellerName: Yup.string().trim().required('Seller display name is required.'),
  email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string().min(8, 'Password must be at least 8 characters.').required(),
  confirmPassword: Yup.string()
    .required('Please confirm password.')
    .oneOf([Yup.ref('password')], 'Password and confirm password do not match.'),
  businessDetails: Yup.object({
    businessName: Yup.string().trim().required('Business name is required.'),
  }),
  otp: Yup.string().nullable(),
})

const inputBaseStyle = {
  width: '100%',
  minHeight: 44,
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  background: '#fff',
  outline: 'none',
  color: C.text,
  fontSize: 14,
  padding: '0 12px',
  transition: 'border-color .16s, box-shadow .16s',
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

function Field({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  type = 'text',
  error,
  helper,
}) {
  const hasError = Boolean(error)

  return (
    <div style={{ display: 'grid', gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
        {label}
        {required ? <span style={{ color: C.error, marginLeft: 2 }}>*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={(event) => {
          onBlur?.(event)
          event.currentTarget.style.borderColor = hasError ? C.error : C.border
          event.currentTarget.style.boxShadow = hasError ? '0 0 0 3px rgba(180,35,24,0.14)' : 'none'
        }}
        placeholder={placeholder}
        style={{
          ...inputBaseStyle,
          borderColor: hasError ? C.error : C.border,
          boxShadow: hasError ? '0 0 0 3px rgba(180,35,24,0.14)' : 'none',
        }}
        onFocus={(event) => {
          if (!hasError) {
            event.currentTarget.style.borderColor = C.borderFocus
            event.currentTarget.style.boxShadow = `0 0 0 3px ${C.focusRing}`
          }
        }}
      />
      {hasError ? <span style={{ color: C.error, fontSize: 12 }}>{error}</span> : null}
      {!hasError && helper ? <span style={{ color: C.muted, fontSize: 12 }}>{helper}</span> : null}
    </div>
  )
}

const SellerAccountForm = () => {
  const dispatch = useAppDispatch()
  const sellerAuth = useAppSelector((state) => state.sellerAuth)
  const [activeStep, setActiveStep] = useState(0)
  const [stepError, setStepError] = useState('')

  const formik = useFormik({
    initialValues: {
      mobile: '',
      gstin: '',
      pickupAddress: {
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        locality: '',
        city: '',
        state: '',
      },
      bankDetails: {
        accountNumber: '',
        confirmAccount: '',
        ifscCode: '',
        accountHolderName: '',
      },
      sellerName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessDetails: {
        businessName: '',
      },
      otp: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const payload = {
        mobile: values.mobile.trim(),
        gstin: values.gstin.trim().toUpperCase(),
        pickupAddress: {
          name: values.pickupAddress.name.trim(),
          mobile: values.pickupAddress.mobile.trim(),
          pincode: values.pickupAddress.pincode.trim(),
          address: values.pickupAddress.address.trim(),
          locality: values.pickupAddress.locality.trim(),
          city: values.pickupAddress.city.trim(),
          state: values.pickupAddress.state.trim(),
        },
        bankDetails: {
          accountNumber: values.bankDetails.accountNumber.trim(),
          ifscCode: values.bankDetails.ifscCode.trim().toUpperCase(),
          accountHolderName: values.bankDetails.accountHolderName.trim(),
        },
        sellerName: values.sellerName.trim(),
        email: values.email.trim().toLowerCase(),
        businessDetails: {
          businessName: values.businessDetails.businessName.trim(),
        },
        password: values.password,
        accountStatus: 'PENDING_VERIFICATION',
        otp: values.otp || '',
      }

      const action = await dispatch(createSeller(payload))
      if (createSeller.rejected.match(action)) {
        setStepError(action.payload || action.error?.message || 'Failed to create seller account.')
      }
    },
  })

  const getFieldError = (path) => {
    const touched = getIn(formik.touched, path)
    const error = getIn(formik.errors, path)
    return touched && typeof error === 'string' ? error : ''
  }

  const validateStep = async (step) => {
    const fields = STEP_FIELD_PATHS[step] || []
    const errors = await formik.validateForm()

    let touchedState = formik.touched
    fields.forEach((path) => {
      touchedState = setIn(touchedState, path, true)
    })
    formik.setTouched(touchedState, false)

    for (const path of fields) {
      const message = getIn(errors, path)
      if (typeof message === 'string' && message.trim()) {
        return message
      }
    }

    return ''
  }

  const continueFlow = async () => {
    setStepError('')
    const errorMessage = await validateStep(activeStep)

    if (errorMessage) {
      setStepError(errorMessage)
      return
    }

    if (activeStep < STEPS.length - 1) {
      setActiveStep((current) => current + 1)
      return
    }

    formik.submitForm()
  }

  const stepCardHeader = (
    <header
      style={{
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        background: C.softBg,
        padding: '13px 14px',
        display: 'grid',
        gap: 4,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 17, color: C.text }}>{STEPS[activeStep].title}</h3>
      <p style={{ margin: 0, fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>
        {STEPS[activeStep].subtitle}
      </p>
    </header>
  )

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <style>{`
        @keyframes seller-spin { to { transform: rotate(360deg); } }
        @media (max-width: 760px) {
          .seller-reg-grid-2,
          .seller-reg-grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        style={{
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: '10px 10px 12px',
          background: C.softBg,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8 }}>
          {STEPS.map((step, index) => {
            const done = index < activeStep
            const active = index === activeStep
            return (
              <div key={step.title} style={{ textAlign: 'center', display: 'grid', gap: 6 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    margin: '0 auto',
                    border: `1px solid ${done || active ? C.teal : C.border}`,
                    background: done || active ? C.teal : '#fff',
                    color: done || active ? '#fff' : C.muted,
                    fontSize: 12,
                    fontWeight: 800,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {index + 1}
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    color: active ? C.text : C.muted,
                    fontWeight: active ? 700 : 600,
                  }}
                >
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {stepCardHeader}

      {activeStep === 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Field
            label="Mobile number"
            required
            name="mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="10-digit mobile number"
            error={getFieldError('mobile')}
            helper="This number is used for account notifications."
          />
          <Field
            label="GSTIN"
            required
            name="gstin"
            value={formik.values.gstin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="15-character GSTIN"
            error={getFieldError('gstin')}
            helper="Example: 22AAAAA0000A1Z5"
          />
        </div>
      )}

      {activeStep === 1 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div
            className="seller-reg-grid-2"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <Field
              label="Contact name"
              required
              name="pickupAddress.name"
              value={formik.values.pickupAddress.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('pickupAddress.name')}
            />
            <Field
              label="Pickup mobile"
              required
              name="pickupAddress.mobile"
              value={formik.values.pickupAddress.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('pickupAddress.mobile')}
            />
          </div>
          <Field
            label="Address line"
            required
            name="pickupAddress.address"
            value={formik.values.pickupAddress.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="House no, building, street"
            error={getFieldError('pickupAddress.address')}
          />
          <Field
            label="Locality"
            required
            name="pickupAddress.locality"
            value={formik.values.pickupAddress.locality}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={getFieldError('pickupAddress.locality')}
          />
          <div
            className="seller-reg-grid-3"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}
          >
            <Field
              label="Pincode"
              required
              name="pickupAddress.pincode"
              value={formik.values.pickupAddress.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('pickupAddress.pincode')}
            />
            <Field
              label="City"
              required
              name="pickupAddress.city"
              value={formik.values.pickupAddress.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('pickupAddress.city')}
            />
            <Field
              label="State"
              required
              name="pickupAddress.state"
              value={formik.values.pickupAddress.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('pickupAddress.state')}
            />
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <Field
            label="Account holder name"
            required
            name="bankDetails.accountHolderName"
            value={formik.values.bankDetails.accountHolderName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={getFieldError('bankDetails.accountHolderName')}
          />
          <div
            className="seller-reg-grid-2"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <Field
              label="Account number"
              required
              name="bankDetails.accountNumber"
              value={formik.values.bankDetails.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('bankDetails.accountNumber')}
            />
            <Field
              label="Confirm account number"
              required
              name="bankDetails.confirmAccount"
              value={formik.values.bankDetails.confirmAccount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('bankDetails.confirmAccount')}
            />
          </div>
          <Field
            label="IFSC code"
            required
            name="bankDetails.ifscCode"
            value={formik.values.bankDetails.ifscCode}
            onChange={(event) =>
              formik.setFieldValue('bankDetails.ifscCode', event.target.value.toUpperCase())
            }
            onBlur={formik.handleBlur}
            placeholder="Example: HDFC0001234"
            error={getFieldError('bankDetails.ifscCode')}
          />
        </div>
      )}

      {activeStep === 3 && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div
            className="seller-reg-grid-2"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <Field
              label="Business name"
              required
              name="businessDetails.businessName"
              value={formik.values.businessDetails.businessName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('businessDetails.businessName')}
            />
            <Field
              label="Seller display name"
              required
              name="sellerName"
              value={formik.values.sellerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('sellerName')}
            />
          </div>

          <Field
            label="Business email"
            required
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="business@example.com"
            error={getFieldError('email')}
          />

          <div
            className="seller-reg-grid-2"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <Field
              label="Password"
              required
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('password')}
              helper="Minimum 8 characters."
            />
            <Field
              label="Confirm password"
              required
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={getFieldError('confirmPassword')}
            />
          </div>
        </div>
      )}

      {(stepError || sellerAuth.error) && (
        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${C.error}40`,
            background: C.errorBg,
            color: C.error,
            padding: '9px 10px',
            fontSize: 12.5,
            lineHeight: 1.45,
          }}
        >
          {stepError || sellerAuth.error}
        </div>
      )}

      <div
        style={{
          marginTop: 2,
          paddingTop: 12,
          borderTop: `1px solid ${C.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (activeStep === 0) return
            setStepError('')
            setActiveStep((current) => current - 1)
          }}
          disabled={activeStep === 0 || sellerAuth.loading}
          style={{
            minHeight: 42,
            borderRadius: 11,
            border: `1px solid ${C.border}`,
            background: '#fff',
            color: C.text,
            fontSize: 13,
            fontWeight: 700,
            padding: '0 14px',
            cursor: activeStep === 0 || sellerAuth.loading ? 'not-allowed' : 'pointer',
            opacity: activeStep === 0 || sellerAuth.loading ? 0.55 : 1,
          }}
        >
          Back
        </button>

        <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 700 }}>
          Step {activeStep + 1} / {STEPS.length}
        </span>

        <button
          type="button"
          onClick={continueFlow}
          disabled={sellerAuth.loading}
          style={{
            minHeight: 42,
            borderRadius: 11,
            border: `1px solid ${C.tealDark}`,
            background: `linear-gradient(135deg, ${C.tealDark}, ${C.teal})`,
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            padding: '0 16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: sellerAuth.loading ? 'not-allowed' : 'pointer',
            opacity: sellerAuth.loading ? 0.65 : 1,
          }}
        >
          {sellerAuth.loading ? <Spinner /> : null}
          {activeStep === STEPS.length - 1 ? 'Create seller account' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default SellerAccountForm
