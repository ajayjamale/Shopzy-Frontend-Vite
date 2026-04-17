import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import { colors } from '../../../data/filters/color'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { updateProduct } from '../../../store/seller/sellerProductSlice'
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductById } from '../../../store/customer/ProductSlice'
import {
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  SellerStatusChip,
  formatSellerCurrency,
  sellerInputSx,
  sellerPrimaryButtonSx,
  sellerSecondaryButtonSx,
} from '../../theme/sellerUi'
const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, 'Title should have at least 5 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description should have at least 10 characters')
    .required('Description is required'),
  brand: Yup.string()
    .min(2, 'Brand should have at least 2 characters')
    .required('Brand is required'),
  mrpPrice: Yup.number()
    .typeError('MRP is required')
    .positive('MRP must be positive')
    .required('MRP is required'),
  sellingPrice: Yup.number()
    .typeError('Selling price is required')
    .positive('Selling price must be positive')
    .required('Selling price is required'),
  quantity: Yup.number()
    .typeError('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  color: Yup.string().required('Color is required'),
  sizes: Yup.string().required('Size is required'),
})
const UpdateProductForm = () => {
  const [uploading, setUploading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { sellerProduct, products } = useAppSelector((store) => store)
  const { productId } = useParams()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      brand: '',
      mrpPrice: 0,
      sellingPrice: 0,
      discountPercent: 0,
      quantity: 0,
      color: '',
      images: [],
      category: null,
      sizes: '',
      seller: undefined,
      createdAt: null,
      numRatings: 0,
      in_stock: true,
    },
    validationSchema,
    onSubmit: (values) => {
      const mrp = Number(values.mrpPrice)
      const selling = Number(values.sellingPrice)
      const discountPercent =
        mrp > 0 && selling >= 0 && mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0
      dispatch(
        updateProduct({
          productId: Number(productId),
          product: {
            ...values,
            discountPercent,
          },
        }),
      )
    },
  })
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)))
    }
  }, [dispatch, productId])
  useEffect(() => {
    const product = products.product
    if (!product) return
    const mrp = product.mrpPrice || 0
    const selling = product.sellingPrice || 0
    const storedDiscount = product.discountPercent || 0
    const computedDiscount =
      mrp > 0 && mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0
    formik.setValues({
      title: product.title || '',
      description: product.description || '',
      brand: product.brand || '',
      mrpPrice: mrp,
      sellingPrice: selling,
      discountPercent: storedDiscount > 0 ? storedDiscount : computedDiscount,
      quantity: product.quantity || 0,
      color: product.color || '',
      images: product.images || [],
      category: product.category,
      sizes: product.sizes || '',
      seller: product.seller,
      createdAt: product.createdAt || null,
      numRatings: product.numRatings || 0,
      in_stock: product.in_stock ?? true,
    })
  }, [products.product])
  useEffect(() => {
    if (sellerProduct.productCreated || sellerProduct.error) {
      setSnackbarOpen(true)
    }
  }, [sellerProduct.error, sellerProduct.productCreated])
  const discountPreview = useMemo(() => {
    const mrp = Number(formik.values.mrpPrice)
    const selling = Number(formik.values.sellingPrice)
    if (!(mrp > 0) || !(selling >= 0) || mrp <= selling) return 0
    return Math.round(((mrp - selling) / mrp) * 100)
  }, [formik.values.mrpPrice, formik.values.sellingPrice])
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      formik.setFieldValue('images', [...formik.values.images, imageUrl])
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }
  const removeImage = (index) => {
    const next = [...formik.values.images]
    next.splice(index, 1)
    formik.setFieldValue('images', next)
  }
  return (
    <Box>
      <SellerPageIntro
        eyebrow="Catalog"
        title="Edit product listing"
        description="Update listing details, pricing, stock, and media without leaving the seller workspace."
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate('/seller/products')}
              sx={sellerSecondaryButtonSx}
            >
              Back to products
            </Button>
            <SellerStatusChip
              label={formik.values.in_stock ? 'Live listing' : 'Inactive listing'}
              tone={formik.values.in_stock ? 'success' : 'danger'}
            />
          </>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          mb: 2,
        }}
      >
        <SellerMetricCard
          label="Current price"
          value={formatSellerCurrency(formik.values.sellingPrice)}
          helper={`MRP ${formatSellerCurrency(formik.values.mrpPrice)}`}
          tone="accent"
          icon={<SellRoundedIcon />}
        />
        <SellerMetricCard
          label="Stock quantity"
          value={String(formik.values.quantity || 0)}
          helper={formik.values.quantity <= 5 ? 'Low stock' : 'Healthy stock'}
          tone={formik.values.quantity <= 5 ? 'warning' : 'info'}
          icon={<Inventory2RoundedIcon />}
        />
        <SellerMetricCard
          label="Discount preview"
          value={`${discountPreview}%`}
          helper={`${formik.values.images.length} image${formik.values.images.length !== 1 ? 's' : ''} attached`}
          tone={discountPreview > 0 ? 'success' : 'default'}
          icon={<SellRoundedIcon />}
        />
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1.45fr 0.95fr' },
          alignItems: 'start',
        }}
      >
        <Stack spacing={2}>
          <SellerSection
            title="Basic details"
            description="Update the customer-facing listing title and description."
          >
            <Stack spacing={1.6}>
              <TextField
                label="Product title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.title && formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
                sx={sellerInputSx}
              />
              <TextField
                label="Product description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.description && formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                multiline
                minRows={5}
                fullWidth
                sx={sellerInputSx}
              />
              <TextField
                label="Brand"
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.brand && formik.errors.brand)}
                helperText={formik.touched.brand && formik.errors.brand}
                fullWidth
                sx={sellerInputSx}
              />
            </Stack>
          </SellerSection>

          <SellerSection
            title="Pricing and inventory"
            description="Keep pricing accurate and stock levels aligned with the actual catalog."
          >
            <Box
              sx={{
                display: 'grid',
                gap: 1.6,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <TextField
                label="MRP price"
                name="mrpPrice"
                type="number"
                value={formik.values.mrpPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.mrpPrice && formik.errors.mrpPrice)}
                helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                fullWidth
                sx={sellerInputSx}
              />
              <TextField
                label="Selling price"
                name="sellingPrice"
                type="number"
                value={formik.values.sellingPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.sellingPrice && formik.errors.sellingPrice)}
                helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                fullWidth
                sx={sellerInputSx}
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.quantity && formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                fullWidth
                sx={sellerInputSx}
              />
              <Box
                sx={{
                  p: 1.6,
                  borderRadius: '12px',
                  border: '1px solid #DCE8EC',
                  bgcolor:
                    discountPreview > 0 ? 'rgba(21, 128, 61, 0.08)' : 'rgba(14, 116, 144, 0.05)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '.74rem',
                    fontWeight: 800,
                    color: '#64748B',
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Live discount
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.35rem',
                    color: discountPreview > 0 ? '#15803D' : '#0F172A',
                    mt: 0.8,
                  }}
                >
                  {discountPreview > 0 ? `-${discountPreview}%` : '0%'}
                </Typography>
                <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                  Auto-calculated from MRP and selling price
                </Typography>
              </Box>
            </Box>
          </SellerSection>
        </Stack>

        <Stack spacing={2} sx={{ position: { lg: 'sticky' }, top: { lg: 90 } }}>
          <SellerSection
            title="Attributes"
            description="Quick listing values used in the storefront."
          >
            <Stack spacing={1.6}>
              <TextField
                select
                label="Color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.color && formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
                fullWidth
                sx={sellerInputSx}
              >
                {colors.map((color) => (
                  <MenuItem key={color.name} value={color.name}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: color.hex,
                          border: '1px solid #d1d5db',
                        }}
                      />
                      <span>{color.name}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Size"
                name="sizes"
                value={formik.values.sizes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.sizes && formik.errors.sizes)}
                helperText={formik.touched.sizes && formik.errors.sizes}
                fullWidth
                sx={sellerInputSx}
              >
                {['FREE', 'S', 'M', 'L', 'XL'].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </SellerSection>

          <SellerSection
            title="Media"
            description="Refresh product photography or rearrange the listing gallery."
          >
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={
                uploading ? <CircularProgress size={14} /> : <AddPhotoAlternateOutlinedIcon />
              }
              disabled={uploading}
              sx={{ ...sellerSecondaryButtonSx, borderStyle: 'dashed' }}
            >
              {uploading ? 'Uploading...' : 'Add product image'}
              <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>

            <Box
              sx={{
                mt: 1.6,
                display: 'grid',
                gap: 1,
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              }}
            >
              {formik.values.images.map((image, index) => (
                <Box
                  key={`${image}-${index}`}
                  sx={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #DCE8EC',
                    aspectRatio: '1 / 1',
                    bgcolor: '#F8FBFC',
                  }}
                >
                  <img
                    src={image}
                    alt={`product-${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeImage(index)}
                    sx={{
                      minWidth: 0,
                      width: 26,
                      height: 26,
                      p: 0,
                      borderRadius: '50%',
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      bgcolor: 'rgba(255,255,255,0.92)',
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                  </Button>
                </Box>
              ))}
              {!formik.values.images.length ? (
                <Box
                  sx={{
                    gridColumn: '1 / -1',
                    p: 1.6,
                    borderRadius: '10px',
                    border: '1px dashed #C7D8DD',
                    bgcolor: 'rgba(14, 116, 144, 0.04)',
                  }}
                >
                  <Typography sx={{ fontSize: '.82rem', color: '#64748B' }}>
                    No product images yet. Upload at least one image to keep the listing
                    presentable.
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </SellerSection>

          <SellerSection
            title="Save changes"
            description="Review the listing details and publish your updates when ready."
          >
            <Stack spacing={1}>
              <SummaryRow
                label="Category"
                value={products.product?.category?.name || 'Unassigned'}
              />
              <SummaryRow label="Brand" value={formik.values.brand || '-'} />
              <SummaryRow label="Ratings" value={String(formik.values.numRatings || 0)} />
              <SummaryRow label="Images" value={String(formik.values.images.length)} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/seller/products')}
                sx={sellerSecondaryButtonSx}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={sellerProduct.loading || uploading}
                startIcon={sellerProduct.loading ? undefined : <SaveRoundedIcon />}
                sx={sellerPrimaryButtonSx}
              >
                {sellerProduct.loading ? (
                  <CircularProgress size={18} sx={{ color: '#fff' }} />
                ) : (
                  'Save updates'
                )}
              </Button>
            </Stack>
          </SellerSection>
        </Stack>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={sellerProduct.error ? 'error' : 'success'}
          variant="filled"
        >
          {sellerProduct.error || 'Product updated successfully'}
        </Alert>
      </Snackbar>
    </Box>
  )
}
const SummaryRow = ({ label, value }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{ py: 0.8, borderBottom: '1px solid #E8EFF2' }}
  >
    <Typography sx={{ color: '#64748B', fontSize: '.82rem' }}>{label}</Typography>
    <Typography sx={{ fontWeight: 800, fontSize: '.86rem', color: '#0F172A' }}>{value}</Typography>
  </Stack>
)
export default UpdateProductForm
