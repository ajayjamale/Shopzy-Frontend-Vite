import { createContext, useContext } from 'react'

export const AppStateContext = createContext(null)
export const AppDispatchContext = createContext(null)

export const useAppDispatch = () => {
  const dispatch = useContext(AppDispatchContext)

  if (!dispatch) {
    throw new Error('useAppDispatch must be used inside AppProvider')
  }

  return dispatch
}

export const useAppSelector = (selector) => {
  const state = useContext(AppStateContext)

  if (state === null) {
    throw new Error('useAppSelector must be used inside AppProvider')
  }

  return selector(state)
}
