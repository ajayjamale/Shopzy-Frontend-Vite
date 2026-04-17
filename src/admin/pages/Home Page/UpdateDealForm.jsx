import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { getAllDailyDiscounts, updateDailyDiscount } from '../../../store/admin/DealSlice'
import { fetchHomePageData } from '../../../store/customer/home/AsyncThunk'
const modernTextField = {
  '& label.Mui-focused': { color: '#1E293B' },
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
    '&:hover fieldset': { borderColor: '#0F766E' },
    '&.Mui-focused fieldset': { borderColor: '#0F766E', borderWidth: 2 },
  },
  '& label': { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 13 },
  '& .MuiFormHelperText-root': { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 11 },
}
const UpdateDealForm = ({ id, onSuccess }) => {
  const { deal } = useAppSelector((store) => store)
  const dispatch = useAppDispatch()
  const current = deal.discounts.find((item) => item.id === id)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: current?.title || '',
      subtitle: current?.subtitle || '',
      imageUrl: current?.imageUrl || '',
      redirectLink: current?.redirectLink || '/products',
      discountPercent: current?.discountPercent || 10,
      discountLabel: current?.discountLabel || '',
      startDate: current?.startDate || '',
      endDate: current?.endDate || '',
      displayOrder: current?.displayOrder || 0,
      highlighted: current?.highlighted ?? false,
      active: current?.active ?? true,
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
    onSubmit: async (values) => {
      const payload = {
        ...values,
        title: values.title.trim(),
        subtitle: values.subtitle.trim() || undefined,
        imageUrl: values.imageUrl.trim(),
        redirectLink: values.redirectLink.trim(),
        discountLabel: values.discountLabel.trim() || `${values.discountPercent}% OFF`,
      }
      const result = await dispatch(updateDailyDiscount({ id, payload }))
      if (updateDailyDiscount.fulfilled.match(result)) {
        dispatch(getAllDailyDiscounts())
        dispatch(fetchHomePageData())
        onSuccess?.()
      }
    },
  })
  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'grid', gap: 2 }}>
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
        sx={modernTextField}
      />

      <TextField
        fullWidth
        id="subtitle"
        name="subtitle"
        label="Subtitle"
        value={formik.values.subtitle}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        sx={modernTextField}
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
        sx={modernTextField}
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
        sx={modernTextField}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
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
          inputProps={{ min: 1, max: 95 }}
          sx={modernTextField}
        />
        <TextField
          fullWidth
          id="discountLabel"
          name="discountLabel"
          label="Discount Label"
          value={formik.values.discountLabel}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={modernTextField}
        />
      </Box>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}
      >
        <TextField
          fullWidth
          id="startDate"
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.startDate && Boolean(formik.errors.startDate)}
          helperText={formik.touched.startDate && formik.errors.startDate}
          sx={modernTextField}
        />
        <TextField
          fullWidth
          id="endDate"
          name="endDate"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formik.values.endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.endDate && Boolean(formik.errors.endDate)}
          helperText={formik.touched.endDate && formik.errors.endDate}
          sx={modernTextField}
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
          inputProps={{ min: 0 }}
          sx={modernTextField}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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

      <Typography
        sx={{ fontSize: 12, color: '#64748B', fontFamily: '"Manrope", Arial, sans-serif' }}
      >
        Updating this discount will refresh the homepage daily discount section immediately.
      </Typography>

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={deal.loading}
        sx={{
          backgroundColor: '#0F766E',
          color: '#0F172A',
          fontFamily: '"Manrope", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 14,
          textTransform: 'none',
          borderRadius: '20px',
          py: 1.2,
          border: '1px solid #0b5f59',
          '&:hover': { backgroundColor: '#0b5f59' },
          '&.Mui-disabled': { backgroundColor: '#d1e4e2', color: '#64748B' },
        }}
      >
        {deal.loading ? (
          <CircularProgress size={22} sx={{ color: '#0F172A' }} />
        ) : (
          'Update Discount'
        )}
      </Button>
    </Box>
  )
}
export default UpdateDealForm
