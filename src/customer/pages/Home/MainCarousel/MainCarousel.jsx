import { useMemo, useState } from 'react'
import { Button } from '@mui/material'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../context/AppContext'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const fallbackSlides = [
  {
    title: 'Luxury Looks. Smart Prices.',
    subtitle: 'Spring collection now live',
    description: 'Explore standout drops from premium labels with fast delivery and easy returns.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&fit=crop',
    buttonText: 'Shop collection',
    categoryId: 'women',
  },
  {
    title: 'Modern Tech For Everyday',
    subtitle: 'Best-in-class electronics',
    description: 'Curated headphones, laptops, and smart devices selected for quality and value.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80&fit=crop',
    buttonText: 'Browse electronics',
    categoryId: 'electronics',
  },
  {
    title: 'Designed Homes Start Here',
    subtitle: 'Furniture and decor edit',
    description: 'Create warm, minimal living spaces with beautiful and functional pieces.',
    imageUrl: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1600&q=80&fit=crop',
    buttonText: 'Refresh your home',
    categoryId: 'home_furniture',
  },
]
const MainCarousel = () => {
  const navigate = useNavigate()
  const { homePage } = useAppSelector((store) => store)
  const slides = useMemo(() => {
    if (homePage.homePageData?.heroSlides?.length) {
      return homePage.homePageData.heroSlides.map((slide) => ({
        title: slide.title || 'Curated Collections',
        subtitle: slide.subtitle || slide.badgeText || 'Fresh picks',
        description:
          slide.description ||
          'Shop thoughtfully selected products across fashion, electronics, and home.',
        imageUrl: slide.imageUrl || fallbackSlides[0].imageUrl,
        buttonText: slide.buttonText || 'Explore now',
        link: slide.buttonLink || slide.redirectLink || slide.categoryId || '/',
      }))
    }
    return fallbackSlides.map((slide) => ({
      ...slide,
      link: slide.categoryId,
    }))
  }, [homePage.homePageData?.heroSlides])
  const [index, setIndex] = useState(0)
  const active = slides[index]
  const move = (direction) => {
    setIndex((prev) => {
      const next = prev + direction
      if (next < 0) return slides.length - 1
      if (next >= slides.length) return 0
      return next
    })
  }
  const handleCta = () => {
    navigate(toCatalogPath(active.link || '/'))
  }
  return (
    <section className="app-container" style={{ paddingTop: 26 }}>
      <div
        className="surface"
        style={{
          borderRadius: 26,
          overflow: 'hidden',
          minHeight: 'min(74vh, 560px)',
          position: 'relative',
          background: '#0B1320',
        }}
      >
        <img
          src={active.imageUrl}
          alt={active.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(108deg, rgba(2,6,23,.82) 0%, rgba(2,6,23,.35) 42%, rgba(2,6,23,.62) 100%)',
          }}
        />

        <div
          onClick={handleCta}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleCta()
            }
          }}
          style={{
            position: 'relative',
            minHeight: 'min(74vh, 560px)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 'clamp(18px, 5vw, 54px)',
              right: 'clamp(18px, 5vw, 54px)',
              top: '50%',
              transform: 'translateY(-50%)',
              maxWidth: 720,
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,.26)',
              background: 'linear-gradient(140deg, rgba(2,6,23,.72) 0%, rgba(15,118,110,.36) 100%)',
              backdropFilter: 'blur(7px)',
              padding: 'clamp(18px, 4vw, 36px)',
              display: 'grid',
              gap: 12,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                width: 'fit-content',
                borderRadius: 999,
                border: '1px solid rgba(94,234,212,.38)',
                background: 'rgba(8,47,73,.5)',
                color: '#99F6E4',
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '.12em',
                textTransform: 'uppercase',
              }}
            >
              {active.subtitle}
            </span>

            <h1
              style={{ color: '#F8FAFC', fontSize: 'clamp(1.85rem,4vw,3.5rem)', lineHeight: 1.02 }}
            >
              {active.title}
            </h1>

            <p style={{ color: '#D6E3E9', maxWidth: 620, lineHeight: 1.7 }}>{active.description}</p>

            <div className="flex items-center gap-3 flex-wrap pt-2">
              <Button
                variant="contained"
                onClick={(event) => {
                  event.stopPropagation()
                  handleCta()
                }}
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{
                  bgcolor: '#0F766E',
                  px: 3,
                  py: 1.2,
                  borderRadius: 999,
                  '&:hover': { bgcolor: '#0B5F59' },
                }}
              >
                {active.buttonText}
              </Button>
              <span style={{ color: '#C6D7DF', fontSize: '0.9rem', fontWeight: 700 }}>
                {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              move(-1)
            }}
            style={{
              position: 'absolute',
              bottom: 18,
              right: 66,
              border: '1px solid rgba(255,255,255,0.42)',
              background: 'rgba(2,6,23,0.34)',
              color: '#fff',
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="previous slide"
          >
            <NavigateBeforeRoundedIcon />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              move(1)
            }}
            style={{
              position: 'absolute',
              bottom: 18,
              right: 18,
              border: '1px solid rgba(255,255,255,0.42)',
              background: 'rgba(2,6,23,0.34)',
              color: '#fff',
              width: 38,
              height: 38,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="next slide"
          >
            <NavigateNextRoundedIcon />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: 18,
              left: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {slides.map((_, dotIndex) => (
              <button
                key={`dot-${dotIndex}`}
                onClick={(event) => {
                  event.stopPropagation()
                  setIndex(dotIndex)
                }}
                aria-label={`slide ${dotIndex + 1}`}
                style={{
                  width: dotIndex === index ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: 'none',
                  background: dotIndex === index ? '#5EEAD4' : 'rgba(255,255,255,.45)',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default MainCarousel
