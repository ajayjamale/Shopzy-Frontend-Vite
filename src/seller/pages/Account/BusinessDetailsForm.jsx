import { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Field, SaveButton } from './FormPrimitives'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { updateSeller } from '../../../store/seller/sellerSlice'
import FormFeedbackToast, {
  getAsyncActionError,
  useFormFeedback,
} from '../../../components/forms/FormFeedbackToast'

const BusinessDetailsForm = ({ onClose }) => {
  const { sellers } = useAppSelector((s) => s)
  const dispatch = useAppDispatch()
  const { feedback, showError, closeFeedback } = useFormFeedback()
  const formik = useFormik({
    initialValues: {
      businessName: '',
      gstin: '',
      accountStatus: '',
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required('Business name is required'),
      gstin: Yup.string().required('GSTIN is required'),
      accountStatus: Yup.string().required('Account status is required'),
    }),
    onSubmit: async (values) => {
      const action = await dispatch(
        updateSeller({
          ...values,
          businessDetails: {
            businessName: values.businessName,
          },
        }),
      )
      if (updateSeller.fulfilled.match(action)) {
        onClose?.()
        return
      }

      showError(getAsyncActionError(action, 'Failed to update business details.'))
    },
  })
  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        businessName: sellers.profile.businessDetails?.businessName ?? '',
        gstin: sellers.profile.gstin ?? '',
        accountStatus: sellers.profile.accountStatus ?? '',
      })
    }
  }, [sellers.profile])
  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <Field
          id="businessName"
          name="businessName"
          label="Business Name"
          value={formik.values.businessName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.businessName && Boolean(formik.errors.businessName)}
          helperText={formik.touched.businessName && formik.errors.businessName}
        />
        <Field
          id="gstin"
          name="gstin"
          label="GSTIN"
          value={formik.values.gstin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gstin && Boolean(formik.errors.gstin)}
          helperText={formik.touched.gstin && formik.errors.gstin}
        />
        <Field
          id="accountStatus"
          name="accountStatus"
          label="Account Status"
          value={formik.values.accountStatus}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.accountStatus && Boolean(formik.errors.accountStatus)}
          helperText={formik.touched.accountStatus && formik.errors.accountStatus}
        />
        <SaveButton />
      </form>

      <FormFeedbackToast feedback={feedback} onClose={closeFeedback} />
    </>
  )
}
export default BusinessDetailsForm
