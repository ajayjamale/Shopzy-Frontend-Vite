import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../context/AppContext'
import { addItemToCart } from '../../../../store/customer/CartSlice'
import { addProductToWishlist } from '../../../../store/customer/WishlistSlice'
import { isWishlisted } from '../../../../utils/isWishlisted'
import './ProductCard.css'
const ProductCard = ({ item }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { wishlist } = useAppSelector((store) => store)
  const inWishlist = Boolean(wishlist.wishlist && isWishlisted(wishlist.wishlist, item))
  const goToDetails = () => {
    navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)
  }
  const handleWishlist = (event) => {
    event.stopPropagation()
    if (!item.id) return
    dispatch(addProductToWishlist({ productId: item.id }))
  }
  const handleQuickAdd = (event) => {
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
  }
  return (
    <article className="product-card" onClick={goToDetails}>
      <div className="product-card-media">
        <img src={item.images?.[0]} alt={item.title} />
        {item.discountPercent > 0 && (
          <span className="product-card-badge">{item.discountPercent}% OFF</span>
        )}
        <button className="product-card-fav" onClick={handleWishlist} aria-label="wishlist">
          {inWishlist ? (
            <FavoriteRoundedIcon sx={{ color: '#BE123C', fontSize: 20 }} />
          ) : (
            <FavoriteBorderRoundedIcon sx={{ color: '#334155', fontSize: 20 }} />
          )}
        </button>
      </div>

      <div className="product-card-body">
        <p className="product-card-seller">
          {item.seller?.businessDetails?.businessName || 'Shopzy Seller'}
        </p>
        <h3 className="product-card-title">{item.title}</h3>

        <div className="product-card-price">
          <strong>Rs. {item.sellingPrice?.toLocaleString('en-IN')}</strong>
          {item.mrpPrice > item.sellingPrice && (
            <>
              <span className="mrp">Rs. {item.mrpPrice?.toLocaleString('en-IN')}</span>
              <span className="off">
                Save Rs. {(item.mrpPrice - item.sellingPrice).toLocaleString('en-IN')}
              </span>
            </>
          )}
        </div>

        <button className="product-card-cta" onClick={handleQuickAdd}>
          Quick Add
        </button>
      </div>
    </article>
  )
}
export default ProductCard
