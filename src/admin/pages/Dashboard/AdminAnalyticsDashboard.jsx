import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Chip, Skeleton } from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import { useNavigate } from 'react-router-dom'
import { adminApiPath, api } from '../../../config/Api'
import { getAdminToken } from '../../../utils/authToken'
const EMPTY_DASHBOARD = {
  customers: [],
  sellers: [],
  coupons: [],
  discounts: [],
  returns: [],
  settlements: [],
  settlementSummary: null,
  homeItems: [],
  homeSections: [],
}
const C = {
  border: '#DCE8EC',
  line: '#E7EFF2',
  text: '#0F172A',
  mid: '#475569',
  dim: '#64748B',
  teal: '#0F766E',
  amber: '#B45309',
  rose: '#BE123C',
  blue: '#1D4ED8',
  card: '#FFFFFF',
}
const sellerStatuses = [
  { key: 'ACTIVE', label: 'Active', color: '#0F766E' },
  { key: 'PENDING_VERIFICATION', label: 'Pending', color: '#B45309' },
  { key: 'SUSPENDED', label: 'Suspended', color: '#DC2626' },
  { key: 'DEACTIVATED', label: 'Deactivated', color: '#64748B' },
  { key: 'BANNED', label: 'Banned', color: '#BE123C' },
  { key: 'CLOSED', label: 'Closed', color: '#7C3AED' },
]
const returnStatuses = [
  { key: 'REQUESTED', label: 'Requested', color: '#1D4ED8' },
  { key: 'APPROVED', label: 'Approved', color: '#0F766E' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup', color: '#7C3AED' },
  { key: 'RECEIVED', label: 'Received', color: '#B45309' },
  { key: 'REFUND_INITIATED', label: 'Refunding', color: '#0F766E' },
  { key: 'REFUNDED', label: 'Refunded', color: '#0F766E' },
  { key: 'REJECTED', label: 'Rejected', color: '#BE123C' },
]
const numberFormat = new Intl.NumberFormat('en-IN')
const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
const getData = (result, fallback) => (result.status === 'fulfilled' ? result.value.data : fallback)
const normaliseSettlements = (payload) =>
  Array.isArray(payload) ? payload : payload.content || payload.items || payload.data || []
const getDateValue = (value) => {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}
const formatDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
const formatCurrency = (value) => currencyFormat.format(value ?? 0)
const inDateWindow = (start, end) => {
  const now = Date.now()
  const startValue = getDateValue(start)
  const endValue = getDateValue(end)
  const afterStart = startValue === 0 || startValue <= now
  const beforeEnd = endValue === 0 || endValue >= now
  return afterStart && beforeEnd
}
const isCouponLive = (coupon) =>
  coupon.active && inDateWindow(coupon.validityStartDate, coupon.validityEndDate)
const isDiscountLive = (item) => Boolean(item.active) && inDateWindow(item.startDate, item.endDate)
const isReturnOpen = (status) => !['REJECTED', 'REFUNDED'].includes(status || 'REQUESTED')
const pillTone = (status) => {
  const key = status.toUpperCase()
  if (['ACTIVE', 'APPROVED', 'REFUNDED', 'COMPLETED'].includes(key)) {
    return { bg: '#E8F8F4', color: '#0F766E', border: '#BFE8DE' }
  }
  if (['FAILED', 'CANCELLED', 'REJECTED', 'SUSPENDED', 'BANNED'].includes(key)) {
    return { bg: '#FFF1F4', color: '#BE123C', border: '#F8C8D4' }
  }
  if (['PROCESSING', 'ELIGIBLE', 'REQUESTED'].includes(key)) {
    return { bg: '#E8F0FF', color: '#1D4ED8', border: '#C8D8FF' }
  }
  return { bg: '#FFF4D6', color: '#B45309', border: '#F6D38D' }
}
const StatusPill = ({ label, tone }) => {
  const resolvedTone = tone || pillTone(label)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 9px',
        borderRadius: 999,
        background: resolvedTone.bg,
        color: resolvedTone.color,
        border: `1px solid ${resolvedTone.border}`,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {label.replace(/_/g, ' ')}
    </span>
  )
}
const MetricCard = ({ label, value, hint, accent, icon }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      padding: 16,
      display: 'grid',
      gap: 10,
      boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${accent}18`,
          color: accent,
        }}
      >
        {icon}
      </span>
    </div>
    <div>
      <div style={{ fontSize: 13, color: C.dim, fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 28, lineHeight: 1.05, fontWeight: 900, color: C.text }}>
        {value}
      </div>
      {hint && (
        <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.6, color: C.mid }}>{hint}</div>
      )}
    </div>
  </div>
)
const Panel = ({ title, subtitle, action, children }) => (
  <section
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 20,
      padding: 18,
      display: 'grid',
      gap: 14,
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{title}</div>
        {subtitle && <div style={{ marginTop: 4, fontSize: 13, color: C.dim }}>{subtitle}</div>}
      </div>
      {action}
    </div>
    {children}
  </section>
)
const SectionHeader = ({ title, id }) => (
  <div
    id={id}
    style={{
      fontSize: 16,
      fontWeight: 800,
      color: C.text,
      letterSpacing: '-0.01em',
    }}
  >
    {title}
  </div>
)
const DashboardSkeleton = () => (
  <div style={{ display: 'grid', gap: 18 }}>
    <Skeleton variant="rounded" height={220} />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: 14,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={148} />
      ))}
    </div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 14,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={260} />
      ))}
    </div>
  </div>
)
const AdminAnalyticsDashboard = () => {
  const navigate = useNavigate()
  const jwt = getAdminToken()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snapshot, setSnapshot] = useState(EMPTY_DASHBOARD)
  const loadDashboard = useCallback(async () => {
    if (!jwt) {
      setError('Admin token not found. Please log in again.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const headers = { Authorization: `Bearer ${jwt}` }
    const results = await Promise.allSettled([
      api.get(adminApiPath('/users'), { headers }),
      api.get('/api/sellers', { headers }),
      api.get('/api/admin/coupons', { headers }),
      api.get(adminApiPath('/daily-discounts'), { headers }),
      api.get('/api/returns', { headers }),
      api.get('/api/settlements', { headers }),
      api.get('/api/settlements/summary', { headers }),
      api.get(adminApiPath('/home-content/items'), { headers }),
      api.get(adminApiPath('/home-content/sections'), { headers }),
    ])
    const [
      customersResult,
      sellersResult,
      couponsResult,
      discountsResult,
      returnsResult,
      settlementsResult,
      settlementSummaryResult,
      homeItemsResult,
      homeSectionsResult,
    ] = results
    setSnapshot({
      customers: getData(customersResult, []).filter((user) => user.role === 'ROLE_CUSTOMER'),
      sellers: getData(sellersResult, []),
      coupons: getData(couponsResult, []),
      discounts: getData(discountsResult, []),
      returns: getData(returnsResult, []),
      settlements: normaliseSettlements(getData(settlementsResult, [])),
      settlementSummary: getData(settlementSummaryResult, null),
      homeItems: getData(homeItemsResult, []),
      homeSections: getData(homeSectionsResult, []),
    })
    const failedRequests = results.filter((result) => result.status === 'rejected').length
    if (failedRequests === results.length) {
      setError('The dashboard could not load any admin data right now.')
    } else if (failedRequests > 0) {
      setError('Some dashboard modules could not be loaded, so a few numbers may be partial.')
    } else {
      setError(null)
    }
    setLoading(false)
  }, [jwt])
  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])
  const sellerCounts = useMemo(
    () =>
      sellerStatuses.map((status) => ({
        ...status,
        count: snapshot.sellers.filter(
          (seller) => (seller.accountStatus || '').toUpperCase() === status.key,
        ).length,
      })),
    [snapshot.sellers],
  )
  const returnCounts = useMemo(
    () =>
      returnStatuses.map((status) => ({
        ...status,
        count: snapshot.returns.filter((item) => (item.status || 'REQUESTED') === status.key)
          .length,
      })),
    [snapshot.returns],
  )
  const totalSellers = snapshot.sellers.length
  const activeSellers = sellerCounts.find((item) => item.key === 'ACTIVE')?.count ?? 0
  const pendingSellers =
    sellerCounts.find((item) => item.key === 'PENDING_VERIFICATION')?.count ?? 0
  const liveCoupons = snapshot.coupons.filter(isCouponLive).length
  const liveDiscounts = snapshot.discounts.filter(isDiscountLive).length
  const openReturns = snapshot.returns.filter((item) => isReturnOpen(item.status)).length
  const visibleSections = snapshot.homeSections.filter((section) => section.visible).length
  const activeHomeItems = snapshot.homeItems.filter((item) => item.active).length
  const pendingSettlementCount = useMemo(() => {
    if (snapshot.settlementSummary) {
      return (
        (snapshot.settlementSummary.pendingCount ?? 0) +
        (snapshot.settlementSummary.processingCount ?? 0) +
        (snapshot.settlementSummary.eligibleCount ?? 0) +
        (snapshot.settlementSummary.onHoldCount ?? 0)
      )
    }
    return snapshot.settlements.filter(
      (item) => !['COMPLETED', 'FAILED', 'CANCELLED'].includes(item.settlementStatus),
    ).length
  }, [snapshot.settlementSummary, snapshot.settlements])
  const recentSettlements = useMemo(
    () =>
      [...snapshot.settlements]
        .sort(
          (a, b) =>
            getDateValue(b.createdAt || b.settlementDate) -
            getDateValue(a.createdAt || a.settlementDate),
        )
        .slice(0, 5),
    [snapshot.settlements],
  )
  const recentReturns = useMemo(
    () =>
      [...snapshot.returns]
        .sort(
          (a, b) =>
            getDateValue(b.updatedAt || b.createdAt) - getDateValue(a.updatedAt || a.createdAt),
        )
        .slice(0, 5),
    [snapshot.returns],
  )
  const hasData =
    snapshot.customers.length > 0 ||
    snapshot.sellers.length > 0 ||
    snapshot.coupons.length > 0 ||
    snapshot.discounts.length > 0 ||
    snapshot.returns.length > 0 ||
    snapshot.settlements.length > 0 ||
    snapshot.homeItems.length > 0 ||
    snapshot.homeSections.length > 0
  if (loading && !hasData) {
    return <DashboardSkeleton />
  }
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <section
        style={{
          background: '#FFFFFF',
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
          display: 'grid',
          gap: 16,
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}
        >
          <div style={{ maxWidth: 760, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <DashboardRoundedIcon sx={{ color: '#0F766E' }} />
              <span style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1.05 }}>
                Admin Overview
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: C.mid }}>
              Live marketplace status, pending queues, and recent operations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => void loadDashboard()}
              disabled={loading}
              sx={{
                borderColor: '#BFD8D4',
                color: '#0F766E',
                backgroundColor: '#FFFFFF',
                borderRadius: '999px',
                px: 2,
                fontWeight: 800,
                textTransform: 'none',
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh overview'}
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/home-content')}
              sx={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '999px',
                px: 2,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: 'none',
              }}
            >
              Open homepage studio
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Chip
            label={`${numberFormat.format(snapshot.customers.length)} customers`}
            sx={{ background: '#FFFFFF', border: `1px solid ${C.border}`, fontWeight: 700 }}
          />
          <Chip
            label={`${numberFormat.format(activeSellers)} active sellers`}
            sx={{ background: '#FFFFFF', border: `1px solid ${C.border}`, fontWeight: 700 }}
          />
          <Chip
            label={`${numberFormat.format(liveCoupons + liveDiscounts)} promotions live`}
            sx={{ background: '#FFFFFF', border: `1px solid ${C.border}`, fontWeight: 700 }}
          />
          <Chip
            label={`${numberFormat.format(pendingSettlementCount)} payouts pending`}
            sx={{ background: '#FFFFFF', border: `1px solid ${C.border}`, fontWeight: 700 }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { title: 'Sellers', to: '/admin/users?tab=sellers&status=PENDING_VERIFICATION' },
            { title: 'Returns', to: '/admin/returns' },
            { title: 'Settlements', to: '/admin/settlements' },
            { title: 'Home Content', to: '/admin/home-content' },
          ].map((item) => (
            <Button
              key={item.title}
              onClick={() => navigate(item.to)}
              variant="text"
              sx={{
                border: '1px solid #DCE8EC',
                borderRadius: '999px',
                px: 1.6,
                py: 0.85,
                textTransform: 'none',
                fontWeight: 800,
                color: '#334155',
                backgroundColor: '#FFFFFF',
              }}
            >
              {item.title}
            </Button>
          ))}
        </div>
      </section>

      {error && <Alert severity="warning">{error}</Alert>}

      <SectionHeader id="snapshot" title="Overview" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
        }}
      >
        <MetricCard
          label="Customers"
          value={numberFormat.format(snapshot.customers.length)}
          accent={C.teal}
          icon={<GroupsRoundedIcon />}
        />
        <MetricCard
          label="Active Sellers"
          value={numberFormat.format(activeSellers)}
          accent={C.text}
          icon={<StorefrontRoundedIcon />}
        />
        <MetricCard
          label="Live Promotions"
          value={numberFormat.format(liveCoupons + liveDiscounts)}
          accent={C.rose}
          icon={<LocalOfferRoundedIcon />}
        />
        <MetricCard
          label="Open Returns"
          value={numberFormat.format(openReturns)}
          accent={C.blue}
          icon={<AssignmentReturnRoundedIcon />}
        />
        <MetricCard
          label="Pending Settlements"
          value={numberFormat.format(pendingSettlementCount)}
          accent={C.amber}
          icon={<AccountBalanceWalletRoundedIcon />}
        />
        <MetricCard
          label="Home Content"
          value={`${visibleSections}/${Math.max(snapshot.homeSections.length, 1)}`}
          accent={C.teal}
          icon={<CampaignRoundedIcon />}
        />
      </div>

      <SectionHeader id="health" title="Health" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
        }}
      >
        <Panel
          title="Seller Health"
          action={
            <StatusPill
              label={`${numberFormat.format(totalSellers)} sellers`}
              tone={{ bg: '#E8F8F4', color: '#0F766E', border: '#BFE8DE' }}
            />
          }
        >
          <div style={{ display: 'grid', gap: 14 }}>
            {sellerCounts.map((item) => (
              <div key={item.key} style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>
                    {numberFormat.format(item.count)}
                  </span>
                </div>
                <div
                  style={{
                    height: 9,
                    borderRadius: 999,
                    background: '#ECF2F4',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(totalSellers ? (item.count / totalSellers) * 100 : 0, item.count > 0 ? 6 : 0)}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Return Status"
          action={
            <StatusPill
              label={`${numberFormat.format(snapshot.returns.length)} total`}
              tone={{ bg: '#E8F0FF', color: '#1D4ED8', border: '#C8D8FF' }}
            />
          }
        >
          <div style={{ display: 'grid', gap: 14 }}>
            {returnCounts.map((item) => (
              <div key={item.key} style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>
                    {numberFormat.format(item.count)}
                  </span>
                </div>
                <div
                  style={{
                    height: 9,
                    borderRadius: 999,
                    background: '#ECF2F4',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(snapshot.returns.length ? (item.count / snapshot.returns.length) * 100 : 0, item.count > 0 ? 6 : 0)}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Storefront"
          action={
            <StatusPill
              label={`${numberFormat.format(activeHomeItems)} items live`}
              tone={{ bg: '#E8F8F4', color: '#0F766E', border: '#BFE8DE' }}
            />
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              {
                label: 'Visible homepage sections',
                value: `${visibleSections}/${snapshot.homeSections.length || 0}`,
              },
              {
                label: 'Active homepage content items',
                value: numberFormat.format(activeHomeItems),
              },
              { label: 'Live daily discounts', value: numberFormat.format(liveDiscounts) },
              { label: 'Live coupons', value: numberFormat.format(liveCoupons) },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  paddingBottom: 10,
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <span style={{ fontSize: 13, color: C.mid }}>{item.label}</span>
                <strong style={{ fontSize: 13, color: C.text }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Priority Queues">
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              {
                label: 'Pending seller reviews',
                value: numberFormat.format(pendingSellers),
                tone: C.amber,
              },
              { label: 'Open returns', value: numberFormat.format(openReturns), tone: C.blue },
              {
                label: 'Pending settlements',
                value: numberFormat.format(pendingSettlementCount),
                tone: C.rose,
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  border: `1px solid ${C.line}`,
                  borderRadius: 16,
                  padding: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  alignItems: 'center',
                  background: '#FCFEFE',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 900, color: item.tone }}>
                  {item.value}
                </span>
              </div>
            ))}
            <div
              style={{
                marginTop: 4,
                borderRadius: 18,
                border: `1px solid ${C.border}`,
                background: 'linear-gradient(135deg, #0F172A 0%, #1F2937 100%)',
                color: '#FFFFFF',
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                }}
              >
                Payout Summary
              </div>
              <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900 }}>
                {formatCurrency(snapshot.settlementSummary?.totalNetAmount)}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, opacity: 0.88 }}>
                {numberFormat.format(pendingSettlementCount)} in queue
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <SectionHeader id="activity" title="Recent Activity" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        <Panel
          title="Recent Settlements"
          subtitle="Latest payout records moving through finance operations"
          action={
            <Button
              size="small"
              onClick={() => navigate('/admin/settlements')}
              sx={{ textTransform: 'none', fontWeight: 800, color: '#0F766E' }}
            >
              Open settlements
            </Button>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.dim }}>
                  {['Settlement', 'Seller', 'Net amount', 'Status', 'Date'].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: '0 0 10px',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '18px 0 2px', color: C.dim }}>
                      No settlement activity found yet.
                    </td>
                  </tr>
                ) : (
                  recentSettlements.map((item) => (
                    <tr key={item.id} style={{ borderTop: `1px solid ${C.line}` }}>
                      <td style={{ padding: '12px 0', fontWeight: 800, color: C.text }}>
                        #{item.id}
                      </td>
                      <td style={{ padding: '12px 0', color: C.mid }}>Seller #{item.sellerId}</td>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: C.text }}>
                        {formatCurrency(item.netSettlementAmount)}
                      </td>
                      <td style={{ padding: '12px 0' }}>
                        <StatusPill label={item.settlementStatus} />
                      </td>
                      <td style={{ padding: '12px 0', color: C.dim }}>
                        {formatDate(item.settlementDate || item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Recent Returns"
          subtitle="Latest return requests and refund progress updates"
          action={
            <Button
              size="small"
              onClick={() => navigate('/admin/returns')}
              sx={{ textTransform: 'none', fontWeight: 800, color: '#0F766E' }}
            >
              Open returns
            </Button>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: C.dim }}>
                  {['Return', 'Order', 'Reason', 'Status', 'Updated'].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: '0 0 10px',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReturns.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '18px 0 2px', color: C.dim }}>
                      No return activity found yet.
                    </td>
                  </tr>
                ) : (
                  recentReturns.map((item) => (
                    <tr key={item.id} style={{ borderTop: `1px solid ${C.line}` }}>
                      <td style={{ padding: '12px 0', fontWeight: 800, color: C.text }}>
                        #{item.id}
                      </td>
                      <td style={{ padding: '12px 0', color: C.mid }}>Order #{item.orderId}</td>
                      <td style={{ padding: '12px 0', color: C.text }}>
                        <div style={{ fontWeight: 700 }}>{item.reason}</div>
                        {item.description && (
                          <div
                            style={{ marginTop: 4, fontSize: 12, lineHeight: 1.5, color: C.dim }}
                          >
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 0' }}>
                        <StatusPill label={item.status || 'REQUESTED'} />
                      </td>
                      <td style={{ padding: '12px 0', color: C.dim }}>
                        {formatDate(item.updatedAt || item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}
export default AdminAnalyticsDashboard
