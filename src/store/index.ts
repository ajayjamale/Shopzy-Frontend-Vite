import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

// Customer slices
import sellerSlice from "./seller/sellerSlice";
import sellerAuthenticationSlice from "./seller/sellerAuthenticationSlice";
import sellerProductSlice from "./seller/sellerProductSlice";
import ProductSlice from "./customer/ProductSlice";
import CartSlice from "./customer/CartSlice";
import AuthSlice from "./customer/AuthSlice";
import UserSlice from "./customer/UserSlice";
import OrderSlice from "./customer/OrderSlice";
import sellerOrderSlice from "./seller/sellerOrderSlice";
import payoutSlice from "./seller/payoutSlice";
import transactionSlice from "./seller/transactionSlice";
import CouponSlice from "./customer/CouponSlice";
import AdminCouponSlice from "./admin/AdminCouponSlice";
import ReviewSlice from "./customer/ReviewSlice";
import WishlistSlice from "./customer/WishlistSlice";
import AiChatBotSlice from "./customer/AiChatBotSlice";
import revenueChartSlice from "./seller/revenueChartSlice";
import CustomerSlice from "./customer/home/CustomerSlice";
import DealSlice from "./admin/DealSlice";
import AdminSlice from "./admin/AdminSlice";
import settlementSlice from "./seller/settlementSlice";
import returnSlice from "./customer/ReturnSlice";

const rootReducer = combineReducers({
  // customer
  auth: AuthSlice,
  user: UserSlice,
  products: ProductSlice,
  cart: CartSlice,
  orders: OrderSlice,
  coupone: CouponSlice,
  review: ReviewSlice,
  wishlist: WishlistSlice,
  aiChatBot: AiChatBotSlice,
  homePage: CustomerSlice,
  returns: returnSlice,

  // seller
  sellers: sellerSlice,
  sellerAuth: sellerAuthenticationSlice,
  sellerProduct: sellerProductSlice,
  sellerOrder: sellerOrderSlice,
  payouts: payoutSlice,
  transaction: transactionSlice,
  revenueChart: revenueChartSlice,
  settlement: settlementSlice,

  // admin
  adminCoupon: AdminCouponSlice,
  admin: AdminSlice,
  deal: DealSlice,
});

const store = configureStore({
  reducer: rootReducer,
  // No need to define middleware unless you're adding custom ones
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
