export const CATALOG_BASE_PATH = '/catalog'
export const toCatalogPath = (target) => {
  const normalized = (target || '').trim()
  if (!normalized || normalized === 'products' || normalized === '/products') {
    return CATALOG_BASE_PATH
  }
  if (normalized.startsWith('/products/')) {
    return `${CATALOG_BASE_PATH}/${normalized.slice('/products/'.length)}`
  }
  if (normalized === CATALOG_BASE_PATH || normalized.startsWith(`${CATALOG_BASE_PATH}/`)) {
    return normalized
  }
  if (normalized.startsWith('/')) {
    return normalized
  }
  return `${CATALOG_BASE_PATH}/${normalized}`
}
