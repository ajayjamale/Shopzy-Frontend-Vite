import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store'
import { fetchSettlementById, updateSettlementStatus } from '../../../store/seller/settlementSlice'
import { getAdminToken } from '../../../utils/authToken'
const C = {
  text: '#0F1111',
  mid: '#4B5563',
  dim: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
  bg: '#F5F6F8',
}
const formatCurrency = (v) => `₹${(v ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
const AdminSettlementDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { settlement } = useAppSelector((s) => s)
  const jwt = getAdminToken()
  useEffect(() => {
    if (id && jwt) dispatch(fetchSettlementById({ jwt, id: Number(id) }))
  }, [dispatch, id, jwt])
  const data = settlement.current
  const handleStatus = (status) => {
    if (!data) return
    dispatch(updateSettlementStatus({ jwt, id: data.id, status }))
  }
  return (
    <div style={{ padding: 16, background: C.bg, minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>
            Settlement #{id}
          </h1>
          <p style={{ margin: '4px 0 0', color: C.mid }}>Admin view</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: `1px solid ${C.border}`,
            background: C.card,
            padding: '8px 14px',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Back
        </button>
      </div>

      {!data ? (
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            color: C.mid,
          }}
        >
          {settlement.loading
            ? 'Loading settlement...'
            : settlement.error || 'Settlement not found'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, color: C.dim, letterSpacing: '0.08em' }}>SELLER</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
              Seller #{data.sellerId}
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: C.mid }}>
              Order #{data.orderId} • Txn {data.transactionId ?? '—'}
            </div>
          </div>

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, color: C.dim, letterSpacing: '0.08em' }}>AMOUNTS</div>
            <div style={{ marginTop: 8, fontSize: 14, color: C.mid }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Gross</span>
                <strong>{formatCurrency(data.grossAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Commission</span>
                <strong>{formatCurrency(data.commissionAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Platform Fee</span>
                <strong>{formatCurrency(data.platformFee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Tax</span>
                <strong>{formatCurrency(data.taxAmount)}</strong>
              </div>
              <div style={{ height: 1, background: C.border, margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
                <span>Net Payable</span>
                <strong>{formatCurrency(data.netSettlementAmount)}</strong>
              </div>
            </div>
          </div>

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, color: C.dim, letterSpacing: '0.08em' }}>STATUS</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {[
                'PENDING',
                'PROCESSING',
                'ELIGIBLE',
                'ON_HOLD',
                'COMPLETED',
                'FAILED',
                'CANCELLED',
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: data.settlementStatus === s ? '#E0E7FF' : C.card,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 12,
                  }}
                >
                  {s.toLowerCase()}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: C.dim }}>Payment Method</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{data.paymentMethod}</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: C.dim }}>
              Created {data.createdAt?.split('T')[0] ?? '—'} • Settled{' '}
              {data.settlementDate?.split('T')[0] ?? '—'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminSettlementDetail
