import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { useAppSelector } from '../../../store'
import './Profile.css'
const UserDetails = () => {
  const { user } = useAppSelector((store) => store)
  const initials = user.user?.fullName
    ? user.user.fullName
        .split(' ')
        .map((item) => item[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'
  return (
    <div className="grid gap-4" style={{ maxWidth: 720 }}>
      <div className="amz-card">
        <div className="amz-card-header">
          <span>Personal details</span>
          <button className="amz-btn-secondary">
            <EditRoundedIcon sx={{ fontSize: 15 }} />
            Edit
          </button>
        </div>
        <div className="amz-card-body">
          <div className="flex items-center gap-4 mb-5">
            <div className="amz-user-avatar-circle">{initials}</div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {user.user?.fullName || 'Shopzy User'}
              </p>
              <p className="text-sm text-slate-500">Manage your account details and preferences</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['Full Name', user.user?.fullName || '-'],
              ['Email', user.user?.email || '-'],
              ['Mobile', user.user?.mobile || '-'],
            ].map(([label, value]) => (
              <div key={label} className="surface-soft p-3" style={{ borderRadius: 14 }}>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500 font-bold">
                  {label}
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserDetails
