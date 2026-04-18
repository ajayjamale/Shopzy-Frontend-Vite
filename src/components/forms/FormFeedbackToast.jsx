import { useCallback, useMemo, useState } from 'react'
import { Box, IconButton, Snackbar, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const defaultAnchorOrigin = {
  vertical: 'top',
  horizontal: 'right',
}

const toneBySeverity = {
  success: {
    label: 'Success',
    icon: CheckCircleRoundedIcon,
    surface: 'linear-gradient(140deg, #ecfdf7 0%, #d1fae5 100%)',
    border: '#6ee7b7',
    text: '#064e3b',
    subText: '#065f46',
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#047857',
  },
  error: {
    label: 'Action failed',
    icon: ErrorRoundedIcon,
    surface: 'linear-gradient(140deg, #fff1f2 0%, #ffe4e6 100%)',
    border: '#fda4af',
    text: '#881337',
    subText: '#9f1239',
    iconBg: 'rgba(244, 63, 94, 0.14)',
    iconColor: '#be123c',
  },
  warning: {
    label: 'Check this',
    icon: WarningAmberRoundedIcon,
    surface: 'linear-gradient(140deg, #fff7ed 0%, #ffedd5 100%)',
    border: '#fdba74',
    text: '#7c2d12',
    subText: '#9a3412',
    iconBg: 'rgba(249, 115, 22, 0.14)',
    iconColor: '#c2410c',
  },
  info: {
    label: 'Update',
    icon: InfoRoundedIcon,
    surface: 'linear-gradient(140deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#93c5fd',
    text: '#1e3a8a',
    subText: '#1d4ed8',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#1d4ed8',
  },
}

export const getAsyncActionError = (result, fallbackMessage) => {
  if (!result) return fallbackMessage

  if (typeof result.payload === 'string' && result.payload.trim()) {
    return result.payload
  }

  if (result.payload && typeof result.payload === 'object') {
    const payload = result.payload
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message
    }
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error
    }
  }

  if (typeof result.error?.message === 'string' && result.error.message.trim()) {
    return result.error.message
  }

  return fallbackMessage
}

export const useFormFeedback = (initial = {}) => {
  const [feedback, setFeedback] = useState({
    open: false,
    severity: 'success',
    message: '',
    autoHideDuration: initial.autoHideDuration ?? 4200,
    anchorOrigin: initial.anchorOrigin ?? defaultAnchorOrigin,
  })

  const closeFeedback = useCallback(() => {
    setFeedback((previous) => ({ ...previous, open: false }))
  }, [])

  const showFeedback = useCallback((severity, message, options = {}) => {
    setFeedback({
      open: true,
      severity,
      message,
      autoHideDuration: options.autoHideDuration ?? 4200,
      anchorOrigin: options.anchorOrigin ?? defaultAnchorOrigin,
    })
  }, [])

  const showSuccess = useCallback(
    (message, options) => showFeedback('success', message, options),
    [showFeedback],
  )

  const showError = useCallback(
    (message, options) => showFeedback('error', message, options),
    [showFeedback],
  )

  return {
    feedback,
    closeFeedback,
    showSuccess,
    showError,
  }
}

const FormFeedbackToast = ({ feedback, onClose }) => {
  const toast = useMemo(() => {
    if (feedback) {
      return {
        open: Boolean(feedback.open),
        severity: feedback.severity || 'success',
        message: feedback.message || '',
        title: feedback.title || '',
        autoHideDuration: feedback.autoHideDuration ?? 4200,
        anchorOrigin: feedback.anchorOrigin ?? defaultAnchorOrigin,
      }
    }

    return null
  }, [feedback])

  if (!toast?.message) return null

  const tone = toneBySeverity[toast.severity] || toneBySeverity.info
  const Icon = tone.icon

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    onClose?.(event, reason)
  }

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={toast.autoHideDuration}
      onClose={handleClose}
      anchorOrigin={toast.anchorOrigin}
    >
      <Box
        role="alert"
        aria-live="polite"
        sx={{
          width: {
            xs: 'min(92vw, 420px)',
            sm: 'min(440px, 100%)',
          },
          border: `1px solid ${tone.border}`,
          borderRadius: '14px',
          background: tone.surface,
          boxShadow: '0 16px 34px rgba(15, 23, 42, 0.18)',
          backdropFilter: 'blur(5px)',
          color: tone.text,
          px: 1.4,
          py: 1.15,
          display: 'grid',
          gap: 1.1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Box
            sx={{
              mt: 0.1,
              width: 26,
              height: 26,
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: tone.iconBg,
              color: tone.iconColor,
              flexShrink: 0,
            }}
          >
            <Icon
              sx={{
                fontSize: 17,
              }}
            />
          </Box>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Manrope", Arial, sans-serif',
                fontWeight: 800,
                fontSize: '.84rem',
                lineHeight: 1.3,
              }}
            >
              {toast.title || tone.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.3,
                fontFamily: '"Manrope", Arial, sans-serif',
                fontWeight: 600,
                fontSize: '.79rem',
                lineHeight: 1.5,
                color: tone.subText,
                wordBreak: 'break-word',
              }}
            >
              {toast.message}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="Close notification"
            sx={{
              mt: '-2px',
              color: tone.subText,
              p: '3px',
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: 16,
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Snackbar>
  )
}

export default FormFeedbackToast
