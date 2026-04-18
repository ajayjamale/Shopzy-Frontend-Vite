import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toCatalogPath } from '../../../../utils/catalogRoute'

const fallback = [
  {
    id: 'ethnicplus',
    name: 'Ethnic Plus',
    subtitle: 'Elegant festive edits',
    image:
      'https://www.ethnicplus.in/cdn/shop/files/2_e396bfa9-adef-490a-9444-1095114de031.jpg?v=1771173950&width=640',
    target: 'women_indian_and_fusion_wear',
  },
  {
    id: 'audiolab',
    name: 'Audio Lab',
    subtitle: 'Immersive audio range',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&fit=crop',
    target: 'headphones_headsets',
  },
  {
    id: 'homeliving',
    name: 'Home Living',
    subtitle: 'Designer space upgrades',
    image: 'https://images.unsplash.com/photo-1616594039964-3bcb21f6ba6b?w=1200&q=80&fit=crop',
    target: 'home_decor',
  },
]

const resolveTarget = (target) => toCatalogPath(target)

const BrandShowcasePanel = ({ data }) => {
  const navigate = useNavigate()

  const brands = useMemo(() => {
    const source = data?.topBrands || []
    if (!source.length) return fallback
    return source.map((item, index) => ({
      id: `${item.id || index}`,
      name: (item.title || item.subtitle || 'Brand').split('_').join(' '),
      subtitle: item.badgeText || 'Featured label',
      image: item.imageUrl || fallback[0].image,
      target: item.redirectLink || item.categoryId || 'products',
    }))
  }, [data?.topBrands])

  if (!brands.length) return null

  const cards = brands.slice(0, 12)

  return (
    <section className="app-container brand-showcase-section">
      <div className="surface brand-showcase-surface">
        <header className="brand-showcase-header">
          <div>
            <p className="section-kicker">Brand Stories</p>
            <h2 className="section-title brand-showcase-title">Premium Brand Showcase</h2>
            <p className="brand-showcase-description">
              Discover standout labels with curated edits for fashion, home, beauty, and tech.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary brand-showcase-view-all"
            onClick={() => navigate(toCatalogPath())}
          >
            View All Brands
          </button>
        </header>

        <div className="brand-showcase-carousel">
          {cards.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className="brand-showcase-carousel-card"
              onClick={() => navigate(resolveTarget(brand.target))}
            >
              <div className="brand-showcase-carousel-image-shell">
                <img src={brand.image} alt={brand.name} className="brand-showcase-carousel-image" />
              </div>

              <div className="brand-showcase-carousel-content">
                <p className="brand-showcase-carousel-tag">Premium Label</p>
                <h3 className="brand-showcase-carousel-title">{brand.name}</h3>
                <p className="brand-showcase-carousel-subtitle">{brand.subtitle}</p>
                <span className="brand-showcase-carousel-cta">Explore Collection</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandShowcasePanel
