import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toCatalogPath } from '../../../../utils/catalogRoute'

const fallback = [
  {
    id: 'women',
    name: 'Women',
    subtitle: 'Contemporary silhouettes',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&fit=crop',
    target: 'women',
  },
  {
    id: 'men',
    name: 'Men',
    subtitle: 'Everyday premium fits',
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1200&q=80&fit=crop',
    target: 'men',
  },
  {
    id: 'home',
    name: 'Home',
    subtitle: 'Minimal living picks',
    image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&q=80&fit=crop',
    target: 'home_furniture',
  },
  {
    id: 'beauty',
    name: 'Beauty',
    subtitle: 'Glow essentials',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80&fit=crop',
    target: 'beauty',
  },
  {
    id: 'sports',
    name: 'Sports',
    subtitle: 'Activewear and gear',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80&fit=crop',
    target: 'men_sports_active_wear',
  },
]

const resolveTarget = (target) => toCatalogPath(target)

const ShopCategoryMosaic = ({ data }) => {
  const navigate = useNavigate()

  const cards = useMemo(() => {
    const incoming = data?.shopByCategories || []
    if (!incoming.length) return fallback

    return incoming.map((item, index) => ({
      id: `${item.id || item.categoryId || index}`,
      name: (item.name || item.categoryId || 'Collection').split('_').join(' '),
      subtitle: item.subtitle || item.badgeText || 'Handpicked for this week',
      image: item.image || item.imageUrl || fallback[0].image,
      target: item.redirectLink || item.categoryId || 'products',
    }))
  }, [data?.shopByCategories])

  if (!cards.length) return null

  const visualCards = cards.slice(0, 4)
  const quickCards = cards.slice(4, 12)

  return (
    <section className="app-container shop-category-section">
      <div className="surface shop-category-surface">
        <header className="shop-category-header">
          <div>
            <p className="section-kicker">Category Highlights</p>
            <h2 className="section-title shop-category-title">Shop By Category</h2>
            <p className="shop-category-description">
              Explore curated collections picked for every style and need.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary shop-category-view-all"
            onClick={() => navigate(toCatalogPath())}
          >
            View All Categories
          </button>
        </header>

        <div className="shop-category-layout">
          <div className="shop-category-rail">
            {visualCards.map((item) => (
              <button
                key={item.id}
                type="button"
                className="shop-category-rail-card"
                onClick={() => navigate(resolveTarget(item.target))}
              >
                <img src={item.image} alt={item.name} className="shop-category-rail-image" />
                <span className="shop-category-rail-overlay" />

                <div className="shop-category-rail-content">
                  <p className="shop-category-rail-tag">Category</p>
                  <p className="shop-category-rail-title">{item.name}</p>
                  <p className="shop-category-rail-subtitle">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {quickCards.length > 0 && (
            <div className="shop-category-quick-grid">
              {quickCards.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="shop-category-quick-card"
                  onClick={() => navigate(resolveTarget(item.target))}
                >
                  <div className="shop-category-quick-image-shell">
                    <img src={item.image} alt={item.name} className="shop-category-quick-image" />
                  </div>
                  <div className="shop-category-quick-content">
                    <p className="shop-category-quick-title">{item.name}</p>
                    <p className="shop-category-quick-subtitle">{item.subtitle}</p>
                  </div>
                  <span className="shop-category-quick-cta">Browse</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ShopCategoryMosaic
