import { useState } from 'react'
import { Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import AdminRoutes from '../../../routes/AdminRoutes'
import AdminDrawerList from '../../components/DrawerList'
import { getAdminPageMeta } from '../../adminNavigation'
const DEAL_PATHS = ['/admin/deals', '/admin/daily-deals', '/admin/daily-discounts']
const DEFAULT_SELLER_STATUS = 'PENDING_VERIFICATION'
const AdminDashboard = () => {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pageMeta = getAdminPageMeta(location)
  const titleOverrides = {
    '/admin/coupon': 'Coupon Management',
    '/admin/home-content': 'Homepage Content Studio',
    '/admin/daily-discounts': 'Daily Discounts',
    '/admin/deals': 'Daily Discounts',
    '/admin/daily-deals': 'Daily Discounts',
    '/admin/users': 'User Management',
  }
  const settlementDetailMatch = location.pathname.match(/^\/admin\/settlements\/([^/]+)$/)
  const navbarTitle =
    (settlementDetailMatch ? `Settlement #${settlementDetailMatch[1]}` : null) ||
    titleOverrides[location.pathname] ||
    pageMeta.title
  const query = new URLSearchParams(location.search)
  const couponView = query.get('view') === 'create' ? 'create' : 'list'
  const discountView = query.get('view') === 'create' ? 'create' : 'list'
  const usersTab = query.get('tab') === 'sellers' ? 'sellers' : 'customers'
  const applyQuery = (mutator, pathname = location.pathname) => {
    const next = new URLSearchParams(location.search)
    mutator(next)
    const queryString = next.toString()
    navigate(queryString ? `${pathname}?${queryString}` : pathname)
  }
  const navbarActions = []
  if (location.pathname === '/admin/coupon') {
    navbarActions.push(
      {
        key: 'coupon-list',
        label: 'Coupons',
        active: couponView === 'list',
        onClick: () => applyQuery((next) => next.delete('view')),
      },
      {
        key: 'coupon-create',
        label: 'Create Coupon',
        active: couponView === 'create',
        onClick: () => applyQuery((next) => next.set('view', 'create')),
      },
    )
  }
  if (location.pathname === '/admin/home-content') {
    navbarActions.push({
      key: 'home-content-add',
      label: 'Add Item',
      active: false,
      onClick: () => applyQuery((next) => next.set('action', 'create')),
    })
  }
  if (DEAL_PATHS.includes(location.pathname)) {
    navbarActions.push(
      {
        key: 'discount-list',
        label: 'Daily Discounts',
        active: discountView === 'list',
        onClick: () => applyQuery((next) => next.delete('view')),
      },
      {
        key: 'discount-create',
        label: 'Create Discount',
        active: discountView === 'create',
        onClick: () => applyQuery((next) => next.set('view', 'create')),
      },
    )
  }
  if (location.pathname === '/admin/users') {
    navbarActions.push(
      {
        key: 'users-customers',
        label: 'Customers',
        active: usersTab === 'customers',
        onClick: () =>
          applyQuery((next) => {
            next.set('tab', 'customers')
            next.delete('status')
          }),
      },
      {
        key: 'users-sellers',
        label: 'Sellers',
        active: usersTab === 'sellers',
        onClick: () =>
          applyQuery((next) => {
            next.set('tab', 'sellers')
            if (!next.get('status')) {
              next.set('status', DEFAULT_SELLER_STATUS)
            }
          }),
      },
    )
  }
  if (settlementDetailMatch) {
    navbarActions.unshift({
      key: 'settlement-back',
      label: 'Back to Settlements',
      active: false,
      onClick: () => navigate('/admin/settlements'),
    })
  }
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: isDesktop ? '258px 1fr' : '1fr',
      }}
    >
      {isDesktop ? (
        <AdminDrawerList />
      ) : (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <AdminDrawerList />
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
              alignItems: 'center',
              gap: 10,
            }}
          >
            {!isDesktop && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            )}
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '0.02em',
              }}
            >
              {navbarTitle}
            </span>

            {navbarActions.length > 0 && (
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {navbarActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={action.onClick}
                    style={{
                      border: `1px solid ${action.active ? '#0F766E' : '#DCE8EC'}`,
                      background: action.active ? '#0F766E' : '#FFFFFF',
                      color: action.active ? '#FFFFFF' : '#0F172A',
                      borderRadius: 999,
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: 18, background: '#F3F7F8', minHeight: 'calc(100vh - 62px)' }}>
          <div
            style={{ maxWidth: 1460, margin: '0 auto', width: '100%', display: 'grid', gap: 18 }}
          >
            <AdminRoutes />
          </div>
        </main>
      </div>
    </div>
  )
}
export default AdminDashboard
