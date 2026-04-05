import type { CartItem } from "../types/cartTypes";

const getItemQuantity = (item: CartItem): number => Number(item?.quantity ?? 1);

const getItemSellingPrice = (item: CartItem): number =>
  Number(item?.sellingPrice ?? item?.product?.sellingPrice ?? 0);

const getItemMrpPrice = (item: CartItem): number =>
  Number(item?.mrpPrice ?? item?.product?.mrpPrice ?? 0);

export const sumCartItemSellingPrice = (items: CartItem[]): number => {
  return items.reduce((acc, item) => {
    const qty = getItemQuantity(item);
    const price = getItemSellingPrice(item);
    return acc + price * qty;
  }, 0);
};

export const sumCartItemMrpPrice = (items: CartItem[]): number => {
  return items.reduce((acc, item) => {
    const qty = getItemQuantity(item);
    const price = getItemMrpPrice(item);
    return acc + price * qty;
  }, 0);
};
