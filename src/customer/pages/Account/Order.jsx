import { useEffect } from 'react'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import { useAppDispatch, useAppSelector } from '../../../store'
import { fetchUserOrderHistory } from '../../../store/customer/OrderSlice'
import OrderItemCard from './OrderItemCard'
import './Profile.css'
const Order = () => {
  const dispatch = useAppDispatch()
  const jwt = useAppSelector((s) => s.auth.jwt)
  const orders = useAppSelector((s) => s.orders.orders || [])
  const loading = useAppSelector((s) => s.orders.loading)
  useEffect(() => {
    dispatch(fetchUserOrderHistory(localStorage.getItem('jwt') || ''))
  }, [jwt, dispatch])
  if (loading) {
    return (
      <div className="amz-card">
        <div className="amz-card-body">
          <p className="text-sm text-slate-500">Loading order history...</p>
        </div>
      </div>
    )
  }
  if (!orders.length) {
    return (
      <div className="amz-card">
        <div className="amz-empty-state">
          <ShoppingBagRoundedIcon sx={{ fontSize: 58, color: '#9DB2C2' }} />
          <p className="amz-empty-title">No orders yet</p>
          <p className="amz-empty-desc">
            Your order timeline will appear here once you make a purchase.
          </p>
          <a href="/" className="amz-btn-primary">
            Start shopping
          </a>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="amz-card" style={{ marginBottom: 12 }}>
        <div className="amz-card-header">
          <span>Order history</span>
          <span className="text-xs text-slate-500">
            {orders.length} order{orders.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {orders.map((order) => (
        <article className="amz-order-card" key={order.id}>
          <header className="amz-order-card-header">
            <div className="amz-order-meta">
              <span className="amz-order-meta-label">Placed on</span>
              <span className="amz-order-meta-value">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '-'}
              </span>
            </div>

            <div className="amz-order-meta">
              <span className="amz-order-meta-label">Total</span>
              <span className="amz-order-meta-value">
                Rs. {order.totalSellingPrice?.toLocaleString('en-IN') || '-'}
              </span>
            </div>

            <div className="amz-order-meta">
              <span className="amz-order-meta-label">Items</span>
              <span className="amz-order-meta-value">{order.orderItems?.length || 0}</span>
            </div>

            <div className="amz-order-meta" style={{ marginLeft: 'auto' }}>
              <span className="amz-order-meta-label">Status</span>
              <span
                className={`amz-badge ${
                  order.orderStatus === 'DELIVERED'
                    ? 'amz-badge-green'
                    : order.orderStatus === 'CANCELLED'
                      ? 'amz-badge-red'
                      : 'amz-badge-orange'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
          </header>

          <section>
            {order.orderItems?.map((item) => (
              <OrderItemCard key={item.id} item={item} order={order} />
            ))}
          </section>
        </article>
      ))}
    </div>
  )
}
export default Order
