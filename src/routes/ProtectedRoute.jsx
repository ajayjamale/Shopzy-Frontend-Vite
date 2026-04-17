import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../context/AppContext'
import { getCustomerToken, getRoleFromToken, getSellerToken } from '../utils/authToken'
/**
 * Centralised route guard.
 *
 * - Blocks unauthenticated access when requireAuth is true.
 * - Enforces role-based access when allowedRoles is provided.
 * - For sellers, optionally checks accountStatus to avoid blocked/unapproved access.
 * - Redirects with the current pathname preserved in state.to so login can bounce back.
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  requireAuth = true,
  requireSellerActive = false,
  fallback = '/login',
}) => {
  const location = useLocation()
  const { auth, user, sellers } = useAppSelector((s) => s)
  const customerJwt = auth.jwt || getCustomerToken()
  const sellerJwt = getSellerToken()
  const jwt = allowedRoles?.includes('ROLE_SELLER') ? sellerJwt || customerJwt : customerJwt
  const tokenRole =
    getRoleFromToken(jwt) || getRoleFromToken(customerJwt) || getRoleFromToken(sellerJwt)
  const role = sellers.profile?.role ?? user.user?.role ?? auth.role ?? tokenRole
  const sellerProfile = sellers.profile
  const sellerLoading = sellers.loading
  const sellerStatus = sellerProfile?.accountStatus?.toUpperCase?.()
  // Not logged in
  if (requireAuth && !jwt) {
    return <Navigate to={fallback} replace state={{ from: location.pathname }} />
  }
  // Role guard
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to={fallback} replace />
    }
  }
  // Seller status guard (must be approved/active)
  if (requireSellerActive) {
    if (sellerJwt && sellerLoading && !sellerProfile) {
      return <div style={{ padding: 24 }}>Loading seller profile...</div>
    }
    const blocked = ['SUSPENDED', 'BANNED', 'DEACTIVATED', 'CLOSED'].includes(sellerStatus || '')
    const pending = ['PENDING_VERIFICATION'].includes(sellerStatus || '')
    if (blocked || pending || !sellerProfile) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h2 style={{ margin: 0, color: '#111827' }}>Seller access unavailable</h2>
          <p style={{ maxWidth: 520, color: '#4B5563' }}>
            {blocked
              ? 'Your seller account is blocked or suspended. Please contact support.'
              : pending
                ? "Your seller account is pending approval. We'll notify you once it's activated."
                : 'Seller profile not found. Please complete seller onboarding.'}
          </p>
          <a
            href="/become-seller"
            style={{
              padding: '10px 16px',
              background: '#111827',
              color: '#fff',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Go to seller onboarding
          </a>
        </div>
      )
    }
  }
  return children
}
export default ProtectedRoute
