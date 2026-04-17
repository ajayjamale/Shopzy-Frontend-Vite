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

const BankDetailsForm = ({ onClose }) => {
  const { sellers } = useAppSelector((s) => s)
  const dispatch = useAppDispatch()
  const { feedback, showError, closeFeedback } = useFormFeedback()
  const formik = useFormik({
    initialValues: {
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
    },
    validationSchema: Yup.object({
      accountHolderName: Yup.string().required('Account holder name is required'),
      accountNumber: Yup.string().required('Account number is required'),
      ifscCode: Yup.string().required('IFSC code is required'),
    }),
    onSubmit: async (values) => {
      const action = await dispatch(
        updateSeller({
          bankDetails: values,
        }),
      )
      if (updateSeller.fulfilled.match(action)) {
        onClose?.()
        return
      }

      showError(getAsyncActionError(action, 'Failed to update bank details.'))
    },
  })
  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        accountHolderName: sellers.profile.bankDetails?.accountHolderName ?? '',
        accountNumber: sellers.profile.bankDetails?.accountNumber ?? '',
        ifscCode: sellers.profile.bankDetails?.ifscCode ?? '',
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
          id="accountHolderName"
          name="accountHolderName"
          label="Account Holder Name"
          value={formik.values.accountHolderName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.accountHolderName && Boolean(formik.errors.accountHolderName)}
          helperText={formik.touched.accountHolderName && formik.errors.accountHolderName}
        />
        <Field
          id="accountNumber"
          name="accountNumber"
          label="Account Number"
          value={formik.values.accountNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
          helperText={formik.touched.accountNumber && formik.errors.accountNumber}
        />
        <Field
          id="ifscCode"
          name="ifscCode"
          label="IFSC Code"
          value={formik.values.ifscCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)}
          helperText={formik.touched.ifscCode && formik.errors.ifscCode}
        />
        <SaveButton />
      </form>

      <FormFeedbackToast feedback={feedback} onClose={closeFeedback} />
    </>
  )
}
export default BankDetailsForm
