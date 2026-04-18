import { useEffect, useMemo, useState } from 'react'
import {
  clearReturnError,
  fetchReturnRequests,
  updateReturnStatus,
} from '../../../store/customer/ReturnSlice'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { getAdminToken } from '../../../utils/authToken'

const C = {
  text: '#0F172A',
  mid: '#4B5563',
  dim: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
  bg: '#F5F6F8',
}

const ALL_STATUSES = [
  'REQUESTED',
  'APPROVED',
  'REJECTED',
  'PICKUP_SCHEDULED',
  'RECEIVED',
  'REFUND_INITIATED',
  'REFUNDED',
]

const numberFormat = new Intl.NumberFormat('en-IN')

const formatStatusLabel = (status) =>
  (status || 'UNKNOWN')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const formatDateTime = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusStyle = (status) => {
  const key = (status || '').toUpperCase()
  if (['APPROVED', 'RECEIVED', 'REFUNDED'].includes(key)) {
    return {
      background: '#DCFCE7',
      color: '#166534',
      border: '1px solid #BBF7D0',
    }
  }
  if (key === 'REJECTED') {
    return {
      background: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #FECACA',
    }
  }
  if (['PICKUP_SCHEDULED', 'REFUND_INITIATED'].includes(key)) {
    return {
      background: '#E8F0FF',
      color: '#1D4ED8',
      border: '1px solid #C8D8FF',
    }
  }
  return {
    background: '#FEF3C7',
    color: '#92400E',
    border: '1px solid #FDE68A',
  }
}

const cell = {
  padding: '10px 12px',
  borderBottom: '1px solid #E5E7EB',
  fontSize: 13,
  color: '#111827',
  verticalAlign: 'top',
}

const AdminReturns = () => {
  const dispatch = useAppDispatch()
  const { returns } = useAppSelector((store) => store)
  const jwt = useMemo(() => getAdminToken(), [])

  const [statusFilter, setStatusFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [comments, setComments] = useState({})

  useEffect(() => {
    if (!jwt) return
    dispatch(
      fetchReturnRequests({
        jwt,
      }),
    )
    return () => {
      dispatch(clearReturnError())
    }
  }, [dispatch, jwt])

  const requests = useMemo(() => (Array.isArray(returns.requests) ? returns.requests : []), [returns.requests])

  const rows = useMemo(() => {
    return requests.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false
      if (!query.trim()) return true
      const normalizedQuery = query.trim().toLowerCase()
      return [
        item.id,
        item.orderId,
        item.orderItemId,
        item.userId,
        item.sellerId,
        item.reason,
        item.description,
        item.adminComment,
        item.status,
      ]
        .map((value) => String(value ?? '').toLowerCase())
        .some((value) => value.includes(normalizedQuery))
    })
  }, [requests, statusFilter, query])

  const summary = useMemo(() => {
    const openCount = requests.filter(
      (item) => !['REJECTED', 'REFUNDED'].includes((item.status || '').toUpperCase()),
    ).length
    const refundedCount = requests.filter(
      (item) => (item.status || '').toUpperCase() === 'REFUNDED',
    ).length
    const rejectedCount = requests.filter(
      (item) => (item.status || '').toUpperCase() === 'REJECTED',
    ).length
    return {
      total: requests.length,
      open: openCount,
      refunded: refundedCount,
      rejected: rejectedCount,
    }
  }, [requests])

  const handleStatusUpdate = (item, status) => {
    if (!item.id || !jwt || item.status === status) return
    dispatch(
      updateReturnStatus({
        jwt,
        id: item.id,
        status,
        adminComment: comments[item.id]?.trim() || undefined,
      }),
    )
  }

  const resetFilters = () => {
    setStatusFilter('ALL')
    setQuery('')
  }

  if (!jwt) {
    return (
      <div
        style={{
          padding: 20,
        }}
      >
        Admin token not found. Please login again.
      </div>
    )
  }

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
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          padding: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          alignItems: 'end',
        }}
      >
        <div style={{ display: 'grid', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              border: '1px solid #D1D5DB',
              borderRadius: 10,
              padding: '10px 12px',
            }}
          >
            <option value="ALL">All statuses</option>
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.dim }}>Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by return/order/user/seller/reason"
            style={{
              border: '1px solid #D1D5DB',
              borderRadius: 10,
              padding: '10px 12px',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 14,
        }}
      >
        {[
          { label: 'Total Requests', value: summary.total },
          { label: 'Open Requests', value: summary.open },
          { label: 'Refunded', value: summary.refunded },
          { label: 'Rejected', value: summary.rejected },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ color: C.dim, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>
              {item.label.toUpperCase()}
            </div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 800, color: C.text }}>
              {numberFormat.format(item.value)}
            </div>
          </div>
        ))}
      </div>

      {returns.error && (
        <div
          style={{
            marginTop: 12,
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            borderRadius: 10,
            padding: '10px 12px',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {returns.error}
        </div>
      )}

      <div className="app-data-table-shell" style={{ marginTop: 14 }}>
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
          Showing {numberFormat.format(rows.length)} return request{rows.length === 1 ? '' : 's'}
        </div>

        <div className="app-data-table-scroll">
          <table className="app-data-table" style={{ minWidth: 1320 }}>
            <thead>
              <tr>
                {[
                  'Return',
                  'Order',
                  'Buyer/Seller',
                  'Reason',
                  'Qty',
                  'Status',
                  'Admin Comment',
                  'Created',
                  'Action',
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '11px 12px',
                      textAlign: 'left',
                      fontSize: 12,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {returns.loading ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      ...cell,
                      textAlign: 'center',
                      padding: '26px 0',
                      color: '#6B7280',
                    }}
                  >
                    Loading returns...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      ...cell,
                      textAlign: 'center',
                      padding: '26px 0',
                      color: '#6B7280',
                    }}
                  >
                    No return requests found.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id}>
                    <td style={cell}>#{item.id}</td>
                    <td style={cell}>
                      <div>Order #{item.orderId}</div>
                      <div
                        style={{
                          color: '#6B7280',
                          marginTop: 4,
                        }}
                      >
                        Item #{item.orderItemId}
                      </div>
                    </td>
                    <td style={cell}>
                      <div>User #{item.userId ?? 'N/A'}</div>
                      <div
                        style={{
                          color: '#6B7280',
                          marginTop: 4,
                        }}
                      >
                        Seller #{item.sellerId ?? 'N/A'}
                      </div>
                    </td>
                    <td style={cell}>
                      <div style={{ fontWeight: 700 }}>{item.reason}</div>
                      {item.description && (
                        <div
                          style={{
                            color: '#6B7280',
                            marginTop: 4,
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td style={cell}>{item.quantity}</td>
                    <td style={cell}>
                      <span
                        style={{
                          display: 'inline-block',
                          borderRadius: 999,
                          padding: '4px 10px',
                          fontWeight: 700,
                          fontSize: 11,
                          letterSpacing: '0.02em',
                          ...statusStyle(item.status),
                        }}
                      >
                        {formatStatusLabel(item.status ?? 'N/A')}
                      </span>
                    </td>
                    <td style={cell}>
                      <textarea
                        value={comments[item.id ?? 0] ?? item.adminComment ?? ''}
                        onChange={(e) =>
                          setComments((prev) => ({
                            ...prev,
                            [item.id ?? 0]: e.target.value,
                          }))
                        }
                        rows={2}
                        placeholder="Optional note"
                        style={{
                          width: 240,
                          border: '1px solid #D1D5DB',
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 12,
                          resize: 'vertical',
                        }}
                      />
                    </td>
                    <td style={cell}>{formatDateTime(item.createdAt)}</td>
                    <td style={cell}>
                      <select
                        value={item.status ?? 'REQUESTED'}
                        onChange={(e) => handleStatusUpdate(item, e.target.value)}
                        style={{
                          border: '1px solid #D1D5DB',
                          borderRadius: 8,
                          padding: '8px 10px',
                          minWidth: 170,
                        }}
                      >
                        {ALL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {formatStatusLabel(status)}
                          </option>
                        ))}
                      </select>
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

export default AdminReturns
