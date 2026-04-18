import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { Button, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const pageMeta = useMemo(() => getSellerPageMeta(location), [location.pathname, location.search])
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isDesktop ? '264px 1fr' : '1fr',
      }}
    >
      {isDesktop ? (
        <SellerDrawerList />
      ) : (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SellerDrawerList />
        </Drawer>
      )}

      <div style={{ minWidth: 0 }}>
        <header
          style={{
            borderBottom: '1px solid #DCE8EC',
            background: 'rgba(248,251,252,0.95)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div
            style={{
              height: 62,
              padding: '0 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {!isDesktop && (
                <IconButton onClick={() => setDrawerOpen(true)}>
                  <MenuRoundedIcon />
                </IconButton>
              )}
              <StorefrontRoundedIcon sx={{ color: '#0F766E' }} />
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '0.02em',
                }}
              >
                {pageMeta.title}
              </span>
            </div>

            <div
              style={{
                marginLeft: 'auto',
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
                  borderRadius: 999,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  whiteSpace: 'nowrap',
                }}
              >
                <AddBoxRoundedIcon sx={{ fontSize: 16 }} />
                Add Product
              </button>

              <button
                onClick={() => navigate('/seller/settlements')}
                style={{
                  border: '1px solid #DCE8EC',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: 999,
                  padding: '8px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  whiteSpace: 'nowrap',
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
