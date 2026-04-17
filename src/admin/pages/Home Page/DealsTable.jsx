import React, { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { deleteDailyDiscount, updateDailyDiscountStatus } from '../../../store/admin/DealSlice'
import { fetchHomePageData } from '../../../store/customer/home/AsyncThunk'
import UpdateDealForm from './UpdateDealForm'
const DealsTable = () => {
  const { deal } = useAppSelector((store) => store)
  const dispatch = useAppDispatch()
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const allDiscounts = useMemo(
    () =>
      [...deal.discounts].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || (a.id ?? 0) - (b.id ?? 0),
      ),
    [deal.discounts],
  )
  const today = new Date().toISOString().slice(0, 10)
  const resolveLive = (item) => {
    if (item.active === false) return false
    if (!item.startDate || !item.endDate) return true
    return item.startDate <= today && item.endDate >= today
  }
  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return
    const result = await dispatch(deleteDailyDiscount(deleteTarget.id))
    setDeleteTarget(null)
    if (deleteDailyDiscount.fulfilled.match(result)) {
      dispatch(fetchHomePageData())
      setSnackbar({ open: true, message: 'Daily discount deleted', severity: 'success' })
    } else {
      setSnackbar({ open: true, message: 'Failed to delete daily discount', severity: 'error' })
    }
  }
  const toggleStatus = async (item) => {
    if (!item.id) return
    const result = await dispatch(updateDailyDiscountStatus({ id: item.id, active: !item.active }))
    if (updateDailyDiscountStatus.fulfilled.match(result)) {
      dispatch(fetchHomePageData())
      setSnackbar({
        open: true,
        message: `Discount ${item.active ? 'disabled' : 'enabled'}`,
        severity: 'success',
      })
    } else {
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' })
    }
  }
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid #DDE9ED',
          borderRadius: '10px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1E293B' }}>
              {['Preview', 'Title', 'Discount', 'Window', 'Flags', 'Status', 'Actions'].map(
                (head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      borderBottom: '3px solid #0F766E',
                    }}
                  >
                    {head}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {!deal.loading &&
              allDiscounts.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ width: 96 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 56,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid #E2ECEF',
                        bgcolor: '#EFF5F7',
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#64748B', mt: 0.5 }}>
                      {item.subtitle || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#0F766E' }}>
                      {item.discountLabel || `${item.discountPercent}% OFF`}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                      {item.discountPercent}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 12, color: '#0F172A' }}>
                      {item.startDate || '-'} to {item.endDate || '-'}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                      Order: {item.displayOrder ?? 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                      {item.highlighted && (
                        <Chip size="small" label="Highlighted" color="warning" />
                      )}
                      {resolveLive(item) && <Chip size="small" label="Live" color="success" />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={item.active ? 'Enabled' : 'Disabled'}
                      color={item.active ? 'success' : 'default'}
                      variant={item.active ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.7 }}>
                      <Tooltip title={item.active ? 'Disable' : 'Enable'}>
                        <IconButton size="small" onClick={() => toggleStatus(item)}>
                          {item.active ? (
                            <ToggleOnRoundedIcon sx={{ color: '#0F766E' }} />
                          ) : (
                            <ToggleOffRoundedIcon sx={{ color: '#94A3B8' }} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setEditTarget(item.id ?? null)}>
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {!deal.loading && allDiscounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ textAlign: 'center', py: 7 }}>
                    <LocalOfferIcon sx={{ fontSize: 42, color: '#CBD5E1', mb: 1.2 }} />
                    <Typography sx={{ color: '#64748B', fontWeight: 700 }}>
                      No daily discounts found.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {editTarget !== null && (
        <Modal open onClose={() => setEditTarget(null)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 620,
              maxWidth: '94vw',
              backgroundColor: '#fff',
              border: '1px solid #DDE9ED',
              borderRadius: '8px',
              boxShadow: '0 18px 46px rgba(15,23,42,.22)',
              p: 2.4,
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 800, mb: 1.2 }}>
              Update Daily Discount
            </Typography>
            <UpdateDealForm
              id={editTarget}
              onSuccess={() => {
                setEditTarget(null)
                setSnackbar({ open: true, message: 'Daily discount updated', severity: 'success' })
              }}
            />
          </Box>
        </Modal>
      )}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: '8px', border: '1px solid #DDE9ED' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Daily Discount</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{deleteTarget?.title || 'this daily discount'}</strong>? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbar.open}
        autoHideDuration={4200}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
export default DealsTable
