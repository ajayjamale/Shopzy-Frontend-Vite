import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../context/AppContext'
import { addProductToWishlist } from '../../../store/customer/WishlistSlice'
import { addItemToCart } from '../../../store/customer/CartSlice'
const WishlistProductCard = ({ item }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [adding, setAdding] = useState(false)
  const removeItem = (event) => {
    event.stopPropagation()
    if (!item.id) return
    dispatch(addProductToWishlist({ productId: item.id }))
  }
  const addToCart = (event) => {
    event.stopPropagation()
    if (!item.id) return
    dispatch(
      addItemToCart({
        jwt: localStorage.getItem('jwt') || '',
        request: {
          productId: item.id,
          size: item.sizes || 'FREE',
          quantity: 1,
        },
      }),
    )
    setAdding(true)
    setTimeout(() => setAdding(false), 1700)
  }
  return (
    <article
      className="surface overflow-hidden cursor-pointer hover:-translate-y-1 transition"
      style={{ borderRadius: 16 }}
      onClick={() =>
        navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)
      }
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8FBFC]">
        <img src={item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
        {item.discountPercent > 0 && (
          <span className="absolute left-3 bottom-3 bg-rose-700 text-white text-xs font-bold px-2 py-1 rounded-full">
            {item.discountPercent}% OFF
          </span>
        )}
        <button
          className="absolute top-3 right-3 h-8 w-8 rounded-full border border-[#D6E4E8] bg-white/95 text-slate-500"
          onClick={removeItem}
        >
          �
        </button>
      </div>

      <div className="p-3 grid gap-1">
        <p className="text-xs text-slate-500">
          {item.seller?.businessDetails?.businessName || 'Shopzy Seller'}
        </p>
        <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
        <p className="text-sm font-bold text-slate-900 mt-1">
          Rs. {item.sellingPrice?.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="px-3 pb-3">
        <button className="btn-secondary w-full" onClick={addToCart}>
          {adding ? 'Added' : 'Move to cart'}
        </button>
      </div>
    </article>
  )
}
export default WishlistProductCard
