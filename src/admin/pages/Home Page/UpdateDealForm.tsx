import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    Box, Button, CircularProgress, FormControl, FormHelperText,
    InputAdornment, InputLabel, MenuItem, Select, TextField, Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { updateDeal } from '../../../Redux Toolkit/Admin/DealSlice'
import { fetchHomeCategories } from '../../../Redux Toolkit/Admin/AdminSlice'
import PercentIcon from '@mui/icons-material/Percent'
import CategoryIcon from '@mui/icons-material/Category'

const amazonTextField = {
    '& label.Mui-focused': { color: '#232F3E' },
    '& .MuiOutlinedInput-root': {
        fontFamily: '"Amazon Ember", Arial, sans-serif', fontSize: 13,
        '&:hover fieldset': { borderColor: '#FF9900' },
        '&.Mui-focused fieldset': { borderColor: '#FF9900', borderWidth: 2 },
    },
    '& label': { fontFamily: '"Amazon Ember", Arial, sans-serif', fontSize: 13 },
    '& .MuiFormHelperText-root': { fontFamily: '"Amazon Ember", Arial, sans-serif', fontSize: 11 },
}

interface Props {
    id: number
    onSuccess?: () => void
}

const UpdateDealForm = ({ id, onSuccess }: Props) => {
    const { admin, deal } = useAppSelector(store => store)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchHomeCategories())
    }, [])

    // Pre-fill current deal values
    const currentDeal = deal.deals.find(d => d.id === id)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            discount: currentDeal?.discount ?? 0,
            category: currentDeal?.category?.id?.toString() ?? '',
        },
        validationSchema: Yup.object({
            discount: Yup.number()
                .typeError('Enter a valid number')
                .required('Discount is required')
                .min(1, 'Discount must be at least 1%')
                .max(100, 'Discount cannot exceed 100%'),
            category: Yup.string().required('Please select a category'),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(updateDeal({
                id,
                deal: {
                    discount: values.discount,
                    category: { id: Number(values.category) },
                },
            }))
            if (updateDeal.fulfilled.match(result)) {
                onSuccess?.()
            }
        },
    })

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Discount */}
            <TextField
                fullWidth
                id="discount"
                name="discount"
                label="Discount Percentage"
                type="number"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PercentIcon sx={{ fontSize: 16, color: '#565959' }} />
                        </InputAdornment>
                    ),
                    inputProps: { min: 1, max: 100 },
                }}
                sx={amazonTextField}
            />

            {/* Category */}
            <FormControl
                fullWidth
                error={formik.touched.category && Boolean(formik.errors.category)}
                sx={{
                    '& label.Mui-focused': { color: '#232F3E' },
                    '& .MuiOutlinedInput-root': {
                        fontFamily: '"Amazon Ember", Arial, sans-serif', fontSize: 13,
                        '&:hover fieldset': { borderColor: '#FF9900' },
                        '&.Mui-focused fieldset': { borderColor: '#FF9900', borderWidth: 2 },
                    },
                    '& label': { fontFamily: '"Amazon Ember", Arial, sans-serif', fontSize: 13 },
                }}
            >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Category"
                    startAdornment={
                        <InputAdornment position="start">
                            <CategoryIcon sx={{ fontSize: 16, color: '#565959' }} />
                        </InputAdornment>
                    }
                >
                    {admin?.categories?.map((item: any) => (
                        <MenuItem key={item.id} value={item.id.toString()} sx={{ fontSize: 13, fontFamily: '"Amazon Ember", Arial, sans-serif' }}>
                            {item.categoryId}
                        </MenuItem>
                    ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                    <FormHelperText sx={{ fontFamily: '"Amazon Ember", Arial, sans-serif', fontSize: 11 }}>
                        {formik.errors.category}
                    </FormHelperText>
                )}
            </FormControl>

            {/* Note */}
            <Box sx={{ backgroundColor: '#FFF3CD', border: '1px solid #FFEAA7', borderRadius: '3px', px: 2, py: 1 }}>
                <Typography sx={{ fontSize: 12, color: '#856404', fontFamily: '"Amazon Ember", Arial, sans-serif' }}>
                    <strong>Note:</strong> Updating the deal will immediately reflect on the homepage for all customers.
                </Typography>
            </Box>

            {/* Submit */}
            <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={deal?.loading}
                sx={{
                    backgroundColor: '#FF9900', color: '#0F1111',
                    fontFamily: '"Amazon Ember", Arial, sans-serif',
                    fontWeight: 700, fontSize: 14, textTransform: 'none',
                    borderRadius: '20px', py: 1.2,
                    border: '1px solid #e88b00',
                    boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 -1px 0 rgba(0,0,0,.15) inset',
                    '&:hover': { backgroundColor: '#e88b00', boxShadow: 'none' },
                    '&:active': { backgroundColor: '#d47f00' },
                    '&.Mui-disabled': { backgroundColor: '#f7ca7d', color: '#9d9d9d' },
                }}
            >
                {deal?.loading
                    ? <CircularProgress size={22} sx={{ color: '#0F1111' }} />
                    : 'Update Deal'
                }
            </Button>
        </Box>
    )
}

export default UpdateDealForm