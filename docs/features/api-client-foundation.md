# API Client Foundation

**Date:** 2026-03-10
**Related Files:** `src/api/client.ts`, `src/api/types.ts`, `src/__tests__/api/client.test.ts`, `src/__tests__/api/types.test.ts`

## Overview

A centralized API client built as a thin wrapper around native `fetch`, providing typed HTTP helpers (`get`, `post`, `put`, `patch`, `del`) with consistent error handling via a custom `ApiError` class. All future per-domain API modules (transactions, budget-plan, budget-tracking) should import and use these helpers rather than calling `fetch` directly.

## What Was Built

- `ApiError` class extending `Error` with `status`, `message`, and `body` properties
- 8 TypeScript interfaces covering all API domain types (Transaction, BudgetPlan, PaginatedResponse, etc.)
- Base `request<T>()` function with network error handling, non-2xx error parsing, 204/205 no-content support, and malformed JSON protection
- 5 exported HTTP helpers: `get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `del<T>()`
- Commented placeholder for future Authorization header injection

## Technical Implementation

### Key Files

- `src/api/types.ts`: All API type interfaces and the `ApiError` class. This is the single source of truth for API contracts.
- `src/api/client.ts`: The fetch wrapper. Reads `VITE_API_BASE_URL` from `import.meta.env` with fallback to `http://localhost:8000/api`.

### Key Patterns

- **Error categorization**: Network failures → `ApiError` with `status: 0`. Non-2xx responses → `ApiError` with actual HTTP status and parsed error body. Malformed JSON → `ApiError` with descriptive message. This three-tier approach lets consumers distinguish error types.
- **URL normalization**: Trailing slashes on the base URL are stripped; leading slashes on paths are ensured. This prevents double-slash issues (`/api//users`).
- **No-content responses**: 204 and 205 status codes return `undefined` instead of attempting JSON parse, preventing false "invalid response" errors.
- **Dependency isolation**: The `api/` module imports nothing from other `src/` modules. This is a strict boundary — keep it that way.

### Code Examples

```typescript
// Making a typed GET request
import { get } from "@/api/client"
import type { PaginatedResponse, Transaction } from "@/api/types"

const result = await get<PaginatedResponse<Transaction>>("/transactions?page=1")
console.log(result.data) // Transaction[]
```

```typescript
// Handling API errors
import { post } from "@/api/client"
import { ApiError } from "@/api/types"

try {
  await post("/transactions", { amount: 100, category: "Food" })
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      // Network failure — show connectivity message
    } else if (error.status === 422) {
      // Validation error — error.body may contain field-level details
    } else {
      // Other server error
    }
  }
}
```

## How to Use

1. Import the HTTP helper matching your method from `@/api/client`
2. Pass the API path (without base URL) and optional body for POST/PUT/PATCH
3. Use TypeScript generics to type the response: `get<MyType>("/path")`
4. Catch `ApiError` for error handling — check `status` to distinguish error types

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `VITE_API_BASE_URL` | string | `http://localhost:8000/api` | Base URL prepended to all API paths |

## Notes

- **No Axios**: The project uses native `fetch` intentionally (NFR-I3 compliance). Do not add Axios or other HTTP libraries.
- **Per-domain modules**: Future API modules (`transactions.ts`, `budget-plan.ts`, `budget-tracking.ts`) should be created in `src/api/` and use the helpers from `client.ts`. Do not duplicate the fetch logic.
- **Auth header**: A commented `TODO` placeholder exists in `client.ts` for future Authorization header injection. When auth is implemented, update the `headers` object in the `request()` function.
- **Content-Type**: All requests send `Content-Type: application/json`. If file uploads are needed in the future, the wrapper will need to be extended to support `multipart/form-data`.
