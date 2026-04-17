import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { useLocation, useNavigate } from 'react-router-dom'
const OrderPlaced = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || null
  return (
    <div className="app-container py-16 flex justify-center">
      <div
        className="surface p-10 text-center"
        style={{
          borderRadius: 20,
          maxWidth: 560,
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 62, color: '#15803D' }} />
        <h1 style={{ fontSize: '1.9rem', marginTop: 10 }}>Order placed successfully</h1>
        <p className="text-sm text-slate-500 mt-2">
          Your payment is confirmed and your order is now being processed.
        </p>

        {state?.paymentId ? (
          <p className="text-xs text-slate-400 mt-3">
            Payment ID: {state.paymentId.slice(0, 18)}...
          </p>
        ) : null}

        <div className="mt-6 flex gap-2 justify-center flex-wrap">
          <button className="btn-primary" onClick={() => navigate('/account/orders')}>
            View orders
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}
export default OrderPlaced
