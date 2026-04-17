import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../store'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const fallbackDeals = [
  {
    category: {
      categoryId: 'women_indian_and_fusion_wear',
      image:
        'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/22866694/2023/4/24/98951db4-e0a5-47f8-a1be-353863d24dc01682349679664KaliniOrangeSilkBlendEthnicWovenDesignFestiveSareewithMatchi2.jpg',
    },
    discount: 40,
  },
  {
    category: {
      categoryId: 'men_topwear',
      image:
        'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/23029834/2023/9/18/96c015ae-1090-4036-954b-d9c80085b1d71695022844653-HRX-by-Hrithik-Roshan-Men-Jackets-6981695022843934-1.jpg',
    },
    discount: 35,
  },
  {
    category: {
      categoryId: 'women_footwear',
      image:
        'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28024048/2024/3/5/fca98389-f9d6-4f19-b82a-53c7ee0518ec1709633175836CORSICABlockSandalswithBows1.jpg',
    },
    discount: 50,
  },
  {
    category: {
      categoryId: 'home_decor',
      image:
        'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/28460938/2024/3/22/7fb09e9c-86e0-4602-b54e-fa5c0171b50b1711104156746IrregularMirrorHomeDecor1.jpg',
    },
    discount: 30,
  },
  {
    category: {
      categoryId: 'headphones_headsets',
      image:
        'https://rukminim2.flixcart.com/image/612/612/kz4gh3k0/headphone/c/v/r/-original-imagb7bmhdgghzxq.jpeg?q=70',
    },
    discount: 45,
  },
  {
    category: {
      categoryId: 'men_bottomwear',
      image:
        'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/20122324/2022/9/22/91c61c45-fe17-4d1d-8e20-0aaaf90186b61663827920015RaymondSlimFitBlueJeansForMen1.jpg',
    },
    discount: 25,
  },
]
const DealCard = ({ deal }) => {
  const navigate = useNavigate()
  const target = deal.redirectLink || deal.category?.categoryId || ''
  const label = (deal.title || target || 'deal').split('_').join(' ')
  const image = deal.image || deal.imageUrl || deal.category?.image
  const discount = deal.discountLabel || deal.discount || 'Hot'
  if (!image) return null
  return (
    <div
      onClick={() => target && navigate(toCatalogPath(target))}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #E4EDF0',
        background: '#fff',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-5px)'
        el.style.boxShadow = '0 14px 32px rgba(0,0,0,0.08)'
        el.style.borderColor = '#6FB7B0'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = 'none'
        el.style.boxShadow = 'none'
        el.style.borderColor = '#E4EDF0'
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={image}
          alt={label}
          style={{
            width: '100%',
            height: 'clamp(140px, 17vw, 200px)',
            objectFit: 'cover',
            objectPosition: 'top',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.07)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: '#0F766E',
            color: '#fff',
            borderRadius: 6,
            padding: '5px 10px',
            fontWeight: 800,
            fontSize: 12,
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          {discount}
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#0F172A',
            textTransform: 'capitalize',
            margin: '0 0 6px',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </p>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#0F766E',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Shop now -&gt;
        </span>
      </div>
    </div>
  )
}
const Deals = ({ title = 'Daily Deals' }) => {
  const navigate = useNavigate()
  const { homePage } = useAppSelector((s) => s)
  const [clock, setClock] = useState({ h: 8, m: 24, s: 17 })
  const deals = useMemo(() => {
    const liveDeals = (homePage.homePageData?.deals || []).filter((item) => item?.active !== false)
    return liveDeals.length ? liveDeals : fallbackDeals
  }, [homePage.homePageData?.deals])
  const featuredDeal = useMemo(() => {
    if (!deals.length) return null
    return [...deals].sort((a, b) => (Number(b?.discount) || 0) - (Number(a?.discount) || 0))[0]
  }, [deals])
  useEffect(() => {
    const timer = setInterval(() => {
      setClock((prev) => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) {
          s = 59
          m -= 1
        }
        if (m < 0) {
          m = 59
          h -= 1
        }
        if (h < 0) h = 23
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  if (!deals.length) return null
  const pad = (num) => String(num).padStart(2, '0')
  return (
    <section style={{ padding: 'clamp(40px,5.5vw,72px) 0' }}>
      <style>
        {`
          @keyframes adminDealBlink {
            0%,100% { opacity: 1; box-shadow: 0 0 0 rgba(239, 68, 68, .1); }
            50% { opacity: .7; box-shadow: 0 0 24px rgba(239, 68, 68, .35); }
          }
        `}
      </style>
      <div style={{ padding: '0 clamp(16px,5.5vw,80px)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 'clamp(24px,3.5vw,40px)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <span
                style={{ width: 24, height: 1.5, background: '#0F766E', display: 'inline-block' }}
              />
              Updated from Admin
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(26px,3.8vw,52px)',
                fontWeight: 600,
                color: '#0F172A',
                letterSpacing: '-.02em',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {title}
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F4FAFB',
              border: '1px solid #DCE8EC',
              borderRadius: 12,
              padding: '12px 20px',
            }}
          >
            {[
              ['Hrs', clock.h],
              ['Min', clock.m],
              ['Sec', clock.s],
            ].map(([label, value], index) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(20px,2.8vw,32px)',
                      fontWeight: 700,
                      color: '#0F766E',
                      lineHeight: 1,
                    }}
                  >
                    {pad(value)}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: '#64748B',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </div>
                </div>
                {index < 2 && (
                  <span style={{ fontSize: 22, color: '#0F766E', opacity: 0.45, marginBottom: 10 }}>
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {featuredDeal && (
          <div
            onClick={() => {
              const target = featuredDeal.redirectLink || featuredDeal.category?.categoryId
              if (!target) return
              navigate(toCatalogPath(target))
            }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 16,
              border: '1px solid #D8E8EB',
              background: 'linear-gradient(124deg, #0F172A 0%, #0B5F59 54%, #14B8A6 100%)',
              padding: 'clamp(18px,2.2vw,28px)',
              marginBottom: 'clamp(16px,2vw,24px)',
              cursor: 'pointer',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 14,
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  display: 'inline-flex',
                  borderRadius: 999,
                  background: '#BE123C',
                  color: '#fff',
                  padding: '6px 12px',
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '.12em',
                  animation: 'adminDealBlink 1s ease-in-out infinite',
                }}
              >
                TODAY'S DEAL
              </span>
              <h3
                style={{
                  margin: '14px 0 6px',
                  fontSize: 'clamp(1.15rem,2.1vw,1.6rem)',
                  color: '#fff',
                  textTransform: 'capitalize',
                }}
              >
                {featuredDeal.discountLabel || `${featuredDeal.discount}% OFF`} on{' '}
                {(featuredDeal.title || featuredDeal.category?.categoryId || 'selected picks')
                  .split('_')
                  .join(' ')}
              </h3>
              <p style={{ margin: 0, color: '#C8F0EB', fontSize: 13 }}>
                Admin-updated limited-time offer. Tap to shop now.
              </p>
            </div>

            <div
              style={{
                width: '100%',
                height: 'clamp(120px,16vw,170px)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.22)',
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              <img
                src={featuredDeal.image || featuredDeal.imageUrl || featuredDeal.category?.image}
                alt={featuredDeal.title || featuredDeal.category?.categoryId || 'Featured deal'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'clamp(12px,1.8vw,20px)',
          }}
        >
          {deals.map((deal, index) => (
            <DealCard
              key={deal.id || `${deal.category?.categoryId || 'deal'}-${index}`}
              deal={deal}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'clamp(28px,3.5vw,44px)' }}>
          <button
            onClick={() => navigate(toCatalogPath())}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              borderRadius: 999,
              background: 'linear-gradient(135deg,#0F766E,#14B8A6)',
              border: '1.5px solid #0F766E',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all .22s ease',
            }}
            onMouseEnter={(e) => {
              const button = e.currentTarget
              button.style.transform = 'translateY(-1px)'
              button.style.boxShadow = '0 14px 26px rgba(15,118,110,0.28)'
            }}
            onMouseLeave={(e) => {
              const button = e.currentTarget
              button.style.transform = 'none'
              button.style.boxShadow = 'none'
            }}
          >
            View all deals -&gt;
          </button>
        </div>
      </div>
    </section>
  )
}
export default Deals
