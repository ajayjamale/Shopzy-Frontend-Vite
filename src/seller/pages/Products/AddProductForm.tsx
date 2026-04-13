import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../store";
import { createProduct } from "../../../store/seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../utils/uploadToCloudnary";
import { getSellerToken } from "../../../utils/authToken";
import { mainCategory } from "../../../data/category/mainCategory";
import { menLevelTwo } from "../../../data/category/level two/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/level two/womenLevelTwo";
import { furnitureLevelTwo } from "../../../data/category/level two/furnitureLevleTwo";
import { electronicsLevelTwo } from "../../../data/category/level two/electronicsLavelTwo";
import { menLevelThree } from "../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../data/category/level three/womenLevelThree";
import { furnitureLevelThree } from "../../../data/category/level three/furnitureLevelThree";
import { electronicsLevelThree } from "../../../data/category/level three/electronicsLevelThree";
import { colors } from "../../../data/Filter/color";

const categoryLevelTwo: { [key: string]: any[] } = {
  men: menLevelTwo,
  women: womenLevelTwo,
  home_furniture: furnitureLevelTwo,
  electronics: electronicsLevelTwo,
  beauty: [],
  kids: [],
};

const categoryLevelThree: { [key: string]: any[] } = {
  men: menLevelThree,
  women: womenLevelThree,
  home_furniture: furnitureLevelThree,
  electronics: electronicsLevelThree,
  beauty: [],
  kids: [],
};

const schema = Yup.object({
  title: Yup.string().min(5, "Title should have at least 5 characters").required("Title is required"),
  description: Yup.string().min(10, "Description should have at least 10 characters").required("Description is required"),
  brand: Yup.string().min(2, "Brand should have at least 2 characters").required("Brand is required"),
  mrpPrice: Yup.number().typeError("MRP is required").positive("MRP must be positive").required("MRP is required"),
  sellingPrice: Yup.number()
    .typeError("Selling price is required")
    .positive("Selling price must be positive")
    .required("Selling price is required"),
  quantity: Yup.number().typeError("Quantity is required").integer("Quantity must be a whole number").min(1, "Quantity must be at least 1").required("Quantity is required"),
  color: Yup.string().required("Color is required"),
  sizes: Yup.string().required("Size is required"),
  category: Yup.string().required("Main category is required"),
});

const ProductForm = () => {
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      brand: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: "",
      color: "",
      sizes: "",
      images: [] as string[],
      category: "",
      category2: "",
      category3: "",
    },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      const mrp = Number(values.mrpPrice);
      const selling = Number(values.sellingPrice);
      const discountPercent = mrp > 0 && mrp > selling ? Math.round(((mrp - selling) / mrp) * 100) : 0;

      const payload = {
        ...values,
        mrpPrice: mrp,
        sellingPrice: selling,
        quantity: Number(values.quantity),
        discountPercent,
      };

      const result = await dispatch(
        createProduct({
          request: payload,
          jwt: getSellerToken(),
        })
      );

      setSnackbarOpen(true);
      if (createProduct.fulfilled.match(result)) {
        helpers.resetForm();
      }
    },
  });

  const secondLevelOptions = useMemo(
    () => (formik.values.category ? categoryLevelTwo[formik.values.category] || [] : []),
    [formik.values.category]
  );

  const thirdLevelOptions = useMemo(() => {
    if (!formik.values.category || !formik.values.category2) return [];
    return (categoryLevelThree[formik.values.category] || []).filter(
      (item: any) => item.parentCategoryId == formik.values.category2
    );
  }, [formik.values.category, formik.values.category2]);

  const discountPreview = useMemo(() => {
    const mrp = Number(formik.values.mrpPrice);
    const selling = Number(formik.values.sellingPrice);
    if (!(mrp > 0) || !(selling >= 0) || mrp <= selling) return 0;
    return Math.round(((mrp - selling) / mrp) * 100);
  }, [formik.values.mrpPrice, formik.values.sellingPrice]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, imageUrl]);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const next = [...formik.values.images];
    next.splice(index, 1);
    formik.setFieldValue("images", next);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1300, mx: "auto" }}>
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" spacing={1} mb={2.5}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.4rem", md: "1.8rem" } }}>
            Add Product
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.6 }}>
            Publish a new catalog listing with pricing, inventory, media, and category mapping.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Inventory2RoundedIcon sx={{ color: "primary.main" }} />
          <Typography sx={{ fontWeight: 700, color: "text.secondary", fontSize: ".85rem" }}>
            Seller Catalog
          </Typography>
        </Stack>
      </Stack>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
          alignItems: "start",
        }}
      >
        <Stack spacing={2}>
          <Paper sx={{ p: 2.2 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <SellRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800 }}>Basic Details</Typography>
            </Stack>
            <Stack spacing={1.5}>
              <TextField
                label="Product title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.title && formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
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
                minRows={4}
                fullWidth
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
              />
            </Stack>
          </Paper>

          <Paper sx={{ p: 2.2 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <Inventory2RoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800 }}>Pricing & Inventory</Typography>
            </Stack>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
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
              />
              <Paper
                variant="outlined"
                sx={{
                  px: 1.5,
                  py: 1.2,
                  borderRadius: "12px",
                  borderColor: discountPreview > 0 ? "success.main" : "divider",
                  bgcolor: discountPreview > 0 ? "rgba(21,128,61,0.08)" : "rgba(15,118,110,0.04)",
                }}
              >
                <Typography sx={{ fontSize: ".74rem", fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: ".07em" }}>
                  Live Discount
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: discountPreview > 0 ? "success.main" : "text.primary" }}>
                  {discountPreview > 0 ? `-${discountPreview}%` : "0%"}
                </Typography>
                <Typography sx={{ fontSize: ".75rem", color: "text.secondary" }}>
                  Auto-calculated at submit
                </Typography>
              </Paper>
            </Box>
          </Paper>

          <Paper sx={{ p: 2.2 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <CategoryRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800 }}>Attributes & Categories</Typography>
            </Stack>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <FormControl error={Boolean(formik.touched.color && formik.errors.color)}>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  labelId="color-label"
                  label="Color"
                  name="color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                >
                  {colors.map((color) => (
                    <MenuItem key={color.name} value={color.name}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: color.hex, border: "1px solid #d1d5db" }} />
                        <span>{color.name}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.touched.color && formik.errors.color}</FormHelperText>
              </FormControl>

              <FormControl error={Boolean(formik.touched.sizes && formik.errors.sizes)}>
                <InputLabel id="size-label">Size</InputLabel>
                <Select
                  labelId="size-label"
                  label="Size"
                  name="sizes"
                  value={formik.values.sizes}
                  onChange={formik.handleChange}
                >
                  {["FREE", "S", "M", "L", "XL"].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.touched.sizes && formik.errors.sizes}</FormHelperText>
              </FormControl>

              <FormControl error={Boolean(formik.touched.category && formik.errors.category)}>
                <InputLabel id="cat1-label">Main category</InputLabel>
                <Select
                  labelId="cat1-label"
                  label="Main category"
                  name="category"
                  value={formik.values.category}
                  onChange={(event) => {
                    formik.setFieldValue("category", event.target.value);
                    formik.setFieldValue("category2", "");
                    formik.setFieldValue("category3", "");
                  }}
                >
                  {mainCategory.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.touched.category && formik.errors.category}</FormHelperText>
              </FormControl>

              <FormControl>
                <InputLabel id="cat2-label">Second category</InputLabel>
                <Select
                  labelId="cat2-label"
                  label="Second category"
                  name="category2"
                  value={formik.values.category2}
                  onChange={(event) => {
                    formik.setFieldValue("category2", event.target.value);
                    formik.setFieldValue("category3", "");
                  }}
                  disabled={!formik.values.category}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {secondLevelOptions.map((item: any) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}>
                <InputLabel id="cat3-label">Third category</InputLabel>
                <Select
                  labelId="cat3-label"
                  label="Third category"
                  name="category3"
                  value={formik.values.category3}
                  onChange={formik.handleChange}
                  disabled={!formik.values.category2}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {thirdLevelOptions.map((item: any) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Stack>

        <Stack spacing={2} sx={{ position: { lg: "sticky" }, top: { lg: 90 } }}>
          <Paper sx={{ p: 2.2 }}>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Media Uploads</Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={uploading ? <CircularProgress size={14} /> : <AddPhotoAlternateOutlinedIcon />}
              disabled={uploading}
              sx={{ borderStyle: "dashed", py: 1.1 }}
            >
              {uploading ? "Uploading..." : "Add product image"}
              <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
            </Button>

            <Box sx={{ mt: 1.5, display: "grid", gap: 1, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              {formik.values.images.map((image, index) => (
                <Box key={`${image}-${index}`} sx={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #dbe7ea", aspectRatio: "1 / 1" }}>
                  <img src={image} alt={`product-${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeImage(index)}
                    sx={{
                      minWidth: 0,
                      width: 24,
                      height: 24,
                      p: 0,
                      borderRadius: "50%",
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                  </Button>
                </Box>
              ))}
              {!formik.values.images.length && (
                <Box sx={{ gridColumn: "1 / -1", p: 1.2, borderRadius: "10px", border: "1px dashed #cadce0", bgcolor: "rgba(15,118,110,0.03)" }}>
                  <Typography sx={{ fontSize: ".78rem", color: "text.secondary" }}>
                    Upload at least one clear image for better conversion.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 2.2 }}>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Listing Summary</Typography>
            <Stack spacing={1}>
              <Row label="Title" value={formik.values.title || "-"} />
              <Row label="Brand" value={formik.values.brand || "-"} />
              <Row label="Price" value={formik.values.sellingPrice ? `Rs. ${formik.values.sellingPrice}` : "-"} />
              <Row label="MRP" value={formik.values.mrpPrice ? `Rs. ${formik.values.mrpPrice}` : "-"} />
              <Row label="Discount" value={discountPreview > 0 ? `${discountPreview}%` : "0%"} />
              <Row label="Inventory" value={formik.values.quantity || "0"} />
              <Row label="Images" value={String(formik.values.images.length)} />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={sellerProduct.loading || uploading}
              sx={{ mt: 2, py: 1.1 }}
            >
              {sellerProduct.loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Create Product"}
            </Button>
          </Paper>
        </Stack>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={sellerProduct.error ? "error" : "success"} variant="filled">
          {sellerProduct.error || "Product created successfully"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.7, borderBottom: "1px solid #edf3f5" }}>
    <Typography sx={{ color: "text.secondary", fontSize: ".82rem" }}>{label}</Typography>
    <Typography sx={{ fontWeight: 700, fontSize: ".86rem", color: "text.primary" }}>{value}</Typography>
  </Stack>
);

export default ProductForm;
