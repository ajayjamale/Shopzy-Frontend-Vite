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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { mainCategory } from "../../../data/category/mainCategory";
import { menLevelTwo } from "../../../data/category/level two/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level two/womenLevelTwo";
import { menLevelThree } from "../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../data/category/level three/womenLevelThree";
import { colors } from "../../../data/Filter/color";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { getSellerToken } from "../../../util/authToken";
import { electronicsLevelThree } from "../../../data/category/level three/electronicsLevelThree";
import { electronicsLevelTwo } from "../../../data/category/level two/electronicsLavelTwo";
import { furnitureLevelTwo } from "../../../data/category/level two/furnitureLevleTwo";
import { furnitureLevelThree } from "../../../data/category/level three/furnitureLevelThree";

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
  title: Yup.string().min(5, "Title should be at least 5 characters long").required("Title is required"),
  description: Yup.string().min(10, "Description should be at least 10 characters long").required("Description is required"),
  price: Yup.number().positive("Price should be greater than zero").required("Price is required"),
  discountedPrice: Yup.number().positive("Discounted Price should be greater than zero").required("Discounted Price is required"),
  discountPercent: Yup.number().positive("Discount Percent should be greater than zero").required("Discount Percent is required"),
  quantity: Yup.number().positive("Quantity should be greater than zero").required("Quantity is required"),
  color: Yup.string().required("Color is required"),
  category: Yup.string().required("Category is required"),
  sizes: Yup.string().required("Sizes are required"),
});

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
  display: 'flex', alignItems: 'center', gap: 8,
});

const SectionBody = styled('div')({ padding: '20px 18px' });

const FieldLabel = styled(Typography)({
  fontSize: '13px', fontWeight: 700, color: AMZ.text,
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  marginBottom: '4px',
  display: 'flex', alignItems: 'center', gap: 4,
});

const RequiredStar = styled('span')({ color: AMZ.red, fontWeight: 700 });

const AmazonField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '3px', fontSize: '13px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    background: '#fff',
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
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    background: '#fff',
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

const SubmitBtn = styled(Button)({
  borderRadius: '3px', padding: '9px 20px',
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400, fontSize: '14px', textTransform: 'none',
  background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
  color: '#111', border: '1px solid #a88734', boxShadow: 'none',
  '&:hover': {
    background: 'linear-gradient(to bottom, #f5d78e, #eeb933)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
  },
  '&:disabled': { background: '#e9ecef', color: '#888', border: '1px solid #ccc' },
});

const FieldRow = ({ label, required, children, hint }: any) => (
  <Box mb={2.5}>
    <FieldLabel>
      {label} {required && <RequiredStar>*</RequiredStar>}
      {hint && <Tooltip title={hint}><InfoOutlinedIcon sx={{ fontSize: 14, color: AMZ.textMuted, cursor: 'help' }} /></Tooltip>}
    </FieldLabel>
    {children}
  </Box>
);

// Quick tooltip placeholder since we're not importing Tooltip above
const Tooltip = ({ title, children }: any) => children;

// ─── Component ────────────────────────────────────────────────────────────────

const ProductForm = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector(store => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "", description: "", mrpPrice: "", sellingPrice: "",
      quantity: "", color: "", images: [], category: "",
      category2: "", category3: "", sizes: "",
    },
    // validationSchema,
    onSubmit: (values) => {
      dispatch(createProduct({ request: values, jwt: getSellerToken() }));
      console.log(values);
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

  useEffect(() => {
    if (sellerProduct.productCreated || sellerProduct.error) setOpenSnackbar(true);
  }, [sellerProduct.productCreated, sellerProduct.error]);

  return (
    <PageWrap>
      {/* Top Bar */}
      <TopBar>
        <Typography sx={{ color: AMZ.orange, fontWeight: 700, fontSize: '20px', fontFamily: "'Helvetica Neue', Arial" }}>
          seller<span style={{ color: '#fff' }}>central</span>
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>Add a Product</Typography>
      </TopBar>

      <ContentWrap>
        {/* Breadcrumb */}
        <Box mb={2} mt={0.5}>
          <Typography sx={{ fontSize: '12px', color: AMZ.linkBlue, fontFamily: "'Helvetica Neue', Arial" }}>
            Inventory &rsaquo; <span style={{ color: AMZ.text }}>Add a Product</span>
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial", mb: 2 }}>
          Add a Product
        </Typography>

        <form onSubmit={formik.handleSubmit}>

          {/* ── Images ── */}
          <SectionCard elevation={0}>
            <SectionHeader>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
                Product Images
              </Typography>
            </SectionHeader>
            <SectionBody>
              <Typography sx={{ fontSize: '12px', color: AMZ.textMuted, mb: 2, fontFamily: "'Helvetica Neue', Arial" }}>
                Upload up to 9 images. First image will be the main image. Images must be at least 500px on the longest side.
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
                    <AmazonField
                      fullWidth id="title" name="title"
                      placeholder="Enter product name"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.touched.title && formik.errors.title}
                    />
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FieldRow label="Product description" required>
                    <AmazonField
                      fullWidth multiline rows={5}
                      id="description" name="description"
                      placeholder="Describe your product in detail. Good descriptions improve search results."
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </FieldRow>
                </Grid>
              </Grid>
            </SectionBody>
          </SectionCard>

          {/* ── Pricing & Details ── */}
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
                    <AmazonField
                      fullWidth id="mrp_price" name="mrpPrice" type="number"
                      placeholder="0.00"
                      value={formik.values.mrpPrice}
                      onChange={formik.handleChange}
                      error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                      helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                    />
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FieldRow label="Your selling price (₹)" required>
                    <AmazonField
                      fullWidth id="sellingPrice" name="sellingPrice" type="number"
                      placeholder="0.00"
                      value={formik.values.sellingPrice}
                      onChange={formik.handleChange}
                      error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                      helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                    />
                  </FieldRow>
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

          {/* ── Categories ── */}
          <SectionCard elevation={0}>
            <SectionHeader>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial" }}>
                Category
              </Typography>
            </SectionHeader>
            <SectionBody>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <FieldRow label="Main category" required>
                    <AmazonSelect fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                      <Select name="category" value={formik.values.category} onChange={formik.handleChange} displayEmpty>
                        <MenuItem value=""><em style={{ color: '#999', fontStyle: 'normal' }}>Select category</em></MenuItem>
                        {mainCategory.map(item => (
                          <MenuItem key={item.categoryId} value={item.categoryId} sx={{ fontSize: '13px', fontFamily: "'Helvetica Neue', Arial" }}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.category && formik.errors.category && <FormHelperText>{formik.errors.category}</FormHelperText>}
                    </AmazonSelect>
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <FieldRow label="Sub category">
                    <AmazonSelect fullWidth>
                      <Select name="category2" value={formik.values.category2} onChange={formik.handleChange} displayEmpty disabled={!formik.values.category}>
                        <MenuItem value=""><em style={{ color: '#999', fontStyle: 'normal' }}>Select sub-category</em></MenuItem>
                        {formik.values.category && categoryTwo[formik.values.category]?.map(item => (
                          <MenuItem key={item.categoryId} value={item.categoryId} sx={{ fontSize: '13px', fontFamily: "'Helvetica Neue', Arial" }}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </AmazonSelect>
                  </FieldRow>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                  <FieldRow label="Third category">
                    <AmazonSelect fullWidth>
                      <Select name="category3" value={formik.values.category3} onChange={formik.handleChange} displayEmpty disabled={!formik.values.category2}>
                        <MenuItem value=""><em style={{ color: '#999', fontStyle: 'normal' }}>Select third category</em></MenuItem>
                        {formik.values.category2 &&
                          childCategory(categoryThree[formik.values.category], formik.values.category2)?.map((item: any) => (
                            <MenuItem key={item.categoryId} value={item.categoryId} sx={{ fontSize: '13px', fontFamily: "'Helvetica Neue', Arial" }}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </AmazonSelect>
                  </FieldRow>
                </Grid>
              </Grid>
            </SectionBody>
          </SectionCard>

          {/* ── Actions ── */}
          <Box display="flex" gap={1.5} justifyContent="flex-end" mb={4}>
            <Button variant="outlined" sx={{ borderRadius: '3px', borderColor: AMZ.borderDark, color: AMZ.text, fontFamily: "'Helvetica Neue', Arial", fontSize: '13px', textTransform: 'none', height: '36px', px: 2.5, background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)', '&:hover': { background: 'linear-gradient(to bottom, #e7eaf0, #d9dce3)', borderColor: '#888', boxShadow: 'none' } }}>
              Cancel
            </Button>
            <SubmitBtn type="submit" disabled={sellerProduct.loading} sx={{ minWidth: 140 }}>
              {sellerProduct.loading
                ? <CircularProgress size={18} sx={{ color: '#333' }} />
                : 'Save and finish'}
            </SubmitBtn>
          </Box>
        </form>
      </ContentWrap>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={sellerProduct.error ? 'error' : 'success'} variant="filled"
          sx={{ width: '100%', fontFamily: "'Helvetica Neue', Arial", borderRadius: '3px' }}>
          {sellerProduct.error ? sellerProduct.error : 'Product created successfully'}
        </Alert>
      </Snackbar>
    </PageWrap>
  );
};

export default ProductForm;
