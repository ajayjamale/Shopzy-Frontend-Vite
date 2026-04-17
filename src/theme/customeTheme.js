import { createTheme } from '@mui/material/styles'
const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      dark: '#0B5F59',
      light: '#14B8A6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1E293B',
      dark: '#0F172A',
      light: '#334155',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#15803D',
    },
    error: {
      main: '#BE123C',
    },
    warning: {
      main: '#D97706',
    },
    background: {
      default: '#F3F7F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#DCE5E8',
  },
  typography: {
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    h1: { fontFamily: "'Fraunces', serif", fontWeight: 700 },
    h2: { fontFamily: "'Fraunces', serif", fontWeight: 700 },
    h3: { fontFamily: "'Fraunces', serif", fontWeight: 700 },
    h4: { fontFamily: "'Fraunces', serif", fontWeight: 700 },
    h5: { fontFamily: "'Fraunces', serif", fontWeight: 700 },
    h6: { fontFamily: "'Fraunces', serif", fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(circle at 12% -4%, rgba(20,184,166,0.12), transparent 40%), radial-gradient(circle at 90% 0%, rgba(30,41,59,0.1), transparent 38%)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#475569',
          fontWeight: 700,
          fontSize: '0.82rem',
          letterSpacing: '0.02em',
          '&.Mui-focused': {
            color: '#0F766E',
          },
          '&.Mui-error': {
            color: '#BE123C',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#475569',
          fontWeight: 700,
          fontSize: '0.82rem',
          '&.Mui-focused': {
            color: '#0F766E',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 6,
          marginLeft: 0,
          marginRight: 0,
          fontSize: '0.74rem',
          fontWeight: 600,
          color: '#64748B',
          '&.Mui-error': {
            color: '#BE123C',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.92rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: '1px solid #E2EAED',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2EAED',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #DCE5E8',
          overflow: 'hidden',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.07)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, #F6FAFB 0%, #EDF4F6 100%)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:nth-of-type(even)': {
            backgroundColor: '#FBFEFF',
          },
          '&:hover': {
            backgroundColor: 'rgba(15, 118, 110, 0.05)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#0F172A',
          backgroundColor: 'transparent',
          borderBottom: '1px solid #DCE5E8',
          fontSize: '0.74rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          paddingTop: 14,
          paddingBottom: 14,
        },
        body: {
          color: '#1E293B',
          fontWeight: 600,
          fontSize: '0.83rem',
          borderBottom: '1px solid #E8EFF2',
          paddingTop: 14,
          paddingBottom: 14,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          minHeight: 42,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D4E0E4',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9EB9BE',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0F766E',
            borderWidth: 1.6,
          },
        },
        input: {
          paddingTop: 11,
          paddingBottom: 11,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '0.9rem',
          fontWeight: 600,
        },
        icon: {
          color: '#64748B',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.87rem',
          fontWeight: 600,
          minHeight: 38,
          '&.Mui-selected': {
            backgroundColor: 'rgba(15, 118, 110, 0.12)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(15, 118, 110, 0.16)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          letterSpacing: '0.02em',
        },
      },
    },
  },
})
export default customTheme
