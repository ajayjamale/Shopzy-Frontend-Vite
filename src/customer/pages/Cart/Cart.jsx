import { Alert, Button, Snackbar, TextField } from '@mui/material'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store'
import { applyCoupon } from '../../../store/customer/CouponSlice'
import { clearCart, fetchUserCart } from '../../../store/customer/CartSlice'
import CartItemCard from './CartItemCard'
import PricingCard from './PricingCard'
const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cart, auth, coupone, orders } = useAppSelector((store) => store)
  const [couponCode, setCouponCode] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  useEffect(() => {
    dispatch(fetchUserCart(localStorage.getItem('jwt') || ''))
  }, [auth.jwt, dispatch])
  useEffect(() => {
    if (orders.paymentConfirmed) {
      dispatch(clearCart())
    }
  }, [orders.paymentConfirmed, dispatch])
  useEffect(() => {
    if (coupone.couponApplied || coupone.error) {
      setSnackbarOpen(true)
      setCouponCode('')
    }
  }, [coupone.couponApplied, coupone.error])
  const cartItems = cart.cart?.cartItems || []
  const handleCoupon = (apply) => {
    dispatch(
      applyCoupon({
        apply,
        code: apply === 'false' ? cart.cart?.couponCode || '' : couponCode,
        orderValue: cart.cart?.totalSellingPrice || 0,
        jwt: localStorage.getItem('jwt') || '',
      }),
    )
  }
  if (!cartItems.length) {
    return (
      <div className="app-container py-14">
        <div
          className="surface p-10 text-center"
          style={{ borderRadius: 22, maxWidth: 520, margin: '0 auto' }}
        >
          <ShoppingBagRoundedIcon sx={{ fontSize: 58, color: '#9BAFC0' }} />
          <h2 style={{ fontSize: '1.4rem', marginTop: 10 }}>Your cart is empty</h2>
          <p className="text-sm text-slate-500 mt-2">Looks like you have not added anything yet.</p>
          <div className="mt-6 flex gap-2 justify-center flex-wrap">
            <button className="btn-primary" onClick={() => navigate('/')}>
              Start Shopping
            </button>
            <button className="btn-secondary" onClick={() => navigate('/wishlist')}>
              Open Wishlist
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="app-container py-7">
      <div className="mb-5">
        <p className="section-kicker mb-2">Checkout</p>
        <h1 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)' }}>Shopping Cart</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        <section className="surface overflow-hidden" style={{ borderRadius: 18 }}>
          <div className="px-5 py-3 border-b border-[#E3ECEF] bg-[#F8FBFC] text-sm text-slate-600">
            {cartItems.length} item{cartItems.length > 1 ? 's' : ''} ready for checkout
          </div>
          {cartItems.map((item) => (
            <div key={item.id} className="border-b last:border-b-0 border-[#E8EFF2]">
              <CartItemCard item={item} />
            </div>
          ))}
        </section>

        <aside className="grid gap-4 lg:sticky lg:top-28">
          <section className="surface overflow-hidden" style={{ borderRadius: 18 }}>
            <div className="px-5 pt-4 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <LockRoundedIcon sx={{ fontSize: 13 }} />
              Secure checkout
            </div>
            <PricingCard />
            <div className="px-5 pb-5">
              <button className="btn-primary w-full" onClick={() => navigate('/checkout/address')}>
                Proceed to address
              </button>
            </div>
          </section>

          <section className="surface p-4" style={{ borderRadius: 18 }}>
            <p className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <LocalOfferRoundedIcon sx={{ fontSize: 18, color: '#0F766E' }} />
              Apply coupon
            </p>

            {!cart.cart?.couponCode ? (
              <div className="flex gap-2">
                <TextField
                  size="small"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={() => handleCoupon('true')}
                  disabled={!couponCode}
                >
                  Apply
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 bg-[#EAF7F5] border border-[#C7E2DE] rounded-xl px-3 py-2">
                <span className="text-sm font-semibold text-teal-800">{cart.cart.couponCode}</span>
                <button
                  className="text-xs font-bold text-teal-700"
                  onClick={() => handleCoupon('false')}
                >
                  Remove
                </button>
              </div>
            )}
          </section>

          <button
            className="surface px-4 py-3 text-left flex items-center justify-between"
            style={{ borderRadius: 16 }}
            onClick={() => navigate('/wishlist')}
          >
            <span className="text-sm font-semibold text-slate-700">Add items from wishlist</span>
            <FavoriteRoundedIcon sx={{ fontSize: 18, color: '#0F766E' }} />
          </button>
        </aside>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={coupone.error ? 'error' : 'success'}
          variant="filled"
        >
          {coupone.error || 'Coupon applied successfully'}
        </Alert>
      </Snackbar>
    </div>
  )
}
export default Cart
