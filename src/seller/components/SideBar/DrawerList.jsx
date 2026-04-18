import { useLocation, useNavigate } from 'react-router-dom'
import { isSellerNavItemActive, sellerMenuGroups } from '../../sellerNavigation'
import { ShopzyLogo } from '../../../components/ShopzyLogo'

const SellerDrawerList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <aside
      style={{
        width: 264,
        minHeight: '100%',
        background: '#ffffff',
        borderRight: '1px solid #DCE8EC',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <div
        style={{
          padding: '18px 16px',
          borderBottom: '1px solid #E6EFF2',
          display: 'grid',
          gap: 8,
        }}
      >
        <button
          onClick={() => navigate('/seller')}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            textAlign: 'left',
            cursor: 'pointer',
            width: 'fit-content',
          }}
        >
          <ShopzyLogo size={14} />
        </button>
        <p
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748B',
            fontWeight: 700,
            margin: 0,
          }}
        >
          Seller Console
        </p>
      </div>

      <nav
        style={{ padding: 12, display: 'grid', gap: 12, alignContent: 'start', overflowY: 'auto' }}
      >
        {sellerMenuGroups.map((group) => (
          <div key={group.title} style={{ display: 'grid', gap: 6 }}>
            {group.items.map((item) => {
              const active = isSellerNavItemActive(location, item)
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    border: '1px solid',
                    borderColor: active ? '#6DB4AD' : '#E7EFF2',
                    background: active ? '#EAF7F5' : '#FFFFFF',
                    color: active ? '#0F766E' : '#334155',
                    borderRadius: 10,
                    textAlign: 'left',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: active ? '0 8px 22px rgba(15, 118, 110, 0.08)' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: active ? '#FFFFFF' : '#F2F7F9',
                      border: '1px solid #DCE8EC',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      color: active ? '#0F766E' : '#0F172A',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid #E6EFF2', padding: '12px 14px' }}>
        <button
          onClick={() => {
            localStorage.removeItem('seller_jwt')
            navigate('/')
          }}
          style={{
            width: '100%',
            border: '1px solid #F4CDD5',
            background: '#FFF1F4',
            color: '#BE123C',
            borderRadius: 8,
            padding: '9px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
export default SellerDrawerList
