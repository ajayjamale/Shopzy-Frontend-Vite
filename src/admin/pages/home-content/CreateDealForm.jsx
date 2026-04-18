import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { createDailyDiscount, getAllDailyDiscounts } from '../../../store/admin/DealSlice'
import { fetchHomePageData } from '../../../store/customer/home/AsyncThunk'
import FormFeedbackToast, {
  getAsyncActionError,
  useFormFeedback,
} from '../../../components/forms/FormFeedbackToast'
import {
  formCardSx,
  formHeaderIconSx,
  formHeaderSx,
  formHeaderTitleSx,
  formPrimaryButtonSx,
  formTextFieldSx,
} from '../../../components/forms/muiFormTheme'

const CreateDealForm = ({ onSuccess }) => {
  const { deal } = useAppSelector((store) => store)
  const dispatch = useAppDispatch()
  const { feedback, closeFeedback, showError, showSuccess } = useFormFeedback()

  const formik = useFormik({
    initialValues: {
      title: '',
      subtitle: '',
      imageUrl: '',
      redirectLink: '/products',
      discountPercent: 20,
      discountLabel: '',
      startDate: '',
      endDate: '',
      displayOrder: 0,
      highlighted: true,
      active: true,
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required('Title is required'),
      imageUrl: Yup.string()
        .trim()
        .url('Enter a valid image URL')
        .required('Image URL is required'),
      redirectLink: Yup.string().trim().required('Redirect link is required'),
      discountPercent: Yup.number()
        .typeError('Enter a valid number')
        .required('Discount is required')
        .min(1, 'Discount must be at least 1%')
        .max(95, 'Discount cannot exceed 95%'),
      startDate: Yup.string().required('Start date is required'),
      endDate: Yup.string().required('End date is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        title: values.title.trim(),
        subtitle: values.subtitle.trim() || undefined,
        imageUrl: values.imageUrl.trim(),
        redirectLink: values.redirectLink.trim(),
        discountLabel: values.discountLabel.trim() || `${values.discountPercent}% OFF`,
      }

      const result = await dispatch(createDailyDiscount(payload))
      if (createDailyDiscount.fulfilled.match(result)) {
        dispatch(getAllDailyDiscounts())
        dispatch(fetchHomePageData())
        resetForm()
        showSuccess('Daily discount created successfully.')
        onSuccess?.()
        return
      }

      showError(getAsyncActionError(result, 'Failed to create daily discount.'))
    },
  })

  return (
    <>
      <Box
        sx={{
          ...formCardSx,
          width: 560,
          maxWidth: '94vw',
        }}
      >
        <Box sx={formHeaderSx}>
          <LocalOfferIcon sx={formHeaderIconSx} />
          <Typography sx={formHeaderTitleSx}>
            Create Daily Discount
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            p: 3,
            display: 'grid',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            sx={formTextFieldSx}
          />

          <TextField
            fullWidth
            id="subtitle"
            name="subtitle"
            label="Subtitle"
            value={formik.values.subtitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={formTextFieldSx}
          />

          <TextField
            fullWidth
            id="imageUrl"
            name="imageUrl"
            label="Image URL"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
            helperText={formik.touched.imageUrl && formik.errors.imageUrl}
            sx={formTextFieldSx}
          />

          <TextField
            fullWidth
            id="redirectLink"
            name="redirectLink"
            label="Redirect Link"
            value={formik.values.redirectLink}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.redirectLink && Boolean(formik.errors.redirectLink)}
            helperText={formik.touched.redirectLink && formik.errors.redirectLink}
            sx={formTextFieldSx}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
              },
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              id="discountPercent"
              name="discountPercent"
              label="Discount %"
              type="number"
              value={formik.values.discountPercent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
              helperText={formik.touched.discountPercent && formik.errors.discountPercent}
              inputProps={{
                min: 1,
                max: 95,
              }}
              sx={formTextFieldSx}
            />
            <TextField
              fullWidth
              id="discountLabel"
              name="discountLabel"
              label="Discount Label (optional)"
              value={formik.values.discountLabel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 30% OFF"
              sx={formTextFieldSx}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr 1fr',
              },
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              id="startDate"
              name="startDate"
              label="Start Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && formik.errors.startDate}
              sx={formTextFieldSx}
            />
            <TextField
              fullWidth
              id="endDate"
              name="endDate"
              label="End Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
              sx={formTextFieldSx}
            />
            <TextField
              fullWidth
              id="displayOrder"
              name="displayOrder"
              label="Display Order"
              type="number"
              value={formik.values.displayOrder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{
                min: 0,
              }}
              sx={formTextFieldSx}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.highlighted}
                  onChange={(e) => formik.setFieldValue('highlighted', e.target.checked)}
                />
              }
              label="Highlighted"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.active}
                  onChange={(e) => formik.setFieldValue('active', e.target.checked)}
                />
              }
              label="Active"
            />
          </Box>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={deal.loading}
            sx={formPrimaryButtonSx}
          >
            {deal.loading ? (
              <CircularProgress
                size={22}
                sx={{
                  color: '#0F172A',
                }}
              />
            ) : (
              'Create Daily Discount'
            )}
          </Button>
        </Box>
      </Box>

      <FormFeedbackToast feedback={feedback} onClose={closeFeedback} />
    </>
  )
}

export default CreateDealForm
