import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { Button, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../store'
import SellerRoutes from '../../../routes/SellerRoutes'
import SellerDrawerList from '../../components/SideBar/DrawerList'
import ChatBot from '../../../customer/pages/ChatBot/ChatBot'
import { getSellerPageMeta } from '../../sellerNavigation'
const SellerDashboard = () => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showChatBot, setShowChatBot] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { sellers } = useAppSelector((store) => store)
  const pageMeta = useMemo(() => getSellerPageMeta(location), [location.pathname, location.search])
  const sellerName =
    sellers.profile?.sellerName ||
    sellers.profile?.businessDetails?.businessName ||
    'Seller Workspace'
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isDesktop ? '264px 1fr' : '1fr',
      }}
    >
      {isDesktop ? (
        <SellerDrawerList profile={sellers.profile} />
      ) : (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SellerDrawerList profile={sellers.profile} />
        </Drawer>
      )}

      <div style={{ minWidth: 0 }}>
        <header
          style={{
            borderBottom: '1px solid #DCE8EC',
            background: 'rgba(248,251,252,0.92)',
            backdropFilter: 'blur(10px)',
            padding: '14px 16px',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {!isDesktop && (
                  <IconButton onClick={() => setDrawerOpen(true)}>
                    <MenuRoundedIcon />
                  </IconButton>
                )}
                <StorefrontRoundedIcon sx={{ color: '#0F766E' }} />
                <span style={{ fontWeight: 800, color: '#0F172A' }}>Seller Panel</span>
                <span
                  style={{
                    border: '1px solid #CBE4E2',
                    background: '#ECF8F6',
                    color: '#0F766E',
                    borderRadius: 10,
                    padding: '5px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                  }}
                >
                  {pageMeta.groupTitle}
                </span>
              </div>

              <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', lineHeight: 1.08 }}>
                {pageMeta.title}
              </div>

              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{sellerName}</div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => navigate('/seller/add-product')}
                style={{
                  border: '1px solid #DCE8EC',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: 12,
                  padding: '9px 13px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <AddBoxRoundedIcon sx={{ fontSize: 16 }} />
                Add product
              </button>

              <button
                onClick={() => navigate('/seller/settlements')}
                style={{
                  border: '1px solid #DCE8EC',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: 12,
                  padding: '9px 13px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <PaymentsRoundedIcon sx={{ fontSize: 16 }} />
                Settlements
              </button>
            </div>
          </div>
        </header>

        <main style={{ padding: '18px', background: '#F3F7F8', minHeight: 'calc(100vh - 68px)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            <SellerRoutes />
          </div>
        </main>

        <section style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1200 }}>
          {showChatBot ? (
            <ChatBot handleClose={() => setShowChatBot(false)} mode="seller" />
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
    </div>
  )
}
export default SellerDashboard
