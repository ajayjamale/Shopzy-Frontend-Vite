import { alpha } from '@mui/material/styles'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
export const sellerPalette = {
  page: '#F3F7F8',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FBFC',
  border: '#DCE8EC',
  borderStrong: '#C7D8DD',
  text: '#0F172A',
  muted: '#64748B',
  subtle: '#94A3B8',
  accent: '#0F766E',
  accentDark: '#0B5F59',
  info: '#0E7490',
  success: '#15803D',
  warning: '#D97706',
  danger: '#BE123C',
}
const toneMap = {
  default: {
    text: sellerPalette.text,
    border: sellerPalette.borderStrong,
    bg: sellerPalette.surfaceSoft,
  },
  accent: {
    text: sellerPalette.accent,
    border: alpha(sellerPalette.accent, 0.22),
    bg: alpha(sellerPalette.accent, 0.1),
  },
  info: {
    text: sellerPalette.info,
    border: alpha(sellerPalette.info, 0.22),
    bg: alpha(sellerPalette.info, 0.1),
  },
  success: {
    text: sellerPalette.success,
    border: alpha(sellerPalette.success, 0.22),
    bg: alpha(sellerPalette.success, 0.1),
  },
  warning: {
    text: sellerPalette.warning,
    border: alpha(sellerPalette.warning, 0.24),
    bg: alpha(sellerPalette.warning, 0.11),
  },
  danger: {
    text: sellerPalette.danger,
    border: alpha(sellerPalette.danger, 0.2),
    bg: alpha(sellerPalette.danger, 0.1),
  },
}
export const sellerPrimaryButtonSx = {
  borderRadius: '12px',
  px: 1.8,
  py: 1,
  fontWeight: 800,
  fontSize: '.8rem',
  boxShadow: '0 10px 24px rgba(15, 118, 110, 0.16)',
  bgcolor: sellerPalette.accent,
  '&:hover': {
    bgcolor: sellerPalette.accentDark,
    boxShadow: '0 12px 28px rgba(15, 118, 110, 0.22)',
  },
}
export const sellerSecondaryButtonSx = {
  borderRadius: '12px',
  px: 1.8,
  py: 1,
  fontWeight: 800,
  fontSize: '.8rem',
  color: sellerPalette.text,
  borderColor: sellerPalette.border,
  bgcolor: sellerPalette.surface,
  '&:hover': {
    borderColor: sellerPalette.borderStrong,
    bgcolor: sellerPalette.surfaceSoft,
  },
}
export const sellerDangerButtonSx = {
  borderRadius: '12px',
  px: 1.8,
  py: 1,
  fontWeight: 800,
  fontSize: '.8rem',
  color: sellerPalette.danger,
  borderColor: alpha(sellerPalette.danger, 0.22),
  bgcolor: alpha(sellerPalette.danger, 0.08),
  '&:hover': {
    borderColor: alpha(sellerPalette.danger, 0.32),
    bgcolor: alpha(sellerPalette.danger, 0.12),
  },
}
export const sellerInputSx = {
  minWidth: 180,
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: sellerPalette.surface,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: sellerPalette.border,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: sellerPalette.borderStrong,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: sellerPalette.accent,
      borderWidth: 1.4,
    },
  },
}
export const sellerTableCellSx = {
  color: sellerPalette.text,
  fontWeight: 600,
  borderBottom: `1px solid ${sellerPalette.border}`,
}
export const sellerTableHeadCellSx = {
  color: sellerPalette.muted,
  fontWeight: 800,
  fontSize: '.72rem',
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  borderBottom: `1px solid ${sellerPalette.border}`,
  backgroundColor: alpha(sellerPalette.info, 0.04),
}
export const humanizeSellerValue = (value) => {
  if (!value) return 'Not provided'
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
export const formatSellerCurrency = (value) =>
  `Rs. ${Number(value ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
export const formatSellerDate = (value, options) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}
export const formatSellerDateTime = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
export const SellerStatusChip = ({ label, tone = 'default', small = false }) => {
  const colors = toneMap[tone]
  return (
    <Chip
      label={label}
      size={small ? 'small' : 'medium'}
      sx={{
        alignSelf: 'flex-start',
        borderRadius: '10px',
        fontWeight: 800,
        letterSpacing: '0.03em',
        color: colors.text,
        bgcolor: colors.bg,
        border: `1px solid ${colors.border}`,
        '& .MuiChip-label': {
          px: small ? 1.1 : 1.4,
        },
      }}
    />
  )
}
export const SellerPageIntro = ({ eyebrow, title, description, actions }) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', md: 'center' }}
    spacing={2}
    sx={{ mb: 2.5 }}
  >
    <Box>
      {eyebrow ? (
        <Typography
          sx={{
            color: sellerPalette.accent,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            fontSize: '.7rem',
            mb: 0.8,
          }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h4" sx={{ fontSize: { xs: '1.45rem', md: '1.8rem' }, lineHeight: 1.08 }}>
        {title}
      </Typography>
      {description ? (
        <Typography sx={{ color: sellerPalette.muted, mt: 0.8, maxWidth: 720 }}>
          {description}
        </Typography>
      ) : null}
    </Box>

    {actions ? (
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {actions}
      </Stack>
    ) : null}
  </Stack>
)
export const SellerSection = ({ title, description, action, children, padded = true }) => (
  <Paper
    sx={{
      borderRadius: '14px',
      overflow: 'hidden',
      border: `1px solid ${sellerPalette.border}`,
      boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
      background: sellerPalette.surface,
    }}
  >
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'center' }}
      sx={{
        px: 2.4,
        py: 2,
        borderBottom: `1px solid ${sellerPalette.border}`,
        background: `linear-gradient(180deg, ${alpha(sellerPalette.info, 0.05)} 0%, ${alpha(sellerPalette.accent, 0.02)} 100%)`,
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: sellerPalette.text }}>
          {title}
        </Typography>
        {description ? (
          <Typography sx={{ fontSize: '.86rem', color: sellerPalette.muted, mt: 0.4 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action}
    </Stack>

    <Box sx={{ p: padded ? 2.4 : 0 }}>{children}</Box>
  </Paper>
)
export const SellerMetricCard = ({ label, value, helper, tone = 'default', icon }) => {
  const colors = toneMap[tone]
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: '12px',
        border: `1px solid ${sellerPalette.border}`,
        background: sellerPalette.surface,
        boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box>
          <Typography
            sx={{
              color: sellerPalette.muted,
              fontSize: '.74rem',
              fontWeight: 800,
              letterSpacing: '.09em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Typography>
          <Typography sx={{ fontSize: '1.65rem', fontWeight: 900, color: colors.text, mt: 1 }}>
            {value}
          </Typography>
          {helper ? (
            <Typography sx={{ fontSize: '.8rem', color: sellerPalette.muted, mt: 0.8 }}>
              {helper}
            </Typography>
          ) : null}
        </Box>

        {icon ? (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        ) : null}
      </Stack>
    </Paper>
  )
}
export const SellerEmptyState = ({ title, description, action }) => (
  <Stack
    spacing={1.2}
    alignItems="center"
    justifyContent="center"
    sx={{
      py: 6,
      px: 2,
      textAlign: 'center',
      borderRadius: '12px',
      border: `1px dashed ${sellerPalette.borderStrong}`,
      bgcolor: alpha(sellerPalette.info, 0.03),
    }}
  >
    <Typography sx={{ fontWeight: 800, color: sellerPalette.text }}>{title}</Typography>
    {description ? (
      <Typography sx={{ color: sellerPalette.muted, maxWidth: 460 }}>{description}</Typography>
    ) : null}
    {action}
  </Stack>
)
export const SellerKeyValue = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1.2 }}>
    <Typography sx={{ color: sellerPalette.muted, fontSize: '.88rem' }}>{label}</Typography>
    <Typography sx={{ color: sellerPalette.text, fontWeight: 700, textAlign: 'right' }}>
      {value ?? 'Not provided'}
    </Typography>
  </Stack>
)
