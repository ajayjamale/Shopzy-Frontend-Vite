import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Field, SaveButton } from "./FormPrimitives";
import type { UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";

const PersonalDetailsForm = ({ onClose }: UpdateDetailsFormProps) => {
  const { sellers } = useAppSelector((s) => s);
  const dispatch    = useAppDispatch();

  const formik = useFormik({
    initialValues: { sellerName: "", email: "", mobile: "" },
    validationSchema: Yup.object({
      sellerName: Yup.string().required("Seller name is required"),
      email:      Yup.string().email("Invalid email").required("Email is required"),
      mobile:     Yup.string().required("Mobile is required"),
    }),
    onSubmit: (values) => {
      dispatch(updateSeller(values));
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        sellerName: sellers.profile.sellerName ?? "",
        email:      sellers.profile.email      ?? "",
        mobile:     sellers.profile.mobile     ?? "",
      });
    }
  }, [sellers.profile]);

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field id="sellerName" name="sellerName" label="Seller Name"
        value={formik.values.sellerName} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
        helperText={formik.touched.sellerName && formik.errors.sellerName} />
      <Field id="email" name="email" label="Email" type="email"
        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email} />
      <Field id="mobile" name="mobile" label="Mobile"
        value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile && formik.errors.mobile} />
      <SaveButton />
    </form>
  );
};

export default PersonalDetailsForm;