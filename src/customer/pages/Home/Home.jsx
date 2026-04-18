import { Backdrop, Button, CircularProgress } from '@mui/material'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../context/AppContext'
import ChatBot from '../ChatBot/ChatBot'
import MainCarousel from './MainCarousel/MainCarousel'
import HeroSpotlights from './HeroSpotlights/HeroSpotlights'
import ShopCategoryMosaic from './Sections/ShopCategoryMosaic'
import TechFeatureRail from './Sections/TechFeatureRail'
import BrandShowcasePanel from './Sections/BrandShowcasePanel'
import DailyDiscountSection from './Sections/DailyDiscountSection'
import { fetchHomePageData } from '../../../store/customer/home/AsyncThunk'
import { toCatalogPath } from '../../../utils/catalogRoute'
const Home = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showChatBot, setShowChatBot] = useState(false)
  const { homePage } = useAppSelector((store) => store)
  const data = homePage.homePageData
  useEffect(() => {
    dispatch(fetchHomePageData())
  }, [dispatch])
  const isVisible = (key) =>
    data?.sections?.find((section) => section.sectionKey === key && section.visible)
  const hasDailyDiscounts = Boolean((data?.dailyDiscounts?.length || 0) > 0)
  const hasHeroSpotlights = Boolean((data?.heroSlides?.length || 0) > 1)
  const hasSectionMeta = Boolean((data?.sections?.length || 0) > 0)
  const showDailyDiscounts = data ? Boolean(hasDailyDiscounts) : true
  const showHeroSpotlights = data
    ? Boolean(((hasSectionMeta && isVisible('HERO')) || !hasSectionMeta) && hasHeroSpotlights)
    : true
  const showShopByCategory = data ? Boolean(isVisible('SHOP_BY_CATEGORY') || !hasSectionMeta) : true
  const showElectronics = data ? Boolean(isVisible('ELECTRONICS') || !hasSectionMeta) : true
  const showTopBrands = data ? Boolean(isVisible('TOP_BRAND') || !hasSectionMeta) : true
  if (homePage.loading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  return (
    <div
      className="home-page-root pb-14"
      style={{
        background:
          'radial-gradient(circle at 14% -6%, rgba(15,118,110,.12), transparent 36%), radial-gradient(circle at 92% -8%, rgba(15,23,42,.12), transparent 40%), #F2F7F8',
      }}
    >
      <MainCarousel />

      <section className="app-container" style={{ marginTop: 18 }}>
        <div
          className="surface-soft"
          style={{
            borderRadius: 18,
            padding: '12px 14px',
            display: 'grid',
            gap: 10,
            gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
            background: 'linear-gradient(125deg, #F6FCFC 0%, #EDF8F9 100%)',
          }}
        >
          {[
            {
              icon: <LocalShippingRoundedIcon sx={{ fontSize: 18, color: '#0F766E' }} />,
              title: 'Fast Delivery',
              desc: 'Tracked shipping across all orders',
              action: () => navigate(toCatalogPath()),
            },
            {
              icon: <SecurityRoundedIcon sx={{ fontSize: 18, color: '#0F766E' }} />,
              title: 'Secure Checkout',
              desc: 'Trusted payments and fraud protection',
              action: () => navigate('/cart'),
            },
            {
              icon: <AutorenewRoundedIcon sx={{ fontSize: 18, color: '#0F766E' }} />,
              title: 'Easy Returns',
              desc: 'Quick replacement and refund support',
              action: () => navigate('/account/orders'),
            },
          ].map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              style={{
                border: '1px solid #D7E8EA',
                borderRadius: 14,
                background: '#fff',
                textAlign: 'left',
                padding: '11px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  border: '1px solid #D6E8EA',
                  background: '#EFF9F8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              <span style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>{item.title}</p>
                <p style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{item.desc}</p>
              </span>
            </button>
          ))}
        </div>
      </section>

      {showHeroSpotlights && <HeroSpotlights />}
      {showElectronics && <TechFeatureRail data={data} />}
      {showTopBrands && <BrandShowcasePanel data={data} />}
      {showDailyDiscounts && <DailyDiscountSection data={data} />}
      {showShopByCategory && <ShopCategoryMosaic data={data} />}

      <section className="fixed right-5 bottom-5 sm:right-8 sm:bottom-8 z-[1200]">
        {showChatBot ? (
          <ChatBot handleClose={() => setShowChatBot(false)} mode="customer" />
        ) : (
          <Button
            variant="contained"
            onClick={() => setShowChatBot(true)}
            sx={{
              width: 58,
              minWidth: 58,
              height: 58,
              borderRadius: '50%',
              bgcolor: '#0F766E',
              boxShadow: '0 12px 20px rgba(15, 118, 110, 0.28)',
              '&:hover': { bgcolor: '#0B5F59' },
            }}
          >
            <ChatBubbleRoundedIcon sx={{ color: '#fff' }} />
          </Button>
        )}
      </section>
    </div>
  )
}
export default Home
