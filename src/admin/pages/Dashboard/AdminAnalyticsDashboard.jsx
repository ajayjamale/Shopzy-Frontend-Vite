import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Skeleton } from '@mui/material'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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
  text: '#0F172A',
  mid: '#475569',
  dim: '#64748B',
  teal: '#0F766E',
  amber: '#B45309',
  rose: '#BE123C',
  blue: '#1D4ED8',
  card: '#FFFFFF',
}
const numberFormat = new Intl.NumberFormat('en-IN')
const getData = (result, fallback) => (result.status === 'fulfilled' ? result.value.data : fallback)
const normaliseSettlements = (payload) =>
  Array.isArray(payload) ? payload : payload.content || payload.items || payload.data || []
const getDateValue = (value) => {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}
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
const ChartCard = ({ title, subtitle, children }) => (
  <section
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      padding: 16,
      display: 'grid',
      gap: 12,
      boxShadow: '0 10px 28px rgba(15, 23, 42, 0.04)',
      minHeight: 330,
    }}
  >
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{title}</div>
      {subtitle && <div style={{ marginTop: 4, fontSize: 12, color: C.mid }}>{subtitle}</div>}
    </div>
    {children}
  </section>
)
const DashboardSkeleton = () => (
  <div style={{ display: 'grid', gap: 18 }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14,
      }}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={148} />
      ))}
    </div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 14,
      }}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={330} />
      ))}
    </div>
  </div>
)
const AdminAnalyticsDashboard = () => {
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
  const activeSellers = useMemo(
    () =>
      snapshot.sellers.filter((seller) => (seller.accountStatus || '').toUpperCase() === 'ACTIVE')
        .length,
    [snapshot.sellers],
  )
  const liveCoupons = snapshot.coupons.filter(isCouponLive).length
  const liveDiscounts = snapshot.discounts.filter(isDiscountLive).length
  const openReturns = snapshot.returns.filter((item) => isReturnOpen(item.status)).length
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
  const sellerStatusChartData = useMemo(() => {
    const counts = snapshot.sellers.reduce((acc, seller) => {
      const key = (seller.accountStatus || 'UNKNOWN').toUpperCase()
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const statusOrder = [
      'ACTIVE',
      'PENDING_VERIFICATION',
      'SUSPENDED',
      'DEACTIVATED',
      'BANNED',
      'CLOSED',
      'UNKNOWN',
    ]
    return statusOrder
      .filter((status) => counts[status])
      .map((status) => ({
        status: status.replaceAll('_', ' '),
        count: counts[status],
      }))
  }, [snapshot.sellers])
  const promotionSplitData = useMemo(() => {
    const inactiveCoupons = Math.max(0, snapshot.coupons.length - liveCoupons)
    const inactiveDiscounts = Math.max(0, snapshot.discounts.length - liveDiscounts)
    return [
      { name: 'Live Coupons', value: liveCoupons, color: '#0F766E' },
      { name: 'Live Discounts', value: liveDiscounts, color: '#1D4ED8' },
      {
        name: 'Inactive Promotions',
        value: inactiveCoupons + inactiveDiscounts,
        color: '#94A3B8',
      },
    ].filter((segment) => segment.value > 0)
  }, [snapshot.coupons.length, snapshot.discounts.length, liveCoupons, liveDiscounts])
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
      {error && <Alert severity="warning">{error}</Alert>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        <ChartCard
          title="Seller Status"
          subtitle="Breakdown of seller accounts by current status"
        >
          {sellerStatusChartData.length === 0 ? (
            <div style={{ color: C.dim, fontSize: 13 }}>No seller data to chart yet.</div>
          ) : (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={sellerStatusChartData} margin={{ top: 6, right: 12, left: -14, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7EFF2" />
                  <XAxis
                    dataKey="status"
                    angle={-18}
                    textAnchor="end"
                    interval={0}
                    height={62}
                    tick={{ fontSize: 10, fill: '#64748B' }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip formatter={(value) => numberFormat.format(value)} />
                  <Bar dataKey="count" fill="#0F766E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Promotions Split" subtitle="Live versus inactive promotions overview">
          {promotionSplitData.length === 0 ? (
            <div style={{ color: C.dim, fontSize: 13 }}>No promotion data to chart yet.</div>
          ) : (
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={promotionSplitData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {promotionSplitData.map((segment) => (
                      <Cell key={segment.name} fill={segment.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => numberFormat.format(value)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
export default AdminAnalyticsDashboard
