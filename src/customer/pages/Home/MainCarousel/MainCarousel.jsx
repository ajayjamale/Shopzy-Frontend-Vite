import { useEffect, useMemo, useState } from 'react'
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

const MAIN_AUTOPLAY_MS = 1000

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
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setIndex((prev) => (prev >= slides.length ? 0 : prev))
  }, [slides.length])

  useEffect(() => {
    if (paused || slides.length <= 1) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, MAIN_AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, slides.length])

  const move = (direction) => {
    setIndex((prev) => (prev + direction + slides.length) % slides.length)
  }

  const handleCta = (link) => {
    navigate(toCatalogPath(link || '/'))
  }

  return (
    <section className="app-container main-carousel-section">
      <div
        className="surface main-carousel-shell"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="main-carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, slideIndex) => (
            <article className="main-carousel-slide" key={`${slide.title}-${slideIndex}`}>
              <img src={slide.imageUrl} alt={slide.title} className="main-carousel-image" />
              <span className="main-carousel-overlay" />

              <div
                onClick={() => handleCta(slide.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCta(slide.link)
                  }
                }}
                className="main-carousel-hit"
              >
                <div className="main-carousel-panel">
                  <span className="main-carousel-badge">{slide.subtitle}</span>

                  <h1 className="main-carousel-title">{slide.title}</h1>

                  <p className="main-carousel-description">{slide.description}</p>

                  <div className="main-carousel-meta-row">
                    <Button
                      variant="contained"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleCta(slide.link)
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
                      {slide.buttonText}
                    </Button>
                    <span className="main-carousel-counter">
                      {String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            move(-1)
          }}
          className="main-carousel-nav main-carousel-prev"
          aria-label="previous slide"
          disabled={slides.length <= 1}
        >
          <NavigateBeforeRoundedIcon />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            move(1)
          }}
          className="main-carousel-nav main-carousel-next"
          aria-label="next slide"
          disabled={slides.length <= 1}
        >
          <NavigateNextRoundedIcon />
        </button>

        <div className="main-carousel-dots">
          {slides.map((_, dotIndex) => (
            <button
              key={`dot-${dotIndex}`}
              onClick={(event) => {
                event.stopPropagation()
                setIndex(dotIndex)
              }}
              aria-label={`slide ${dotIndex + 1}`}
              className={`main-carousel-dot${dotIndex === index ? ' main-carousel-dot-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
export default MainCarousel
