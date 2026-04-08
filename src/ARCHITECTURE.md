# Frontend Architecture

This frontend follows a production-oriented structure with clear boundaries:

- `src/store`: Redux store and slices
  - `admin`: Admin slices
  - `customer`: Customer slices
  - `customer/home`: Customer home-page state
  - `seller`: Seller slices
- `src/config`: App configuration (API client, env-facing config)
- `src/theme`: Design system theme setup
- `src/utils`: Shared utility helpers
- `src/routes`: Route maps and guards
- `src/admin`: Admin UI modules
- `src/customer`: Customer UI modules
- `src/seller`: Seller UI modules
- `src/admin-seller`: Shared admin/seller UI components
- `src/components`: Shared presentational components
- `src/types`: Shared TypeScript models
- `src/data`: Static app data

## Import Aliases

Configured aliases:

- `@/*` -> `src/*`
- `@store/*` -> `src/store/*`
- `@config/*` -> `src/config/*`
- `@utils/*` -> `src/utils/*`
- `@types/*` -> `src/types/*`
