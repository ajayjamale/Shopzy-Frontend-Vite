import React, { useEffect, useMemo, useState } from 'react'
import { Box, LinearProgress, MenuItem, TextField } from '@mui/material'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useAppDispatch, useAppSelector } from '../../../store'
import {
  fetchSettlementSummary,
  fetchSettlements,
  setSettlementFilters,
} from '../../../store/seller/settlementSlice'
import SettlementTable from './SettlementTable'
import { getSellerToken } from '../../../utils/authToken'
import {
  SellerMetricCard,
  SellerPageIntro,
  SellerSection,
  formatSellerCurrency,
  sellerInputSx,
} from '../../theme/sellerUi'
const statusOptions = [
  'ALL',
  'PENDING',
  'PROCESSING',
  'ELIGIBLE',
  'ON_HOLD',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]
const SettlementPage = () => {
  const dispatch = useAppDispatch()
  const { settlement } = useAppSelector((state) => state)
  const jwt = useMemo(() => getSellerToken(), [])
  const [status, setStatus] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const refresh = () => {
    if (!jwt) return
    const query = {
      status: status === 'ALL' ? undefined : status,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }
    dispatch(setSettlementFilters(query))
    dispatch(fetchSettlements({ jwt, query }))
    dispatch(fetchSettlementSummary({ jwt, query }))
  }
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, fromDate, toDate])
  const summary = settlement.summary
  return (
    <Box>
      <SellerPageIntro
        eyebrow="Finance"
        title="Settlement ledger"
        description="Review payout batches, deductions, and status changes with cleaner filters and a simpler payout table."
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
          label="Net payable"
          value={formatSellerCurrency(summary?.totalNetAmount)}
          helper="After platform deductions and tax"
          tone="accent"
          icon={<AccountBalanceWalletRoundedIcon />}
        />
        <SellerMetricCard
          label="Gross volume"
          value={formatSellerCurrency(summary?.totalGrossAmount)}
          helper={`${formatSellerCurrency(summary?.totalCommission)} commission`}
          tone="info"
          icon={<ReceiptLongRoundedIcon />}
        />
        <SellerMetricCard
          label="Pending"
          value={String(summary?.pendingCount ?? 0)}
          helper="Settlements waiting for processing"
          tone="warning"
          icon={<AutorenewRoundedIcon />}
        />
        <SellerMetricCard
          label="Failed / cancelled"
          value={String((summary?.failedCount ?? 0) + (summary?.cancelledCount ?? 0))}
          helper="Records that may need follow-up"
          tone="danger"
          icon={<ErrorOutlineRoundedIcon />}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <SellerSection
          title="Settlement filters"
          description="Narrow the ledger by status and settlement date."
        >
          {settlement.loading ? <LinearProgress sx={{ mb: 2 }} /> : null}

          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              sx={sellerInputSx}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === 'ALL' ? 'All statuses' : option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              type="date"
              label="From"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={sellerInputSx}
            />
            <TextField
              size="small"
              type="date"
              label="To"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: fromDate || undefined }}
              sx={sellerInputSx}
            />
          </Box>
        </SellerSection>
      </Box>

      <Box sx={{ mt: 2 }}>
        <SellerSection
          title="Payout records"
          description="Recent settlements with gross, deduction, and net payout visibility."
        >
          <SettlementTable
            items={settlement.items}
            loading={settlement.loading}
            error={settlement.error}
            onRetry={refresh}
          />
        </SellerSection>
      </Box>
    </Box>
  )
}
export default SettlementPage
