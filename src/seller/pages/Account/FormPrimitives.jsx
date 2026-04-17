import { Button, Stack, TextField } from '@mui/material'
import { sellerInputSx, sellerPrimaryButtonSx } from '../../theme/sellerUi'
export const Field = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = 'text',
}) => (
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
)
export const SaveButton = ({ label = 'Save changes' }) => (
  <Stack sx={{ pt: 1 }}>
    <Button type="submit" variant="contained" fullWidth sx={sellerPrimaryButtonSx}>
      {label}
    </Button>
  </Stack>
)
