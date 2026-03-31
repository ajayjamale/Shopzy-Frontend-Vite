import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField, Button, MenuItem, Select, InputLabel,
  FormControl, FormHelperText, Grid, CircularProgress,
  IconButton, Snackbar, Alert, Typography, Box, Paper, Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { menLevelTwo } from "../../../data/category/level two/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level two/womenLevelTwo";
import { menLevelThree } from "../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../data/category/level three/womenLevelThree";
import { colors } from "../../../data/Filter/color";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { electronicsLevelThree } from "../../../data/category/level three/electronicsLevelThree";
import { electronicsLevelTwo } from "../../../data/category/level two/electronicsLavelTwo";
import { furnitureLevelTwo } from "../../../data/category/level two/furnitureLevleTwo";
import { furnitureLevelThree } from "../../../data/category/level three/furnitureLevelThree";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";
import type { Seller } from "../../../types/sellerTypes";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const AMZ = {
  navy: '#131921', navyLight: '#232f3e', orange: '#ff9900',
  blue: '#007185', green: '#067d62', red: '#cc0c39',
  bg: '#f3f3f3', white: '#ffffff', border: '#dddddd',
  borderDark: '#aaaaaa', text: '#0f1111', textMuted: '#565959',
  headerBg: '#f0f2f2', linkBlue: '#007185',
};

// ─── Category Maps ────────────────────────────────────────────────────────────
const categoryTwo: { [key: string]: any[] } = {
  men: menLevelTwo, women: womenLevelTwo, kids: [],
  home_furniture: furnitureLevelTwo, beauty: [], electronics: electronicsLevelTwo,
};
const categoryThree: { [key: string]: any[] } = {
  men: menLevelThree, women: womenLevelThree, kids: [],
  home_furniture: furnitureLevelThree, beauty: [], electronics: electronicsLevelThree,
};

const validationSchema = Yup.object({
  title: Yup.string().min(5).required("Title is required"),
  description: Yup.string().min(10).required("Description is required"),
  price: Yup.number().positive().required(),
  discountedPrice: Yup.number().positive().required(),
  discountPercent: Yup.number().positive().required(),
  quantity: Yup.number().positive().required(),
  color: Yup.string().required(),
  category: Yup.string().required(),
  sizes: Yup.string().required(),
});

interface FormValues {
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  // FIX 1: discountPercent was missing from FormValues.
  // TypeScript infers the formik values type from initialValues.
  // Without this field declared AND in initialValues, the spread
  // { ...values, discountPercent } in onSubmit was adding it as an
  // EXTRA property outside the typed shape — Axios may silently strip
  // extra keys depending on serialization. Now it is part of the shape.
  discountPercent: number;
  quantity: number;
  color: string;
  images: string[];
  category: any;
  sizes: string;
  seller: Seller | undefined;
  createdAt: any;
  numRatings: number;
  in_stock: boolean;
}

// ─── Styled Components ────────────────────────────────────────────────────────

const PageWrap = styled('div')({
  background: AMZ.bg, minHeight: '100vh',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
});

const TopBar = styled('div')({
  background: AMZ.navy, padding: '8px 24px',
  display: 'flex', alignItems: 'center', gap: 16,
});

const ContentWrap = styled('div')({
  maxWidth: '1100px', margin: '0 auto', padding: '20px 24px',
});

const SectionCard = styled(Paper)({
  borderRadius: '4px', border: `1px solid ${AMZ.border}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)', background: AMZ.white,
  marginBottom: '16px', overflow: 'hidden',
});

const SectionHeader = styled('div')({
  background: AMZ.headerBg, padding: '10px 18px',
  borderBottom: `1px solid ${AMZ.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
});

const SectionBody = styled('div')({ padding: '20px 18px' });

const FieldLabel = styled(Typography)({
  fontSize: '13px', fontWeight: 700, color: AMZ.text,
  fontFamily: "'Helvetica Neue', Arial, sans-serif", marginBottom: '4px',
});

const RequiredStar = styled('span')({ color: AMZ.red });

const AmazonField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '3px', fontSize: '13px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff',
    '& fieldset': { borderColor: AMZ.borderDark },
    '&:hover fieldset': { borderColor: '#007185' },
    '&.Mui-focused fieldset': { borderColor: '#e77600', borderWidth: '2px', boxShadow: '0 0 0 3px rgba(228,121,17,0.15)' },
  },
  '& .MuiInputBase-input': { padding: '8px 10px', fontSize: '13px' },
  '& .MuiInputLabel-root': { display: 'none' },
  '& .MuiFormHelperText-root': { fontSize: '12px', color: AMZ.red, margin: '4px 0 0 0' },
});

const AmazonSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '3px', fontSize: '13px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff',
    '& fieldset': { borderColor: AMZ.borderDark },
    '&:hover fieldset': { borderColor: '#007185' },
    '&.Mui-focused fieldset': { borderColor: '#e77600', borderWidth: '2px', boxShadow: '0 0 0 3px rgba(228,121,17,0.15)' },
  },
  '& .MuiSelect-select': { padding: '8px 10px', fontSize: '13px' },
  '& .MuiInputLabel-root': { display: 'none' },
  '& .MuiFormHelperText-root': { fontSize: '12px', color: AMZ.red, margin: '4px 0 0 0' },
});

const UploadBox = styled('label')({
  width: 96, height: 96, borderRadius: '3px',
  border: `2px dashed ${AMZ.borderDark}`, background: AMZ.headerBg,
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s',
  color: AMZ.textMuted, flexShrink: 0, gap: 4,
  '&:hover': { borderColor: '#e77600', background: '#fffbf2', color: '#e77600' },
});

const ThumbWrap = styled('div')({
  position: 'relative', width: 96, height: 96, borderRadius: '3px',
  border: `1px solid ${AMZ.border}`, overflow: 'hidden',
  '& img': { width: '100%', height: '100%', objectFit: 'cover' },
  '& .rmv': {
    position: 'absolute', top: 2, right: 2, opacity: 0, transition: 'opacity 0.15s',
    background: 'rgba(0,0,0,0.65)', borderRadius: '50%',
  },
  '&:hover .rmv': { opacity: 1 },
});

const SaveBtn = styled(Button)({
  borderRadius: '3px', padding: '9px 22px',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400, fontSize: '14px', textTransform: 'none',
  background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
  color: '#111', border: '1px solid #a88734', boxShadow: 'none',
  '&:hover': { background: 'linear-gradient(to bottom, #f5d78e, #eeb933)', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' },
  '&:disabled': { background: '#e9ecef', color: '#888', border: '1px solid #ccc' },
});

const GrayBtn = styled(Button)({
  borderRadius: '3px', padding: '9px 18px',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400, fontSize: '13px', textTransform: 'none',
  background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)',
  color: '#111', border: '1px solid #adb1b8', boxShadow: 'none',
  '&:hover': { background: 'linear-gradient(to bottom, #e7eaf0, #d9dce3)', boxShadow: 'none' },
});

const FieldRow = ({ label, required, children }: any) => (
  <Box mb={2.5}>
    <FieldLabel>{label} {required && <RequiredStar>*</RequiredStar>}</FieldLabel>
    {children}
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────

const UpdateProductForm = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { sellers, sellerProduct, products } = useAppSelector(store => store);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "", description: "", mrpPrice: 0, sellingPrice: 0,
      // FIX 2: Added discountPercent to initialValues.
      // Without this, formik never tracked the field and { ...values }
      // in onSubmit was spreading an object where discountPercent wasn't
      // part of the typed shape — causing it to be absent in the request body.
      discountPercent: 0,
      quantity: 0, color: "", images: [], category: null,
      sizes: "", seller: undefined, createdAt: null, numRatings: 0, in_stock: true,
    },
    // validationSchema,
    onSubmit: (values) => {
      const mrp = Number(values.mrpPrice);
      const selling = Number(values.sellingPrice);
      const discountPercent =
        mrp > 0 && selling >= 0 && mrp > selling
          ? Math.round(((mrp - selling) / mrp) * 100)
          : 0;
      const payload = { ...values, discountPercent };
      dispatch(updateProduct({ productId: Number(productId), product: payload }));
      console.log(payload);
    },
  });

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  const childCategory = (category: any, parentCategoryId: any) =>
    category.filter((c: any) => c.parentCategoryId == parentCategoryId);

  useEffect(() => { dispatch(fetchProductById(Number(productId))); }, [productId]);

  useEffect(() => {
    if (sellerProduct.productCreated || sellerProduct.error) setOpenSnackbar(true);
  }, [sellerProduct.productCreated, sellerProduct.error]);

  useEffect(() => {
    const mrp = products.product?.mrpPrice || 0;
    const selling = products.product?.sellingPrice || 0;
    // FIX 3: Populate discountPercent when loading the existing product.
    // Previously this was always 0 because the field wasn't in setValues.
    // Now we use the stored value from the backend, or recompute it as a
    // fallback in case it was saved as 0 for products created before the fix.
    const storedDiscount = products.product?.discountPercent || 0;
    const computedDiscount = mrp > 0 && selling > 0 && mrp > selling
      ? Math.round(((mrp - selling) / mrp) * 100)
      : 0;

    formik.setValues({
      title: products.product?.title || "",
      description: products.product?.description || "",
      mrpPrice: mrp,
      sellingPrice: selling,
      discountPercent: storedDiscount > 0 ? storedDiscount : computedDiscount,
      quantity: products.product?.quantity || 0,
      color: products.product?.color || "",
      images: products.product?.images || [],
      category: products.product?.category,
      sizes: products.product?.sizes || "",
      seller: products.product?.seller,
      createdAt: products.product?.createdAt || "",
      numRatings: products.product?.numRatings || 0,
      in_stock: products.product?.in_stock ?? true,
    });
  }, [products.product]);

  return (
    <PageWrap>
      {/* Top Bar */}
      <TopBar>
        <Typography sx={{ color: AMZ.orange, fontWeight: 700, fontSize: '20px', fontFamily: "'Helvetica Neue', Arial" }}>
          seller<span style={{ color: '#fff' }}>central</span>
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Edit Product Listing</Typography>
      </TopBar>

      <ContentWrap>
        {/* Breadcrumb & Title */}
        <Box mb={1.5} mt={0.5}>
          <Typography sx={{ fontSize: '12px', color: AMZ.linkBlue, fontFamily: "'Helvetica Neue', Arial", cursor: 'pointer' }}
            onClick={() => navigate('/seller/products')}>
            ‹ Back to Manage Inventory
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5} flexWrap="wrap" gap={1}>
          <Box>
            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
              Edit Product Listing
            </Typography>
            <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, mt: 0.3, fontFamily: "'Helvetica Neue', Arial" }}>
              ASIN: #{String(productId).padStart(10, '0')} &nbsp;·&nbsp; {formik.values.title && `"${formik.values.title.slice(0, 50)}..."`}
            </Typography>
          </Box>

          {/* Quick status badge */}
          <Box sx={{
            background: formik.values.in_stock ? '#e6f4ea' : '#fce8e6',
            border: `1px solid ${formik.values.in_stock ? '#a8d5b5' : '#f5c6c2'}`,
            color: formik.values.in_stock ? '#1e7e34' : '#c62828',
            borderRadius: '3px', px: 1.5, py: 0.6, fontSize: '12px', fontWeight: 700,
            fontFamily: "'Helvetica Neue', Arial",
          }}>
            {formik.values.in_stock ? '● Active' : '○ Inactive'}
          </Box>
        </Box>

        <form onSubmit={formik.handleSubmit}>

          {/* ── Images ── */}
          <SectionCard elevation={0}>
            <SectionHeader>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
                Product Images
              </Typography>
              <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, fontFamily: "'Helvetica Neue', Arial" }}>
                {formik.values.images.length} image(s) uploaded
              </Typography>
            </SectionHeader>
            <SectionBody>
              <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, mb: 2, fontFamily: "'Helvetica Neue', Arial" }}>
                First image is the main listing image. Minimum 500px on longest side.
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1.5}>
                <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
                <UploadBox htmlFor="fileInput">
                  {uploadImage
                    ? <CircularProgress size={20} sx={{ color: '#e77600' }} />
                    : <>
                        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 24 }} />
                        <Typography sx={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.3px', fontFamily: "'Helvetica Neue', Arial" }}>ADD IMAGE</Typography>
                      </>}
                </UploadBox>
                {formik.values.images.map((image, index) => (
                  <ThumbWrap key={index}>
                    <img src={image} alt={`img-${index}`} />
                    <IconButton className="rmv" size="small" onClick={() => handleRemoveImage(index)}
                      sx={{ color: '#fff', width: 22, height: 22, padding: 0 }}>
                      <CloseIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                    {index === 0 && (
                      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', textAlign: 'center', py: 0.3 }}>
                        <Typography sx={{ fontSize: '9px', color: '#fff', fontWeight: 700, fontFamily: "'Helvetica Neue', Arial", letterSpacing: '0.5px' }}>MAIN</Typography>
                      </Box>
                    )}
                  </ThumbWrap>
                ))}
              </Box>
            </SectionBody>
          </SectionCard>

          {/* ── Vital Info ── */}
          <SectionCard elevation={0}>
            <SectionHeader>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
                Vital Info
              </Typography>
            </SectionHeader>
            <SectionBody>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FieldRow label="Product name" required>
                    <AmazonField fullWidth id="title" name="title"
                      placeholder="Product name"
                      value={formik.values.title} onChange={formik.handleChange}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldRow label="Product description" required>
                    <AmazonField fullWidth multiline rows={5} id="description" name="description"
                      placeholder="Detailed product description"
                      value={formik.values.description} onChange={formik.handleChange}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </FieldRow>
                </Grid>
              </Grid>
            </SectionBody>
          </SectionCard>

          {/* ── Pricing ── */}
          <SectionCard elevation={0}>
            <SectionHeader>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
                Offer & Pricing
              </Typography>
            </SectionHeader>
            <SectionBody>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FieldRow label="MRP (₹)" required>
                    <AmazonField fullWidth id="mrp_price" name="mrpPrice" type="number"
                      value={formik.values.mrpPrice} onChange={formik.handleChange}
                      error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                      helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                    />
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FieldRow label="Your selling price (₹)" required>
                    <AmazonField fullWidth id="sellingPrice" name="sellingPrice" type="number"
                      value={formik.values.sellingPrice} onChange={formik.handleChange}
                      error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                      helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                    />
                  </FieldRow>
                </Grid>

                {/* ── Live Discount Preview ── */}
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Box mb={2.5}>
                    <FieldLabel>Discount % <span style={{ color: AMZ.textMuted, fontWeight: 400 }}>(auto-calculated)</span></FieldLabel>
                    {(() => {
                      const mrp = Number(formik.values.mrpPrice);
                      const sell = Number(formik.values.sellingPrice);
                      const pct = mrp > 0 && sell >= 0 && mrp > sell ? Math.round(((mrp - sell) / mrp) * 100) : 0;
                      return (
                        <Box sx={{
                          height: '37px', borderRadius: '3px',
                          border: `1px solid ${pct > 0 ? '#a8d5b5' : AMZ.border}`,
                          background: pct > 0 ? '#e6f4ea' : AMZ.headerBg,
                          display: 'flex', alignItems: 'center', px: 1.5, gap: 1,
                        }}>
                          <Typography sx={{
                            fontSize: '18px', fontWeight: 700,
                            color: pct > 0 ? '#1e7e34' : AMZ.textMuted,
                            fontFamily: "'Helvetica Neue', Arial",
                          }}>
                            {pct > 0 ? `-${pct}%` : '—'}
                          </Typography>
                          {pct > 0 && (
                            <Typography sx={{ fontSize: '11px', color: '#1e7e34', fontFamily: "'Helvetica Neue', Arial" }}>
                              saves ₹{(mrp - sell).toFixed(0)}
                            </Typography>
                          )}
                        </Box>
                      );
                    })()}
                    <Typography sx={{ fontSize: '11px', color: AMZ.textMuted, mt: 0.5, fontFamily: "'Helvetica Neue', Arial" }}>
                      Sent to customer site automatically
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FieldRow label="Color" required>
                    <AmazonSelect fullWidth error={formik.touched.color && Boolean(formik.errors.color)}>
                      <Select name="color" value={formik.values.color} onChange={formik.handleChange} displayEmpty>
                        <MenuItem value=""><em style={{ color: '#999', fontStyle: 'normal' }}>Select color</em></MenuItem>
                        {colors.map(c => (
                          <MenuItem key={c.name} value={c.name}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, border: c.name === 'White' ? '1px solid #ccc' : 'none', display: 'inline-block', flexShrink: 0 }} />
                              <span style={{ fontSize: '13px', fontFamily: "'Helvetica Neue', Arial" }}>{c.name}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.color && formik.errors.color && <FormHelperText>{formik.errors.color}</FormHelperText>}
                    </AmazonSelect>
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FieldRow label="Size" required>
                    <AmazonSelect fullWidth error={formik.touched.sizes && Boolean(formik.errors.sizes)}>
                      <Select name="sizes" value={formik.values.sizes} onChange={formik.handleChange} displayEmpty>
                        <MenuItem value=""><em style={{ color: '#999', fontStyle: 'normal' }}>Select size</em></MenuItem>
                        {['FREE', 'S', 'M', 'L', 'XL'].map(s => (
                          <MenuItem key={s} value={s} sx={{ fontSize: '13px', fontFamily: "'Helvetica Neue', Arial" }}>{s}</MenuItem>
                        ))}
                      </Select>
                      {formik.touched.sizes && formik.errors.sizes && <FormHelperText>{formik.errors.sizes}</FormHelperText>}
                    </AmazonSelect>
                  </FieldRow>
                </Grid>
              </Grid>
            </SectionBody>
          </SectionCard>

          {/* ── Actions ── */}
          <Box sx={{ background: AMZ.white, border: `1px solid ${AMZ.border}`, borderRadius: '4px', p: '14px 18px', display: 'flex', gap: 1.5, alignItems: 'center', justifyContent: 'flex-end', mb: 4 }}>
            <GrayBtn onClick={() => navigate('/seller/products')}>Cancel</GrayBtn>
            <SaveBtn type="submit" disabled={sellerProduct.loading} startIcon={!sellerProduct.loading && <SaveOutlinedIcon sx={{ fontSize: 16 }} />}>
              {sellerProduct.loading ? <CircularProgress size={18} sx={{ color: '#333' }} /> : 'Save and finish'}
            </SaveBtn>
          </Box>
        </form>
      </ContentWrap>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={sellerProduct.error ? 'error' : 'success'} variant="filled"
          sx={{ width: '100%', fontFamily: "'Helvetica Neue', Arial", borderRadius: '3px' }}>
          {sellerProduct.error ? sellerProduct.error : 'Product updated successfully'}
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};

export default UpdateProductForm;