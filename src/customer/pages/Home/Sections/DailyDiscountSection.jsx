import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const fallback = [
  {
    id: 'deal-fashion',
    title: 'Fashion Picks',
    subtitle: 'Today only',
    discountText: '35% OFF',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80&fit=crop',
    target: 'women',
  },
  {
    id: 'deal-tech',
    title: 'Audio Upgrades',
    subtitle: 'Limited stock',
    discountText: '42% OFF',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80&fit=crop',
    target: 'headphones_headsets',
  },
  {
    id: 'deal-home',
    title: 'Home Decor',
    subtitle: 'Special markdown',
    discountText: '28% OFF',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1000&q=80&fit=crop',
    target: 'home_decor',
  },
]
const resolveTarget = (target) => toCatalogPath(target)
const DailyDiscountSection = ({ data }) => {
  const navigate = useNavigate()
  const items = useMemo(() => {
    const source = data?.dailyDiscounts || []
    if (!source.length) return fallback
    return source
      .filter((item) => item && item.active !== false)
      .map((item, index) => {
        const value = Number(item.discountPercent)
        return {
          id: `${item.id || index}`,
          title: (item.title || 'Daily Deal').split('_').join(' '),
          subtitle: item.subtitle || 'Today only',
          discountText:
            item.discountLabel ||
            (Number.isFinite(value) && value > 0 ? `${Math.round(value)}% OFF` : 'HOT DEAL'),
          image: item.imageUrl || fallback[0].image,
          target: item.redirectLink || '/catalog',
        }
      })
      .slice(0, 8)
  }, [data?.dailyDiscounts])
  if (!items.length) return null
  const grid = items.slice(0, 8)
  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <div
        className="surface"
        style={{
          padding: 'clamp(18px,2.8vw,30px)',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFF7ED 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="section-kicker" style={{ marginBottom: 8, color: '#C2410C' }}>
              Price Drops
            </p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.35rem,2.9vw,2rem)' }}>
              Daily Discounts
            </h2>
            <p style={{ marginTop: 6, color: '#7C2D12', fontSize: 13 }}>
              Fresh discount cards synced from backend each day.
            </p>
          </div>
          <button className="btn-secondary" onClick={() => navigate(toCatalogPath())}>
            Explore All Offers
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12 }}>
          {grid.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(resolveTarget(item.target))}
              style={{
                borderRadius: 14,
                border: '1px solid #F4D8BA',
                background: '#fff',
                overflow: 'hidden',
                textAlign: 'left',
                padding: 0,
                cursor: 'pointer',
              }}
              className="max-[1024px]:col-span-2 max-[640px]:col-span-4"
            >
              <div
                style={{
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  background: 'linear-gradient(165deg,#FFF8F1 0%,#FFF1E5 100%)',
                  padding: 8,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 9,
                    background: '#fff',
                  }}
                />
              </div>
              <div style={{ padding: '10px 11px 12px', display: 'grid', gap: 6 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    width: 'fit-content',
                    alignItems: 'center',
                    borderRadius: 999,
                    border: '1px solid #FDBA74',
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 16px rgba(234,88,12,.25)',
                  }}
                >
                  {item.discountText}
                </span>
                <p
                  style={{
                    fontSize: 13,
                    color: '#0F172A',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                  }}
                >
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
export default DailyDiscountSection
