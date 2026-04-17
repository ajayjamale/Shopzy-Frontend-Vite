import React from 'react'
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  SellerEmptyState,
  SellerStatusChip,
  formatSellerCurrency,
  formatSellerDate,
  humanizeSellerValue,
  sellerSecondaryButtonSx,
  sellerTableCellSx,
  sellerTableHeadCellSx,
} from '../../theme/sellerUi'
const toneForStatus = (status) => {
  if (status === 'COMPLETED') return 'success'
  if (status === 'FAILED' || status === 'CANCELLED') return 'danger'
  if (status === 'PENDING' || status === 'ON_HOLD') return 'warning'
  if (status === 'PROCESSING' || status === 'ELIGIBLE') return 'info'
  return 'default'
}
const SettlementTable = ({ items, loading, error, onRetry }) => {
  const navigate = useNavigate()
  if (!items.length && !loading) {
    return (
      <SellerEmptyState
        title={error ? 'Unable to load settlements' : 'No settlements available'}
        description={
          error || 'Settlement records will appear here as orders become eligible for payout.'
        }
        action={
          onRetry ? (
            <Button variant="outlined" sx={sellerSecondaryButtonSx} onClick={onRetry}>
              Retry
            </Button>
          ) : null
        }
      />
    )
  }
  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 980 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={sellerTableHeadCellSx}>Settlement</TableCell>
              <TableCell sx={sellerTableHeadCellSx}>Order</TableCell>
              <TableCell sx={sellerTableHeadCellSx} align="right">
                Gross
              </TableCell>
              <TableCell sx={sellerTableHeadCellSx} align="right">
                Deductions
              </TableCell>
              <TableCell sx={sellerTableHeadCellSx} align="right">
                Net
              </TableCell>
              <TableCell sx={sellerTableHeadCellSx}>Status</TableCell>
              <TableCell sx={sellerTableHeadCellSx} align="right">
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={sellerTableCellSx}>
                  <Typography sx={{ fontWeight: 800 }}>#{item.id}</Typography>
                  <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                    {item.transactionId || 'No transaction id'}
                  </Typography>
                </TableCell>
                <TableCell sx={sellerTableCellSx}>
                  <Typography sx={{ fontWeight: 800 }}>Order #{item.orderId}</Typography>
                  <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.4 }}>
                    {item.orderReference || 'Reference not available'}
                  </Typography>
                </TableCell>
                <TableCell sx={sellerTableCellSx} align="right">
                  <Typography sx={{ fontWeight: 800 }}>
                    {formatSellerCurrency(item.grossAmount)}
                  </Typography>
                </TableCell>
                <TableCell sx={sellerTableCellSx} align="right">
                  <Stack spacing={0.4} alignItems="flex-end">
                    <Typography sx={{ fontSize: '.82rem', color: '#64748B' }}>
                      Commission {formatSellerCurrency(item.commissionAmount)}
                    </Typography>
                    <Typography sx={{ fontSize: '.82rem', color: '#64748B' }}>
                      Platform {formatSellerCurrency(item.platformFee)}
                    </Typography>
                    {item.taxAmount !== undefined ? (
                      <Typography sx={{ fontSize: '.82rem', color: '#64748B' }}>
                        Tax {formatSellerCurrency(item.taxAmount)}
                      </Typography>
                    ) : null}
                  </Stack>
                </TableCell>
                <TableCell sx={sellerTableCellSx} align="right">
                  <Typography sx={{ fontWeight: 900, color: '#0F766E' }}>
                    {formatSellerCurrency(item.netSettlementAmount)}
                  </Typography>
                </TableCell>
                <TableCell sx={sellerTableCellSx}>
                  <SellerStatusChip
                    label={humanizeSellerValue(item.settlementStatus)}
                    tone={toneForStatus(item.settlementStatus)}
                    small
                  />
                </TableCell>
                <TableCell sx={sellerTableCellSx} align="right">
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatSellerDate(item.settlementDate || item.createdAt)}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate(`/seller/settlements/${item.id}`)}
                    sx={{ mt: 0.8, fontWeight: 800 }}
                  >
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
export default SettlementTable
