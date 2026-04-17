import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useAppDispatch } from '../../../store'
import { deleteCartItem, updateCartItem } from '../../../store/customer/CartSlice'
const CartItemCard = ({ item }) => {
  const dispatch = useAppDispatch()
  const updateQty = (delta) => {
    dispatch(
      updateCartItem({
        jwt: localStorage.getItem('jwt'),
        cartItemId: item.id,
        cartItem: { quantity: item.quantity + delta },
      }),
    )
  }
  const remove = () => {
    dispatch(
      deleteCartItem({
        jwt: localStorage.getItem('jwt') || '',
        cartItemId: item.id,
      }),
    )
  }
  return (
    <article className="p-4 sm:p-5 grid sm:grid-cols-[120px_1fr_auto] gap-4">
      <div className="rounded-xl overflow-hidden border border-[#D9E5E9] bg-[#F8FBFC]">
        <img
          src={item.product.images?.[0]}
          alt={item.product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          {item.product.seller?.businessDetails?.businessName || 'Shopzy Seller'}
        </p>
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 mt-1 line-clamp-2">
          {item.product.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <strong className="text-slate-900">
            Rs. {item.sellingPrice?.toLocaleString('en-IN')}
          </strong>
          {item.product.mrpPrice > item.sellingPrice && (
            <span className="text-sm text-slate-400 line-through">
              Rs. {item.product.mrpPrice?.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-xs text-emerald-700">In stock</span>
        </div>

        <div className="inline-flex items-center border border-[#D4E2E7] rounded-full overflow-hidden mt-3">
          <button
            onClick={() => updateQty(-1)}
            disabled={item.quantity === 1}
            className="px-2 py-1 disabled:opacity-40"
          >
            <RemoveRoundedIcon sx={{ fontSize: 16 }} />
          </button>
          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
          <button onClick={() => updateQty(1)} className="px-2 py-1">
            <AddRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>

      <button
        onClick={remove}
        className="h-9 w-9 rounded-full border border-[#D6E4E8] flex items-center justify-center text-slate-500 hover:text-rose-700 hover:border-rose-200"
      >
        <CloseRoundedIcon sx={{ fontSize: 18 }} />
      </button>
    </article>
  )
}
export default CartItemCard
