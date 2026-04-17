import { useCallback, useState } from 'react'
import { Alert, Snackbar } from '@mui/material'

const defaultAnchorOrigin = {
  vertical: 'top',
  horizontal: 'right',
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
  if (!feedback) return null

  return (
    <Snackbar
      open={feedback.open}
      autoHideDuration={feedback.autoHideDuration ?? 4200}
      onClose={onClose}
      anchorOrigin={feedback.anchorOrigin ?? defaultAnchorOrigin}
    >
      <Alert onClose={onClose} severity={feedback.severity || 'success'} variant="filled">
        {feedback.message}
      </Alert>
    </Snackbar>
  )
}

export default FormFeedbackToast
