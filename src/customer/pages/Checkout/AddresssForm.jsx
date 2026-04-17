import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
const schema = Yup.object().shape({
  name: Yup.string().min(2, 'Name is too short').required('Required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Use a valid 10-digit mobile')
    .required('Required'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Use a valid 6-digit PIN')
    .required('Required'),
  address: Yup.string().min(5, 'Enter full address').required('Required'),
  locality: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
})
const Field = ({ label, name, formik, type = 'text' }) => {
  const hasError = Boolean(formik.touched[name] && formik.errors[name])
  return (
    <label className="grid gap-1">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="input-shell"
        style={{ borderColor: hasError ? '#e11d48' : '#D7E3E8' }}
      />
      {hasError && <span className="text-xs text-rose-700">{formik.errors[name]}</span>}
    </label>
  )
}
const AddressForm = ({ handleClose, onAddressSaved }) => {
  const [saving, setSaving] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      pinCode: '',
      address: '',
      locality: '',
      city: '',
      state: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (saving) return
      setSaving(true)
      try {
        await onAddressSaved?.(values)
      } finally {
        setSaving(false)
      }
    },
  })
  return (
    <div className="surface p-5" style={{ width: 'min(560px, 94vw)', borderRadius: 18 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-kicker mb-1">Delivery Address</p>
          <h3 style={{ fontSize: '1.25rem' }}>Add new address</h3>
        </div>
        <button className="btn-secondary" onClick={handleClose}>
          Close
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Full Name" name="name" formik={formik} />
          <Field label="Mobile" name="mobile" formik={formik} type="tel" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="PIN Code" name="pinCode" formik={formik} />
          <Field label="Locality" name="locality" formik={formik} />
        </div>

        <Field label="Address Line" name="address" formik={formik} />

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="City" name="city" formik={formik} />
          <Field label="State" name="state" formik={formik} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!formik.isValid || formik.isSubmitting || saving}
          >
            {saving ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default AddressForm
