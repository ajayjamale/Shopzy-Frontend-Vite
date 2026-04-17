import { useLocation, useNavigate } from 'react-router-dom'
import { adminMenuGroups, isAdminNavItemActive } from '../adminNavigation'
const AdminDrawerList = ({ pendingSellersCount = 0 }) => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <aside
      style={{
        width: 258,
        minHeight: '100%',
        background: '#FFFFFF',
        borderRight: '1px solid #DCE8EC',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <div
        style={{
          padding: '18px 16px',
          borderBottom: '1px solid #E7EFF2',
          display: 'grid',
          gap: 10,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#64748B',
              fontWeight: 700,
            }}
          >
            Admin Console
          </p>
          <h2 style={{ fontSize: '1.25rem', marginTop: 4, color: '#0F172A' }}>Shopzy Admin</h2>
        </div>

        {pendingSellersCount > 0 && (
          <button
            onClick={() => navigate('/admin/users?tab=sellers&status=PENDING_VERIFICATION')}
            style={{
              border: '1px solid #F6D38D',
              borderRadius: 14,
              background: '#FFF8E8',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 800, color: '#92400E' }}>Pending sellers</span>
            <span
              style={{
                minWidth: 28,
                height: 28,
                padding: '0 8px',
                borderRadius: 999,
                background: '#FFFFFF',
                border: '1px solid #F2D08A',
                color: '#B45309',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {pendingSellersCount > 99 ? '99+' : pendingSellersCount}
            </span>
          </button>
        )}
      </div>

      <nav
        style={{ padding: 12, display: 'grid', gap: 12, alignContent: 'start', overflowY: 'auto' }}
      >
        {adminMenuGroups.map((group) => (
          <div key={group.title} style={{ display: 'grid', gap: 6 }}>
            <p
              style={{
                margin: '2px 6px 0',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#94A3B8',
                fontWeight: 800,
              }}
            >
              {group.title}
            </p>

            {group.items.map((item) => {
              const active = isAdminNavItemActive(location, item)
              const badgeValue = item.badgeKey === 'pendingSellers' ? pendingSellersCount : 0
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    border: '1px solid',
                    borderColor: active ? '#6FB7B0' : '#E7EFF2',
                    background: active ? '#EAF7F5' : '#FFFFFF',
                    color: active ? '#0F766E' : '#334155',
                    borderRadius: 14,
                    textAlign: 'left',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: active ? '0 8px 24px rgba(15, 118, 110, 0.08)' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
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

                  <span style={{ display: 'grid', gap: 2, minWidth: 0, flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.87rem',
                        fontWeight: 800,
                        color: active ? '#0F766E' : '#0F172A',
                      }}
                    >
                      {item.label}
                    </span>
                  </span>

                  {badgeValue > 0 && (
                    <span
                      style={{
                        minWidth: 24,
                        height: 24,
                        padding: '0 7px',
                        borderRadius: 999,
                        background: '#FFF4D6',
                        color: '#B45309',
                        border: '1px solid #F6D38D',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {badgeValue > 99 ? '99+' : badgeValue}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid #E7EFF2', padding: '12px 14px' }}>
        <button
          onClick={() => {
            localStorage.removeItem('jwt')
            localStorage.removeItem('seller_jwt')
            navigate('/')
          }}
          style={{
            width: '100%',
            border: '1px solid #F6CBD6',
            background: '#FFF1F4',
            color: '#BE123C',
            borderRadius: 10,
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
export default AdminDrawerList
