# Frontend Architecture

This frontend follows a production-oriented structure with clear boundaries:

- `src/context`: App-wide Context API state provider and hooks
  - `AppContext.jsx`: Shared state/dispatch hooks
  - `AppProvider.jsx`: Root provider with combined reducers + thunk-capable dispatch
  - `miniToolkit.js`: Lightweight `createSlice`/`createAsyncThunk` compatibility layer
- `src/store`: Domain state modules (slice reducers + actions used by the app context)
  - `admin`: Admin state modules
  - `customer`: Customer state modules
  - `customer/home`: Customer home-page state modules
  - `seller`: Seller state modules
- `src/config`: App configuration (API client, env-facing config)
- `src/theme`: Design system theme setup
- `src/utils`: Shared utility helpers
- `src/routes`: Route maps and guards
- `src/admin`: Admin UI modules
  - `adminNavigation.jsx`: Shared admin navigation metadata and page-context helpers
- `src/customer`: Customer UI modules
- `src/seller`: Seller UI modules
  - `sellerNavigation.jsx`: Shared seller navigation metadata and page-context helpers
  - `theme/sellerUi.jsx`: Shared seller dashboard/page primitives, tokens, and formatting helpers
- `src/admin-seller`: Shared admin/seller UI components
- `src/components`: Shared presentational components
- `src/types`: Shared model helpers/constants
- `src/data`: Static app data

## Import Aliases

Configured aliases:

- `@/*` -> `src/*`
