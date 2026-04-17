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

  const [hero, ...restCards] = cards
  const miniCards = restCards.slice(0, 6)

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
          <button
            type="button"
            className="shop-category-featured"
            onClick={() => navigate(resolveTarget(hero.target))}
          >
            <img src={hero.image} alt={hero.name} className="shop-category-featured-image" />
            <span className="shop-category-featured-overlay" />

            <div className="shop-category-featured-content">
              <p className="shop-category-featured-tag">Featured Category</p>
              <h3 className="shop-category-featured-title">{hero.name}</h3>
              <p className="shop-category-featured-subtitle">{hero.subtitle}</p>
            </div>
          </button>

          <div className="shop-category-grid">
            {miniCards.map((item) => (
              <button
                key={item.id}
                type="button"
                className="shop-category-card"
                onClick={() => navigate(resolveTarget(item.target))}
              >
                <div className="shop-category-card-image-shell">
                  <img src={item.image} alt={item.name} className="shop-category-card-image" />
                </div>
                <div className="shop-category-card-content">
                  <p className="shop-category-card-title">{item.name}</p>
                  <p className="shop-category-card-subtitle">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopCategoryMosaic
