# Life Organizer Frontend

React + TypeScript frontend built with Vite, Tailwind CSS, and shadcn/ui.

## Prerequisites

- Node.js 20+
- npm
- Backend API running at `http://localhost:8000` (see [life-organizer-be](../life-organizer-be))

## Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
```

## Development

```bash
# Start dev server (default: http://localhost:5173)
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
```

Components are placed in `src/components/ui/`. Import them as:

```tsx
import { Button } from "@/components/ui/button"
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** - build tool
- **Tailwind CSS 4** - styling
- **shadcn/ui** + Radix UI - component library
- **React Router 7** - routing
- **TanStack React Query** - server state management
- **Recharts** - charts
- **Vitest** + React Testing Library - testing
