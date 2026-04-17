import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Snackbar,
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
const modernTextField = {
  '& label.Mui-focused': {
    color: '#1E293B',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
    '&:hover fieldset': {
      borderColor: '#0F766E',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0F766E',
      borderWidth: 2,
    },
  },
  '& label': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 11,
  },
}
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
    <Box
      sx={{
        maxWidth: 680,
        backgroundColor: '#fff',
        border: '1px solid #DDD',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#1E293B',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '3px solid #0F766E',
        }}
      >
        <LocalOfferIcon
          sx={{
            color: '#0F766E',
            fontSize: 20,
          }}
        />
        <Typography
          sx={{
            color: '#fff',
            fontFamily: '"Manrope", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
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
                  sx={modernTextField}
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
                  sx={modernTextField}
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
                        ...modernTextField,
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
                        ...modernTextField,
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
                  sx={modernTextField}
                />
              </Grid>

              {/* Note */}
              <Grid
                size={{
                  xs: 12,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#FFF3CD',
                    border: '1px solid #FFEAA7',
                    borderRadius: '3px',
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: '#856404',
                      fontFamily: '"Manrope", Arial, sans-serif',
                    }}
                  >
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
                    boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 -1px 0 rgba(0,0,0,.15) inset',
                    '&:hover': {
                      backgroundColor: '#0b5f59',
                      boxShadow: 'none',
                    },
                    '&:active': {
                      backgroundColor: '#115e59',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#f7ca7d',
                      color: '#9d9d9d',
                    },
                  }}
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

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={adminCoupon.error ? 'error' : 'success'}
          variant="filled"
          sx={{
            width: '100%',
            fontFamily: '"Manrope", Arial, sans-serif',
            backgroundColor: adminCoupon.error ? '#CC0C39' : '#067D62',
          }}
        >
          {adminCoupon.error ? adminCoupon.error : 'Coupon created successfully'}
        </Alert>
      </Snackbar>
    </Box>
  )
}
export default CreateCouponForm
