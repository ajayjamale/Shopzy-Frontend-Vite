import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createDailyDiscount, getAllDailyDiscounts } from "../../../Redux Toolkit/Admin/DealSlice";
import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";

const modernTextField = {
  "& label.Mui-focused": { color: "#1E293B" },
  "& .MuiOutlinedInput-root": {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
    "&:hover fieldset": { borderColor: "#0F766E" },
    "&.Mui-focused fieldset": { borderColor: "#0F766E", borderWidth: 2 },
  },
  "& label": { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 13 },
  "& .MuiFormHelperText-root": { fontFamily: '"Manrope", Arial, sans-serif', fontSize: 11 },
};

interface Props {
  onSuccess?: () => void;
}

const CreateDealForm = ({ onSuccess }: Props) => {
  const { deal } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      redirectLink: "/products",
      discountPercent: 20,
      discountLabel: "",
      startDate: "",
      endDate: "",
      displayOrder: 0,
      highlighted: true,
      active: true,
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required"),
      imageUrl: Yup.string().trim().url("Enter a valid image URL").required("Image URL is required"),
      redirectLink: Yup.string().trim().required("Redirect link is required"),
      discountPercent: Yup.number()
        .typeError("Enter a valid number")
        .required("Discount is required")
        .min(1, "Discount must be at least 1%")
        .max(95, "Discount cannot exceed 95%"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string().required("End date is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        title: values.title.trim(),
        subtitle: values.subtitle.trim() || undefined,
        imageUrl: values.imageUrl.trim(),
        redirectLink: values.redirectLink.trim(),
        discountLabel: values.discountLabel.trim() || `${values.discountPercent}% OFF`,
      };

      const result = await dispatch(createDailyDiscount(payload));
      if (createDailyDiscount.fulfilled.match(result)) {
        dispatch(getAllDailyDiscounts());
        dispatch(fetchHomePageData());
        resetForm();
        onSuccess?.();
      }
    },
  });

  return (
    <Box
      sx={{
        width: 560,
        maxWidth: "94vw",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1E293B",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "3px solid #0F766E",
        }}
      >
        <LocalOfferIcon sx={{ color: "#0F766E", fontSize: 20 }} />
        <Typography
          sx={{ color: "#fff", fontFamily: '"Manrope", Arial, sans-serif', fontWeight: 700, fontSize: 15 }}
        >
          Create Daily Discount
        </Typography>
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 3, display: "grid", gap: 2 }}>
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

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
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
            label="Discount Label (optional)"
            value={formik.values.discountLabel}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. 30% OFF"
            sx={modernTextField}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
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

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.highlighted}
                onChange={(e) => formik.setFieldValue("highlighted", e.target.checked)}
              />
            }
            label="Highlighted"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.active}
                onChange={(e) => formik.setFieldValue("active", e.target.checked)}
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
          sx={{
            backgroundColor: "#0F766E",
            color: "#0F172A",
            fontFamily: '"Manrope", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            textTransform: "none",
            borderRadius: "20px",
            py: 1.2,
            border: "1px solid #0b5f59",
            "&:hover": { backgroundColor: "#0b5f59" },
            "&.Mui-disabled": { backgroundColor: "#d1e4e2", color: "#64748B" },
          }}
        >
          {deal.loading ? <CircularProgress size={22} sx={{ color: "#0F172A" }} /> : "Create Daily Discount"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateDealForm;
