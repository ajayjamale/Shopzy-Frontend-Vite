import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../store'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const fallback = [
  {
    name: 'Ethnic Plus',
    image:
      'https://www.ethnicplus.in/cdn/shop/files/2_e396bfa9-adef-490a-9444-1095114de031.jpg?v=1771173950&width=640',
    badge: 'Fashion',
    target: 'women_indian_and_fusion_wear',
  },
  {
    name: 'Audio Lab',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&fit=crop',
    badge: 'Electronics',
    target: 'headphones_headsets',
  },
  {
    name: 'Active Wear',
    image:
      'https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/22109480/2023/9/5/06a17ac3-46b0-4f9d-bcb1-2d3582feda041693895310152PumaWomenBrandLogoPrintedPureCottonOutdoorT-shirt1.jpg',
    badge: 'Sports',
    target: 'women_sports_active_wear',
  },
  {
    name: 'Home Living',
    image:
      'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28460938/2024/3/22/7fb09e9c-86e0-4602-b54e-fa5c0171b50b1711104156746IrregularMirrorHomeDecor1.jpg',
    badge: 'Home',
    target: 'home_decor',
  },
]
const TopBrand = () => {
  const navigate = useNavigate()
  const { homePage } = useAppSelector((store) => store)
  const brands =
    homePage.homePageData?.topBrands?.map((item) => ({
      name: item.title || item.subtitle || 'Brand',
      image: item.imageUrl,
      badge: item.badgeText,
      target: item.redirectLink || item.categoryId || '/catalog',
    })) || fallback
  const handleNavigate = (target) => {
    if (!target) return
    navigate(toCatalogPath(target))
  }
  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <div className="surface p-6 lg:p-8">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="section-kicker mb-2">Brand Spotlight</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              Premium Picks From Top Labels
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.slice(0, 8).map((brand) => (
            <button
              key={`${brand.name}-${brand.image}`}
              onClick={() => handleNavigate(brand.target)}
              className="relative overflow-hidden rounded-2xl border border-[#DDE8EC] group"
              style={{
                minHeight: 220,
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
                border: '1px solid #DDE8EC',
                padding: 0,
                background: 'transparent',
              }}
            >
              <img
                src={brand.image || fallback[0].image}
                alt={brand.name}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
              <div className="absolute left-4 right-4 bottom-4 text-white">
                <p className="text-xs uppercase tracking-[0.16em] opacity-85">
                  {brand.badge || 'Featured'}
                </p>
                <p className="text-lg font-semibold mt-1">{brand.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
export default TopBrand
