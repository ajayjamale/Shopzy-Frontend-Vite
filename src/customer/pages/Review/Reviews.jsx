import { useEffect } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import { fetchProductById } from '../../../store/customer/ProductSlice'
import { fetchReviewsByProductId } from '../../../store/customer/ReviewSlice'
import RatingCard from './RatingCard'
import ProductReviewCard from './ProductReviewCard'
import './Reviews.css'
const Reviews = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { productId } = useParams()
  const product = useAppSelector((s) => s.products.product)
  const reviews = useAppSelector((s) => s.review.reviews)
  const loading = useAppSelector((s) => s.review.loading)
  useEffect(() => {
    if (!productId) return
    dispatch(fetchProductById(Number(productId)))
    dispatch(fetchReviewsByProductId({ productId: Number(productId) }))
  }, [productId, dispatch])
  return (
    <div className="amz-reviews-page">
      <div className="amz-reviews-wrapper">
        <div className="amz-rv-breadcrumb">
          <a href="/">Shopzy</a> /{' '}
          <a
            href={`/product-details/${product?.category?.categoryId}/${product?.title}/${productId}`}
          >
            {product?.title || 'Product'}
          </a>{' '}
          / <span>Reviews</span>
        </div>

        <div className="amz-rv-layout">
          <aside>
            <div className="amz-rv-product-sidebar">
              <img className="amz-rv-product-img" src={product?.images?.[0]} alt={product?.title} />
              <p className="amz-rv-product-seller">
                {product?.seller?.businessDetails?.businessName}
              </p>
              <p className="amz-rv-product-title">{product?.title}</p>
              <div className="amz-rv-product-price">
                <span className="amz-rv-price-sell">
                  Rs. {product?.sellingPrice?.toLocaleString('en-IN')}
                </span>
                <span className="amz-rv-price-mrp">
                  Rs. {product?.mrpPrice?.toLocaleString('en-IN')}
                </span>
                {product?.discountPercent > 0 && (
                  <span className="amz-rv-price-off">{product.discountPercent}% off</span>
                )}
              </div>
            </div>

            <button
              className="amz-rv-btn-primary"
              style={{ marginTop: 10 }}
              onClick={() => navigate(`/reviews/${productId}/create`)}
            >
              <RateReviewRoundedIcon sx={{ fontSize: 16 }} />
              Write a review
            </button>

            <button
              className="amz-btn-secondary mt-2"
              style={{ width: '100%' }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
              Back
            </button>
          </aside>

          <main className="grid gap-4">
            <RatingCard reviews={reviews} />

            <div className="amz-rv-card">
              <div className="amz-rv-card-header">
                <span>All reviews</span>
                <span className="text-xs text-slate-500">
                  {reviews.length} review{reviews.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="amz-rv-card-body">
                {loading ? (
                  <p className="text-sm text-slate-500">Loading reviews...</p>
                ) : reviews.length ? (
                  reviews.map((item) => <ProductReviewCard key={item.id} item={item} />)
                ) : (
                  <div className="amz-rv-empty">
                    <p className="amz-rv-empty-title">No reviews yet</p>
                    <p className="amz-rv-empty-desc">Be the first to share your experience.</p>
                    <button
                      className="amz-rv-btn-primary"
                      style={{ marginTop: 12 }}
                      onClick={() => navigate(`/reviews/${productId}/create`)}
                    >
                      Write a review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
export default Reviews
