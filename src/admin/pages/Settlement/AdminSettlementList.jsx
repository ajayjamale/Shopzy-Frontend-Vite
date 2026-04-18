import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import {
  fetchSettlementSummary,
  fetchSettlements,
  updateSettlementStatus,
} from '../../../store/seller/settlementSlice'
import { getAdminToken } from '../../../utils/authToken'

const C = {
  text: '#0F172A',
  mid: '#4B5563',
  dim: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
  bg: '#F5F6F8',
}

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

const numberFormat = new Intl.NumberFormat('en-IN')
const currencyFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatCurrency = (value) => currencyFormat.format(Number(value ?? 0))

const formatStatusLabel = (status) =>
  (status || 'UNKNOWN')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const formatDate = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusTone = (status) => {
  const key = (status || '').toUpperCase()
  if (key === 'COMPLETED') {
    return { bg: '#E8F8F4', color: '#0F766E', border: '#BFE8DE' }
  }
  if (['FAILED', 'CANCELLED'].includes(key)) {
    return { bg: '#FFF1F4', color: '#BE123C', border: '#F8C8D4' }
  }
  if (['PROCESSING', 'ELIGIBLE'].includes(key)) {
    return { bg: '#E8F0FF', color: '#1D4ED8', border: '#C8D8FF' }
  }
  if (key === 'ON_HOLD') {
    return { bg: '#FFF4D6', color: '#B45309', border: '#F6D38D' }
  }
  return { bg: '#F1F5F9', color: '#334155', border: '#D5DEE6' }
}

const StatusChip = ({ status }) => {
  const tone = getStatusTone(status)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        padding: '4px 10px',
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.color,
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {formatStatusLabel(status)}
    </span>
  )
}

const StatusSelect = ({ current, onChange }) => (
  <select
    value={current}
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '6px 8px',
      borderRadius: 8,
      border: `1px solid ${C.border}`,
      fontSize: 12,
      minWidth: 130,
    }}
  >
    {statusOptions
      .filter((status) => status !== 'ALL')
      .map((status) => (
        <option key={status} value={status}>
          {formatStatusLabel(status)}
        </option>
      ))}
  </select>
)

const AdminSettlementList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { settlement } = useAppSelector((state) => state)
  const jwt = useMemo(() => getAdminToken(), [])

  const [status, setStatus] = useState('ALL')
  const [sellerId, setSellerId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const load = () => {
    if (!jwt) return
    const query = {
      status: status === 'ALL' ? undefined : status,
      sellerId: sellerId ? Number(sellerId) : undefined,
      size: 30,
      sort: 'createdAt,desc',
    }
    dispatch(
      fetchSettlements({
        jwt,
        query,
      }),
    )
    dispatch(
      fetchSettlementSummary({
        jwt,
        query,
      }),
    )
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sellerId])

  const handleStatus = (id, next) => {
    dispatch(
      updateSettlementStatus({
        jwt,
        id,
        status: next,
      }),
    )
  }

  const resetFilters = () => {
    setStatus('ALL')
    setSellerId('')
    setSearchQuery('')
  }

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return settlement.items
    return settlement.items.filter((item) =>
      [
        item.id,
        item.sellerId,
        item.orderId,
        item.transactionId,
        item.settlementStatus,
        item.settlementDate,
        item.createdAt,
      ]
        .map((value) => String(value ?? '').toLowerCase())
        .some((value) => value.includes(normalizedQuery)),
    )
  }, [searchQuery, settlement.items])

  const summary = settlement.summary

  return (
    <div
      style={{
        padding: 16,
        background: C.bg,
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          padding: 14,
          borderRadius: 12,
          background: C.card,
          border: `1px solid ${C.border}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          alignItems: 'end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}
          >
            {statusOptions.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption === 'ALL' ? 'All statuses' : formatStatusLabel(statusOption)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Seller ID</label>
          <input
            placeholder="Filter by seller"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Search</label>
          <input
            placeholder="Order / txn / settlement id"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '9px 10px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
            }}
          />
        </div>

        <button
          onClick={resetFilters}
          style={{
            padding: '9px 12px',
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: '#FFFFFF',
            color: C.text,
            fontWeight: 700,
            cursor: 'pointer',
            alignSelf: 'end',
          }}
        >
          Clear Filters
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginTop: 16,
        }}
      >
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: C.dim, letterSpacing: '0.08em' }}>NET PAYABLE</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>
            {formatCurrency(summary?.totalNetAmount)}
          </div>
        </div>

        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: C.dim, letterSpacing: '0.08em' }}>PENDING</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{summary?.pendingCount ?? 0}</div>
        </div>

        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: C.dim, letterSpacing: '0.08em' }}>
            FAILED/CANCELLED
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
            {(summary?.failedCount ?? 0) + (summary?.cancelledCount ?? 0)}
          </div>
        </div>
      </div>

      <div className="app-data-table-shell" style={{ marginTop: 18 }}>
        <div
          style={{
            padding: '10px 14px',
            borderBottom: `1px solid ${C.border}`,
            background: '#F8FBFC',
            fontSize: 12,
            color: C.mid,
            fontWeight: 700,
          }}
        >
          Showing {numberFormat.format(filteredItems.length)} settlement
          {filteredItems.length === 1 ? '' : 's'}
        </div>

        <div className="app-data-table-scroll">
          <table className="app-data-table" style={{ minWidth: 960 }}>
            <thead>
              <tr>
                {['ID', 'Seller', 'Order', 'Net Amount', 'Status', 'Date', 'Action'].map(
                  (header, index) => (
                    <th
                      key={header}
                      style={{
                        padding: '11px 14px',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textAlign: index >= 3 ? 'right' : 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {settlement.loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '30px 0',
                      color: C.mid,
                    }}
                  >
                    Loading settlements...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '30px 0',
                      color: C.mid,
                    }}
                  >
                    No settlements match current filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#2563EB' }}>#{item.id}</td>
                    <td style={{ padding: '12px 14px', color: C.text }}>
                      <div style={{ fontWeight: 600 }}>Seller #{item.sellerId}</div>
                      <div style={{ fontSize: 12, color: C.dim }}>{item.transactionId ?? '—'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: C.mid }}>Order #{item.orderId}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>
                      {formatCurrency(item.netSettlementAmount)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'grid', gap: 7, justifyItems: 'start' }}>
                        <StatusChip status={item.settlementStatus} />
                        <StatusSelect
                          current={item.settlementStatus}
                          onChange={(nextStatus) => handleStatus(item.id, nextStatus)}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: C.dim, textAlign: 'right' }}>
                      {formatDate(item.settlementDate || item.createdAt)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/admin/settlements/${item.id}`)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: `1px solid ${C.border}`,
                          background: C.card,
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminSettlementList
