export const getCustomerToken = () => localStorage.getItem('jwt') || ''
export const getAdminToken = () => localStorage.getItem('jwt') || ''
export const getSellerToken = () => localStorage.getItem('seller_jwt') || ''
const parseJwtPayload = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}
export const getRoleFromToken = (token) => {
  if (!token) return null
  const payload = parseJwtPayload(token)
  const authorities = payload?.authorities || payload?.role || ''
  if (!authorities) return null
  if (authorities.includes('ROLE_ADMIN')) return 'ROLE_ADMIN'
  if (authorities.includes('ROLE_SELLER')) return 'ROLE_SELLER'
  if (authorities.includes('ROLE_CUSTOMER')) return 'ROLE_CUSTOMER'
  const first = authorities.split(',')[0]?.trim()
  return first || null
}
