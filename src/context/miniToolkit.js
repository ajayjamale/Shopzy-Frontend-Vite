const createTypeAction = (type) => {
  const actionCreator = (payload) => ({ type, payload })
  actionCreator.type = type
  actionCreator.toString = () => type
  actionCreator.match = (action) => action?.type === type
  return actionCreator
}

const isObjectLike = (value) => typeof value === 'object' && value !== null

const cloneState = (state) => {
  if (!isObjectLike(state)) {
    return state
  }

  if (typeof structuredClone === 'function') {
    return structuredClone(state)
  }

  return JSON.parse(JSON.stringify(state))
}

const serializeError = (error) => {
  if (error && typeof error === 'object') {
    return {
      message: error.message || 'Rejected',
    }
  }

  return {
    message: String(error || 'Rejected'),
  }
}

const createRejectWithValueResult = (payload) => ({
  __rtk_rejectWithValue: true,
  payload,
})

const createFulfillWithValueResult = (payload) => ({
  __rtk_fulfillWithValue: true,
  payload,
})

export const createAsyncThunk = (typePrefix, payloadCreator) => {
  const pendingType = `${typePrefix}/pending`
  const fulfilledType = `${typePrefix}/fulfilled`
  const rejectedType = `${typePrefix}/rejected`

  const thunkActionCreator = (arg) => (dispatch, getState) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`

    const execution = (async () => {
      dispatch({
        type: pendingType,
        meta: {
          arg,
          requestId,
          requestStatus: 'pending',
        },
      })

      try {
        const result = await payloadCreator(arg, {
          dispatch,
          getState,
          arg,
          requestId,
          rejectWithValue: createRejectWithValueResult,
          fulfillWithValue: createFulfillWithValueResult,
        })

        if (result?.__rtk_rejectWithValue) {
          const rejectedAction = {
            type: rejectedType,
            payload: result.payload,
            error: { message: 'Rejected' },
            meta: {
              arg,
              requestId,
              rejectedWithValue: true,
              requestStatus: 'rejected',
            },
          }
          dispatch(rejectedAction)
          return rejectedAction
        }

        const payload = result?.__rtk_fulfillWithValue ? result.payload : result
        const fulfilledAction = {
          type: fulfilledType,
          payload,
          meta: {
            arg,
            requestId,
            requestStatus: 'fulfilled',
          },
        }
        dispatch(fulfilledAction)
        return fulfilledAction
      } catch (error) {
        if (error?.__rtk_rejectWithValue) {
          const rejectedAction = {
            type: rejectedType,
            payload: error.payload,
            error: { message: 'Rejected' },
            meta: {
              arg,
              requestId,
              rejectedWithValue: true,
              requestStatus: 'rejected',
            },
          }
          dispatch(rejectedAction)
          return rejectedAction
        }

        const rejectedAction = {
          type: rejectedType,
          error: serializeError(error),
          meta: {
            arg,
            requestId,
            requestStatus: 'rejected',
          },
        }
        dispatch(rejectedAction)
        return rejectedAction
      }
    })()

    execution.unwrap = async () => {
      const finalAction = await execution
      if (finalAction.type === fulfilledType) {
        return finalAction.payload
      }

      if ('payload' in finalAction) {
        throw finalAction.payload
      }

      throw finalAction.error || new Error('Async thunk rejected')
    }

    return execution
  }

  thunkActionCreator.typePrefix = typePrefix
  thunkActionCreator.pending = createTypeAction(pendingType)
  thunkActionCreator.fulfilled = createTypeAction(fulfilledType)
  thunkActionCreator.rejected = createTypeAction(rejectedType)

  return thunkActionCreator
}

export const createSlice = ({ name, initialState, reducers = {}, extraReducers }) => {
  const caseReducers = new Map()
  const actions = {}

  Object.entries(reducers).forEach(([key, reducerConfig]) => {
    const type = `${name}/${key}`
    const isPreparedReducer =
      typeof reducerConfig === 'object' &&
      reducerConfig !== null &&
      typeof reducerConfig.reducer === 'function'

    if (isPreparedReducer) {
      const { reducer, prepare } = reducerConfig
      caseReducers.set(type, reducer)

      const actionCreator = (...args) => {
        const prepared = typeof prepare === 'function' ? prepare(...args) : { payload: args[0] }
        return {
          type,
          ...prepared,
        }
      }

      actionCreator.type = type
      actionCreator.toString = () => type
      actions[key] = actionCreator
      return
    }

    caseReducers.set(type, reducerConfig)
    actions[key] = createTypeAction(type)
  })

  if (typeof extraReducers === 'function') {
    const builder = {
      addCase(actionOrType, reducer) {
        const actionType =
          typeof actionOrType === 'string'
            ? actionOrType
            : actionOrType?.type || actionOrType?.toString?.()

        if (!actionType) {
          throw new Error('Invalid action type provided to addCase')
        }

        caseReducers.set(actionType, reducer)
        return builder
      },
    }

    extraReducers(builder)
  } else if (extraReducers && typeof extraReducers === 'object') {
    Object.entries(extraReducers).forEach(([type, reducer]) => {
      caseReducers.set(type, reducer)
    })
  }

  const reducer = (state = initialState, action) => {
    const caseReducer = caseReducers.get(action.type)
    if (!caseReducer) {
      return state
    }

    const draftState = cloneState(state)
    const result = caseReducer(draftState, action)

    return typeof result === 'undefined' ? draftState : result
  }

  return {
    name,
    reducer,
    actions,
  }
}
