import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../context/AppContext'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const fallback = [
  {
    target: 'men',
    name: 'Men',
    image:
      'https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/e/i/b/4xl-bys-hd-fs7-btny-fubar-original-imahfgfetkgbtuhr.jpeg?q=70&crop=false',
  },
  {
    target: 'women',
    name: 'Women',
    image:
      'https://rukminim2.flixcart.com/image/832/832/xif0q/dress/j/a/g/l-ss-11-sheetal-associates-original-imahf7qyzjjjzrez.jpeg?q=70&crop=false',
  },
  {
    target: 'electronics',
    name: 'Electronics',
    image:
      'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/x/9/j/-original-imahyjzh7m2zsqdg.jpeg?q=70',
  },
  {
    target: 'home_furniture',
    name: 'Home & Furniture',
    image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&q=80&fit=crop',
  },
]
const HomeCategory = () => {
  const navigate = useNavigate()
  const { homePage } = useAppSelector((store) => store)
  const categories =
    homePage.homePageData?.shopByCategories?.map((item) => ({
      target: item.redirectLink || item.categoryId || 'men',
      name: item.name || item.title || 'Collection',
      image: item.image || item.imageUrl,
    })) || fallback
  const featuredDeal = useMemo(() => {
    const liveDeals = (homePage.homePageData?.deals || []).filter(
      (item) => item && item.active !== false,
    )
    if (liveDeals.length) {
      return [...liveDeals].sort((a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0))[0]
    }
    return {
      title: 'Fresh Picks',
      discount: 35,
      image: fallback[0].image,
      redirectLink: '/catalog',
    }
  }, [homePage.homePageData?.deals])
  const dealTarget = featuredDeal.redirectLink || featuredDeal.category?.categoryId || ''
  const dealPath = toCatalogPath(dealTarget)
  const dealImage =
    featuredDeal.image || featuredDeal.imageUrl || featuredDeal.category?.image || fallback[0].image
  const dealTitle = (featuredDeal.title || featuredDeal.category?.categoryId || "today's picks")
    .split('_')
    .join(' ')
  const numericDiscount = Number(featuredDeal.discount)
  const discountText =
    featuredDeal.discountLabel ||
    (Number.isFinite(numericDiscount) && numericDiscount > 0
      ? `${Math.round(numericDiscount)}% OFF`
      : 'HOT DEAL')
  const resolvePath = (target) => {
    return toCatalogPath(target)
  }
  return (
    <section className="app-container" style={{ marginTop: 34, paddingBottom: 14 }}>
      <style>
        {`
          @keyframes dealBlink {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 rgba(190, 24, 93, 0.12); }
            50% { opacity: 0.68; box-shadow: 0 0 26px rgba(190, 24, 93, 0.42); }
          }
        `}
      </style>
      <div className="surface p-6 lg:p-8">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="section-kicker mb-2">Shop By Mood</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              Curated Categories
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="sm:col-span-2 text-left relative overflow-hidden rounded-2xl border border-[#DDE8EC] min-h-[220px] bg-[#0B1F2E]"
            onClick={() => navigate(dealPath)}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(110deg, rgba(7,38,51,0.94) 0%, rgba(12,59,71,0.88) 54%, rgba(13,97,96,0.64) 100%)',
              }}
            />
            <img
              src={dealImage}
              alt={dealTitle}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '58%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.36,
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 220,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  width: 'fit-content',
                  borderRadius: 999,
                  background: '#BE123C',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  padding: '7px 12px',
                  animation: 'dealBlink 1s ease-in-out infinite',
                }}
              >
                TODAY'S DEALS
              </span>

              <div style={{ marginTop: 18 }}>
                <h3
                  style={{
                    margin: 0,
                    color: '#F8FAFC',
                    fontSize: 'clamp(1.05rem, 2.1vw, 1.55rem)',
                    lineHeight: 1.24,
                    textTransform: 'capitalize',
                  }}
                >
                  {discountText} on {dealTitle}
                </h3>
                <p style={{ margin: '10px 0 0', color: '#C9DEE2', fontSize: 13 }}>
                  Limited-time offers curated by the admin team.
                </p>
              </div>

              <span
                style={{
                  marginTop: 16,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#5EEAD4',
                }}
              >
                Shop deal -&gt;
              </span>
            </div>
          </button>

          {categories.slice(0, 8).map((item) => (
            <button
              key={`${item.target}-${item.name}`}
              className="group text-left rounded-2xl overflow-hidden border border-[#DDE8EC] bg-white"
              onClick={() => navigate(resolvePath(item.target))}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image || fallback[0].image}
                  alt={item.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <span className="text-xs font-bold tracking-[0.1em] uppercase text-teal-700">
                  Explore
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
export default HomeCategory
