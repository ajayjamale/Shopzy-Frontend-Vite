import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Field, SaveButton } from './FormPrimitives'
import { useAppDispatch, useAppSelector } from '../../../store'
import { updateSeller } from '../../../store/seller/sellerSlice'
const PickupAddressForm = ({ onClose }) => {
  const { sellers } = useAppSelector((s) => s)
  const dispatch = useAppDispatch()
  const formik = useFormik({
    initialValues: { address: '', city: '', state: '', mobile: '' },
    validationSchema: Yup.object({
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      mobile: Yup.string().required('Mobile is required'),
    }),
    onSubmit: (values) => {
      dispatch(updateSeller({ pickupAddress: values }))
      onClose()
    },
  })
  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        address: sellers.profile.pickupAddress?.address ?? '',
        city: sellers.profile.pickupAddress?.city ?? '',
        state: sellers.profile.pickupAddress?.state ?? '',
        mobile: sellers.profile.pickupAddress?.mobile ?? '',
      })
    }
  }, [sellers.profile])
  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <Field
        id="address"
        name="address"
        label="Address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.address && Boolean(formik.errors.address)}
        helperText={formik.touched.address && formik.errors.address}
      />
      <Field
        id="city"
        name="city"
        label="City"
        value={formik.values.city}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.city && Boolean(formik.errors.city)}
        helperText={formik.touched.city && formik.errors.city}
      />
      <Field
        id="state"
        name="state"
        label="State"
        value={formik.values.state}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.state && Boolean(formik.errors.state)}
        helperText={formik.touched.state && formik.errors.state}
      />
      <Field
        id="mobile"
        name="mobile"
        label="Mobile"
        value={formik.values.mobile}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile && formik.errors.mobile}
      />
      <SaveButton />
    </form>
  )
}
export default PickupAddressForm
