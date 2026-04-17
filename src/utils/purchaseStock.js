const normalizeProductId = (value) => {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

const normalizeQuantity = (value) => {
  const quantity = Number(value)
  if (!Number.isFinite(quantity)) return 0
  return quantity > 0 ? quantity : 0
}

export const getPurchasedItemsFromCart = (cartItems = []) => {
  if (!Array.isArray(cartItems) || !cartItems.length) return []

  const grouped = cartItems.reduce((acc, item) => {
    const productId = normalizeProductId(
      item?.productId ?? item?.product?.id ?? item?.product?.productId,
    )
    const quantity = normalizeQuantity(item?.quantity ?? item?.qty)

    if (!productId || quantity <= 0) return acc

    acc[productId] = (acc[productId] ?? 0) + quantity
    return acc
  }, {})

  return Object.entries(grouped).map(([productId, quantity]) => ({
    productId,
    quantity,
  }))
}
