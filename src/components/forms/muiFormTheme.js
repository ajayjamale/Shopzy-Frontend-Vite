export const formTextFieldSx = {
  '& .MuiInputLabel-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 12,
    fontWeight: 700,
    color: '#475569',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 13,
    borderRadius: '12px',
    backgroundColor: '#fff',
    '&:hover fieldset': {
      borderColor: '#87aeb4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0F766E',
      borderWidth: 1.6,
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Manrope", Arial, sans-serif',
    fontSize: 11,
    marginTop: 0.4,
  },
}

export const formCardSx = {
  maxWidth: 700,
  backgroundColor: '#fff',
  border: '1px solid #DCE8EC',
  borderRadius: '14px',
  overflow: 'hidden',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
}

export const formHeaderSx = {
  background: 'linear-gradient(140deg, #0F172A 0%, #1E293B 55%, #0F766E 100%)',
  px: 3,
  py: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 1.4,
}

export const formHeaderIconSx = {
  color: '#99F6E4',
  fontSize: 20,
}

export const formHeaderTitleSx = {
  color: '#fff',
  fontFamily: '"Manrope", Arial, sans-serif',
  fontWeight: 800,
  fontSize: 15,
  letterSpacing: '0.01em',
}

export const formSectionNoteSx = {
  backgroundColor: '#F0FAF8',
  border: '1px solid #CBE7E2',
  borderRadius: '10px',
  px: 2,
  py: 1.2,
}

export const formSectionNoteTextSx = {
  fontSize: 12,
  color: '#0F4F4A',
  fontFamily: '"Manrope", Arial, sans-serif',
  lineHeight: 1.55,
}

export const formPrimaryButtonSx = {
  background: 'linear-gradient(130deg, #0F766E, #14B8A6)',
  color: '#fff',
  fontFamily: '"Manrope", Arial, sans-serif',
  fontWeight: 800,
  fontSize: 14,
  textTransform: 'none',
  borderRadius: '999px',
  py: 1.15,
  border: '1px solid #0b5f59',
  boxShadow: '0 10px 20px rgba(15, 118, 110, 0.22)',
  '&:hover': {
    background: 'linear-gradient(130deg, #0B5F59, #0F766E)',
    boxShadow: '0 12px 24px rgba(15, 118, 110, 0.26)',
  },
  '&.Mui-disabled': {
    background: '#D6ECE8',
    color: '#64748B',
    boxShadow: 'none',
  },
}
