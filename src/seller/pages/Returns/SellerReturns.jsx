import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import {
  clearReturnError,
  fetchReturnRequests,
  updateReturnStatus,
} from '../../../store/customer/ReturnSlice'
import { fetchSellerOrders } from '../../../store/seller/sellerOrderSlice'
import { fetchSellerReport } from '../../../store/seller/sellerSlice'
import { useAppDispatch, useAppSelector } from '../../../store'
import { getSellerToken } from '../../../utils/authToken'
import {
  SellerEmptyState,
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  SellerStatusChip,
  formatSellerDateTime,
  humanizeSellerValue,
  sellerInputSx,
  sellerTableCellSx,
  sellerTableHeadCellSx,
} from '../../theme/sellerUi'
const ALL_STATUSES = [
  'REQUESTED',
  'APPROVED',
  'REJECTED',
  'PICKUP_SCHEDULED',
  'RECEIVED',
  'REFUND_INITIATED',
  'REFUNDED',
]
const toneForStatus = (status) => {
  if (status === 'REFUNDED') return 'success'
  if (status === 'REJECTED') return 'danger'
  if (status === 'REQUESTED' || status === 'PICKUP_SCHEDULED') return 'warning'
  if (status === 'APPROVED' || status === 'RECEIVED' || status === 'REFUND_INITIATED') return 'info'
  return 'default'
}
const SellerReturns = () => {
  const dispatch = useAppDispatch()
  const { returns } = useAppSelector((state) => state)
  const jwt = useMemo(() => getSellerToken(), [])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const syncSellerData = useCallback(() => {
    if (!jwt) return
    dispatch(fetchReturnRequests({ jwt }))
    dispatch(fetchSellerOrders(jwt))
    dispatch(fetchSellerReport(jwt))
  }, [dispatch, jwt])
  useEffect(() => {
    if (!jwt) return
    syncSellerData()
    const refreshOnFocus = () => syncSellerData()
    const intervalId = window.setInterval(syncSellerData, 30000)
    window.addEventListener('focus', refreshOnFocus)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', refreshOnFocus)
      dispatch(clearReturnError())
    }
  }, [dispatch, jwt, syncSellerData])
  const rows = useMemo(() => {
    return returns.requests.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return [item.id, item.orderId, item.orderItemId, item.reason, item.description, item.status]
        .map((value) => String(value ?? '').toLowerCase())
        .some((value) => value.includes(q))
    })
  }, [query, returns.requests, statusFilter])
  const handleStatusUpdate = async (id, current, next) => {
    if (!id || !jwt || current === next) return
    try {
      await dispatch(updateReturnStatus({ jwt, id, status: next })).unwrap()
      syncSellerData()
    } catch {
      // Error is handled in slice state.
    }
  }
  const requested = returns.requests.filter((item) => item.status === 'REQUESTED').length
  const approved = returns.requests.filter(
    (item) => item.status === 'APPROVED' || item.status === 'PICKUP_SCHEDULED',
  ).length
  const refunded = returns.requests.filter((item) => item.status === 'REFUNDED').length
  const refundInProgress = returns.requests.filter(
    (item) => item.status === 'RECEIVED' || item.status === 'REFUND_INITIATED',
  ).length
  if (!jwt) {
    return (
      <SellerEmptyState
        title="Seller session missing"
        description="Please log in again to review and manage return requests."
      />
    )
  }
  return (
    <Box>
      <SellerPageIntro
        eyebrow="After-sales"
        title="Returns queue"
        description="Track buyer return requests, decide next status changes, and keep refund progress visible without digging through raw records."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <SellerMetricCard
          label="All requests"
          value={returns.requests.length.toLocaleString('en-IN')}
          helper="Return records in the seller workspace"
          tone="accent"
          icon={<ReplayRoundedIcon />}
        />
        <SellerMetricCard
          label="Awaiting review"
          value={requested.toLocaleString('en-IN')}
          helper="New requests still in requested state"
          tone="warning"
          icon={<PendingActionsRoundedIcon />}
        />
        <SellerMetricCard
          label="Approved / pickup"
          value={approved.toLocaleString('en-IN')}
          helper="Items already accepted into the return flow"
          tone="info"
          icon={<CheckCircleRoundedIcon />}
        />
        <SellerMetricCard
          label="Refund progress"
          value={`${refundInProgress} / ${refunded}`}
          helper="In progress versus fully refunded"
          tone="success"
          icon={<PaymentsRoundedIcon />}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <SellerSection
          title="Return request table"
          description="Filter by status and search by return id, order id, reason, or notes."
          padded={false}
        >
          {returns.loading ? <LinearProgress /> : null}

          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={1.5}
            sx={{ px: 2.4, py: 2, borderBottom: '1px solid #DCE8EC' }}
          >
            <TextField
              select
              size="small"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{ ...sellerInputSx, minWidth: 190 }}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              {ALL_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {humanizeSellerValue(status)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              placeholder="Search returns, orders, reasons, or status"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              sx={{ ...sellerInputSx, flex: 1, minWidth: 240 }}
            />
          </Stack>

          {returns.error ? (
            <Box sx={{ px: 2.4, pt: 2 }}>
              <Typography
                sx={{
                  borderRadius: '10px',
                  border: '1px solid rgba(190, 24, 93, 0.18)',
                  bgcolor: 'rgba(190, 24, 93, 0.08)',
                  color: '#BE123C',
                  px: 1.5,
                  py: 1.1,
                  fontWeight: 700,
                }}
              >
                {returns.error}
              </Typography>
            </Box>
          ) : null}

          {!rows.length && !returns.loading ? (
            <Box sx={{ p: 2.4 }}>
              <SellerEmptyState
                title="No return requests in this view"
                description="Broaden the filters or wait for new return activity to sync."
              />
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 1040 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={sellerTableHeadCellSx}>Return</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Order</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Reason</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Status</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Created</TableCell>
                    <TableCell sx={sellerTableHeadCellSx}>Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={sellerTableCellSx}>
                        <Typography sx={{ fontWeight: 800 }}>#{item.id}</Typography>
                        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                          Qty {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <Typography sx={{ fontWeight: 800 }}>Order #{item.orderId}</Typography>
                        <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                          Item #{item.orderItemId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <Typography sx={{ fontWeight: 800 }}>{item.reason}</Typography>
                        {item.description ? (
                          <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                            {item.description}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <SellerStatusChip
                          label={humanizeSellerValue(item.status)}
                          tone={toneForStatus(item.status)}
                          small
                        />
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatSellerDateTime(item.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={sellerTableCellSx}>
                        <Select
                          size="small"
                          value={item.status ?? 'REQUESTED'}
                          onChange={(event) =>
                            handleStatusUpdate(item.id, item.status, event.target.value)
                          }
                          sx={{ ...sellerInputSx, minWidth: 180 }}
                        >
                          {ALL_STATUSES.map((status) => (
                            <MenuItem key={status} value={status}>
                              {humanizeSellerValue(status)}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </SellerSection>
      </Box>
    </Box>
  )
}
export default SellerReturns
