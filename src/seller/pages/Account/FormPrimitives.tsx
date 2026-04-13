import { Button, Stack, TextField } from "@mui/material";
import type React from "react";
import { sellerInputSx, sellerPrimaryButtonSx } from "../../theme/sellerUi";

export interface FieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: boolean;
  helperText?: string | false;
  type?: string;
}

export const Field = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = "text",
}: FieldProps) => (
  <TextField
    id={id}
    name={name}
    type={type}
    label={label}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    error={error}
    helperText={helperText}
    fullWidth
    size="small"
    sx={sellerInputSx}
  />
);

export const SaveButton = ({ label = "Save changes" }: { label?: string }) => (
  <Stack sx={{ pt: 1 }}>
    <Button type="submit" variant="contained" fullWidth sx={sellerPrimaryButtonSx}>
      {label}
    </Button>
  </Stack>
);
