const getItemQuantity = (item) => Number(item?.quantity ?? 1)
const getItemSellingPrice = (item) => Number(item?.sellingPrice ?? item?.product?.sellingPrice ?? 0)
const getItemMrpPrice = (item) => Number(item?.mrpPrice ?? item?.product?.mrpPrice ?? 0)
export const sumCartItemSellingPrice = (items) => {
  return items.reduce((acc, item) => {
    const qty = getItemQuantity(item)
    const price = getItemSellingPrice(item)
    return acc + price * qty
  }, 0)
}
export const sumCartItemMrpPrice = (items) => {
  return items.reduce((acc, item) => {
    const qty = getItemQuantity(item)
    const price = getItemMrpPrice(item)
    return acc + price * qty
  }, 0)
}
