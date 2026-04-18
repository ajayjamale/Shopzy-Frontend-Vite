import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Typography,
  InputAdornment,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { createCoupon } from '../../../store/admin/AdminCouponSlice'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PercentIcon from '@mui/icons-material/Percent'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import {
  formCardSx,
  formHeaderIconSx,
  formHeaderSx,
  formHeaderTitleSx,
  formPrimaryButtonSx,
  formSectionNoteSx,
  formSectionNoteTextSx,
  formTextFieldSx,
} from '../../../components/forms/muiFormTheme'
import FormFeedbackToast from '../../../components/forms/FormFeedbackToast'
const CreateCouponForm = () => {
  const dispatch = useAppDispatch()
  // ✅ CORRECT key: matches store registration `adminCoupon: AdminCouponSlice`
  const { adminCoupon } = useAppSelector((store) => store)
  const [snackbarOpen, setOpenSnackbar] = useState(false)
  const formik = useFormik({
    initialValues: {
      code: '',
      discountPercentage: 0,
      validityStartDate: null,
      validityEndDate: null,
      minimumOrderValue: 0,
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .required('Coupon code is required')
        .min(3, 'Code should be at least 3 characters')
        .max(20, 'Code should be at most 20 characters'),
      discountPercentage: Yup.number()
        .required('Discount percentage is required')
        .min(1, 'Discount should be at least 1%')
        .max(100, 'Discount cannot exceed 100%'),
      validityStartDate: Yup.date()
        .nullable()
        .required('Start date is required')
        .typeError('Invalid date'),
      validityEndDate: Yup.date()
        .nullable()
        .required('End date is required')
        .typeError('Invalid date')
        .min(Yup.ref('validityStartDate'), 'End date cannot be before start date'),
      minimumOrderValue: Yup.number()
        .required('Minimum order value is required')
        .min(1, 'Minimum order value should be at least 1'),
    }),
    onSubmit: (values, { resetForm }) => {
      const formattedValues = {
        ...values,
        validityStartDate: values.validityStartDate ? values.validityStartDate.toISOString() : null,
        validityEndDate: values.validityEndDate ? values.validityEndDate.toISOString() : null,
      }
      dispatch(
        createCoupon({
          coupon: formattedValues,
          jwt: localStorage.getItem('jwt') || '',
        }),
      ).then((result) => {
        // ✅ Only reset form on actual success
        if (createCoupon.fulfilled.match(result)) {
          resetForm()
        }
      })
    },
  })
  const handleCloseSnackbar = () => setOpenSnackbar(false)
  useEffect(() => {
    // ✅ Show snackbar for both success and error
    if (adminCoupon.couponCreated || adminCoupon.error) {
      setOpenSnackbar(true)
    }
  }, [adminCoupon.couponCreated, adminCoupon.error])
  return (
    <Box sx={formCardSx}>
      {/* Header */}
      <Box sx={formHeaderSx}>
        <LocalOfferIcon sx={formHeaderIconSx} />
        <Typography sx={formHeaderTitleSx}>
          Create New Coupon
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Coupon Code */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  id="code"
                  name="code"
                  label="Coupon Code"
                  placeholder="e.g. SUMMER25"
                  value={formik.values.code}
                  // ✅ FIX: use only setFieldValue — avoid double-update race condition
                  onChange={(e) => formik.setFieldValue('code', e.target.value.toUpperCase())}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && Boolean(formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferIcon
                          sx={{
                            fontSize: 16,
                            color: '#64748B',
                          }}
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      fontFamily: '"Courier New", monospace',
                      fontWeight: 700,
                      letterSpacing: '1px',
                    },
                  }}
                  sx={formTextFieldSx}
                />
              </Grid>

              {/* Discount Percentage */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  id="discountPercentage"
                  name="discountPercentage"
                  label="Discount Percentage"
                  type="number"
                  value={formik.values.discountPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)
                  }
                  helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PercentIcon
                          sx={{
                            fontSize: 16,
                            color: '#64748B',
                          }}
                        />
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 1,
                      max: 100,
                    },
                  }}
                  sx={formTextFieldSx}
                />
              </Grid>

              {/* Start Date */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <DatePicker
                  label="Validity Start Date"
                  value={formik.values.validityStartDate}
                  onChange={(date) => formik.setFieldValue('validityStartDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      onBlur: () => formik.setFieldTouched('validityStartDate', true),
                      error:
                        formik.touched.validityStartDate &&
                        Boolean(formik.errors.validityStartDate),
                      helperText:
                        formik.touched.validityStartDate && formik.errors.validityStartDate,
                      sx: {
                        ...formTextFieldSx,
                        '& .MuiInputBase-root': {
                          fontSize: 13,
                          fontFamily: '"Manrope", Arial, sans-serif',
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* End Date */}
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <DatePicker
                  label="Validity End Date"
                  value={formik.values.validityEndDate}
                  onChange={(date) => formik.setFieldValue('validityEndDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      onBlur: () => formik.setFieldTouched('validityEndDate', true),
                      error:
                        formik.touched.validityEndDate && Boolean(formik.errors.validityEndDate),
                      helperText: formik.touched.validityEndDate && formik.errors.validityEndDate,
                      sx: {
                        ...formTextFieldSx,
                        '& .MuiInputBase-root': {
                          fontSize: 13,
                          fontFamily: '"Manrope", Arial, sans-serif',
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* Minimum Order Value */}
              <Grid
                size={{
                  xs: 12,
                }}
              >
                <TextField
                  fullWidth
                  id="minimumOrderValue"
                  name="minimumOrderValue"
                  label="Minimum Order Value"
                  type="number"
                  value={formik.values.minimumOrderValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.minimumOrderValue && Boolean(formik.errors.minimumOrderValue)
                  }
                  helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon
                          sx={{
                            fontSize: 16,
                            color: '#64748B',
                          }}
                        />
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 1,
                    },
                  }}
                  sx={formTextFieldSx}
                />
              </Grid>

              {/* Note */}
              <Grid
                size={{
                  xs: 12,
                }}
              >
                <Box sx={formSectionNoteSx}>
                  <Typography sx={formSectionNoteTextSx}>
                    <strong>Note:</strong> Coupons will be available to all eligible customers once
                    activated. Ensure the validity period and discount are correct before
                    submitting.
                  </Typography>
                </Box>
              </Grid>

              {/* Submit */}
              <Grid
                size={{
                  xs: 12,
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={adminCoupon.loading}
                  sx={formPrimaryButtonSx}
                >
                  {adminCoupon.loading ? (
                    <CircularProgress
                      size={22}
                      sx={{
                        color: '#0F172A',
                      }}
                    />
                  ) : (
                    'Create Coupon'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </Box>

      <FormFeedbackToast
        feedback={{
          open: snackbarOpen,
          severity: adminCoupon.error ? 'error' : 'success',
          message: adminCoupon.error || 'Coupon created successfully',
          autoHideDuration: 6000,
        }}
        onClose={handleCloseSnackbar}
      />
    </Box>
  )
}
export default CreateCouponForm
