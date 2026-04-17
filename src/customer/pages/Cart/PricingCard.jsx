import Divider from '@mui/material/Divider'
import { useAppSelector } from '../../../store'
import { sumCartItemMrpPrice, sumCartItemSellingPrice } from '../../../utils/cartCalculator'
const PricingCard = () => {
  const { cart } = useAppSelector((store) => store)
  const cartItems = cart.cart?.cartItems || []
  const mrpTotal = sumCartItemMrpPrice(cartItems)
  const sellingTotal = sumCartItemSellingPrice(cartItems)
  const discount = mrpTotal - sellingTotal
  const orderTotal = cart.cart?.totalSellingPrice ?? sellingTotal
  return (
    <div>
      <div className="px-5 py-4 grid gap-2">
        <h3 className="text-base font-bold text-slate-900">Order Summary</h3>

        <div className="flex justify-between text-sm text-slate-600">
          <span>MRP Total</span>
          <span>Rs. {mrpTotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-sm text-emerald-700 font-semibold">
          <span>Discount</span>
          <span>- Rs. {discount.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-sm text-slate-600">
          <span>Shipping</span>
          <span className="text-emerald-700 font-semibold">Free</span>
        </div>
      </div>

      <Divider />

      <div className="px-5 py-4 flex justify-between items-center">
        <span className="text-base font-bold text-slate-900">Order Total</span>
        <span className="text-lg font-bold text-slate-900">
          Rs. {orderTotal.toLocaleString('en-IN')}
        </span>
      </div>

      {discount > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            You save Rs. {discount.toLocaleString('en-IN')} on this order.
          </p>
        </div>
      )}
    </div>
  )
}
export default PricingCard
