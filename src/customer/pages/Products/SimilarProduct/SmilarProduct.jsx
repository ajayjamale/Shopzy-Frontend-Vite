import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../context/AppContext'
const SmilarProduct = () => {
  const navigate = useNavigate()
  const { products } = useAppSelector((store) => store)
  if (!products.products?.length) {
    return null
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.products.slice(0, 10).map((item) => (
        <button
          key={item.id}
          className="text-left rounded-2xl overflow-hidden border border-[#DCE8EC] bg-white hover:-translate-y-1 transition"
          onClick={() =>
            navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)
          }
        >
          <div className="aspect-[4/5] overflow-hidden bg-[#F6FAFB]">
            <img src={item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-3">
            <p className="text-xs text-slate-500 mb-1">
              {item.seller?.businessDetails?.businessName || 'Shopzy'}
            </p>
            <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
            <p className="text-sm font-bold text-slate-900 mt-2">
              Rs. {item.sellingPrice?.toLocaleString('en-IN')}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
export default SmilarProduct
