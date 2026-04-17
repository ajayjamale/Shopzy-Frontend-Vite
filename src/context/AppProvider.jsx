import { useCallback, useRef, useState } from 'react'
import { AppDispatchContext, AppStateContext } from './AppContext'

import sellerSlice from '../store/seller/sellerSlice'
import sellerAuthenticationSlice from '../store/seller/sellerAuthenticationSlice'
import sellerProductSlice from '../store/seller/sellerProductSlice'
import ProductSlice from '../store/customer/ProductSlice'
import CartSlice from '../store/customer/CartSlice'
import AuthSlice from '../store/customer/AuthSlice'
import UserSlice from '../store/customer/UserSlice'
import OrderSlice from '../store/customer/OrderSlice'
import sellerOrderSlice from '../store/seller/sellerOrderSlice'
import payoutSlice from '../store/seller/payoutSlice'
import transactionSlice from '../store/seller/transactionSlice'
import CouponSlice from '../store/customer/CouponSlice'
import AdminCouponSlice from '../store/admin/AdminCouponSlice'
import ReviewSlice from '../store/customer/ReviewSlice'
import WishlistSlice from '../store/customer/WishlistSlice'
import AiChatBotSlice from '../store/customer/AiChatBotSlice'
import revenueChartSlice from '../store/seller/revenueChartSlice'
import CustomerSlice from '../store/customer/home/CustomerSlice'
import DealSlice from '../store/admin/DealSlice'
import AdminSlice from '../store/admin/AdminSlice'
import settlementSlice from '../store/seller/settlementSlice'
import returnSlice from '../store/customer/ReturnSlice'

const combineReducers = (reducersMap) => {
  const reducerKeys = Object.keys(reducersMap)

  return (state = {}, action) => {
    let hasChanged = false
    const nextState = {}

    for (const key of reducerKeys) {
      const reducer = reducersMap[key]
      const previousValue = state[key]
      const nextValue = reducer(previousValue, action)

      nextState[key] = nextValue
      hasChanged = hasChanged || nextValue !== previousValue
    }

    return hasChanged ? nextState : state
  }
}

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
})

const initialState = rootReducer(undefined, { type: '@@INIT' })

const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(initialState)

  const getState = useCallback(() => stateRef.current, [])

  const dispatch = useCallback(
    (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }

      if (!action || typeof action.type === 'undefined') {
        throw new Error('Dispatch expected an action object or a thunk function')
      }

      setState((previousState) => {
        const nextState = rootReducer(previousState, action)
        stateRef.current = nextState
        return nextState
      })

      return action
    },
    [getState],
  )

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export default AppProvider
