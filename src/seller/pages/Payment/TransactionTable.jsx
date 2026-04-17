import { useEffect, useMemo } from 'react'
import {
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import { useAppDispatch, useAppSelector } from '../../../store'
import { fetchTransactionsBySeller } from '../../../store/seller/transactionSlice'
import { getSellerToken } from '../../../utils/authToken'
import {
  SellerEmptyState,
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  formatSellerCurrency,
  formatSellerDateTime,
  sellerTableCellSx,
  sellerTableHeadCellSx,
} from '../../theme/sellerUi'
const TransactionTable = ({ embedded = false }) => {
  const dispatch = useAppDispatch()
  const { transaction } = useAppSelector((state) => state)
  useEffect(() => {
    const jwt = getSellerToken()
    if (!jwt) return
    dispatch(fetchTransactionsBySeller(jwt))
  }, [dispatch])
  const rows = transaction.transactions ?? []
  const totalAmount = useMemo(
    () => rows.reduce((sum, item) => sum + Number(item.order?.totalSellingPrice ?? 0), 0),
    [rows],
  )
  const tableBlock = (
    <>
      {transaction.loading ? <LinearProgress /> : null}

      {!rows.length && !transaction.loading ? (
        <Box sx={{ p: embedded ? 0 : 2.4 }}>
          <SellerEmptyState
            title={transaction.error ? 'Unable to load transactions' : 'No transactions yet'}
            description={
              transaction.error ||
              'New payment activity will appear here once customers complete purchases.'
            }
          />
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={sellerTableHeadCellSx}>Date</TableCell>
                <TableCell sx={sellerTableHeadCellSx}>Customer</TableCell>
                <TableCell sx={sellerTableHeadCellSx}>Order</TableCell>
                <TableCell sx={sellerTableHeadCellSx} align="right">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={sellerTableCellSx}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {formatSellerDateTime(item.date)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={sellerTableCellSx}>
                    <Typography sx={{ fontWeight: 800 }}>{item.customer.fullName}</Typography>
                    <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.3 }}>
                      {item.customer.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={sellerTableCellSx}>
                    <Typography sx={{ fontWeight: 800 }}>Order #{item.order.id}</Typography>
                    <Typography sx={{ fontSize: '.8rem', color: '#64748B', mt: 0.3 }}>
                      {item.order.totalItem} item{item.order.totalItem > 1 ? 's' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell sx={sellerTableCellSx} align="right">
                    <Typography sx={{ fontWeight: 900, color: '#0F766E' }}>
                      {formatSellerCurrency(item.order.totalSellingPrice)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
  if (embedded) {
    return <Box>{tableBlock}</Box>
  }
  return (
    <Box>
      <SellerPageIntro
        eyebrow="Finance"
        title="Transactions"
        description="Review customer payments and the order amounts they map to."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          mb: 2,
        }}
      >
        <SellerMetricCard
          label="Transactions"
          value={rows.length.toLocaleString('en-IN')}
          helper="Seller-side transaction records"
          tone="info"
          icon={<ReceiptLongRoundedIcon />}
        />
        <SellerMetricCard
          label="Processed value"
          value={formatSellerCurrency(totalAmount)}
          helper="Sum of captured order amounts"
          tone="accent"
          icon={<ReceiptLongRoundedIcon />}
        />
      </Box>

      <SellerSection
        title="Transaction history"
        description="Recent buyer payments and related order records."
        padded={false}
      >
        {tableBlock}
      </SellerSection>
    </Box>
  )
}
export default TransactionTable
