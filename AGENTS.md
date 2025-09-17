# Agent Guidelines for ShopTal Client

## Build & Test Commands
- **Development**: `pnpm dev` (uses Turbopack)
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Test all**: `pnpm test`
- **Test watch**: `pnpm test:watch`
- **Single test**: `pnpm test -- --testNamePattern="TestName"` or `pnpm test path/to/test.tsx`

## Code Style Guidelines

### TypeScript & React
- Strict TypeScript enabled - all variables/functions must be typed
- React 19 with hooks only (no class components)
- Use "use client" directive for client components
- Component naming: PascalCase (e.g., `LoginForm`, `ProductCard`)
- Hook naming: camelCase with "use" prefix (e.g., `useSession`, `useForm`)

### File Structure & Naming
- Components: kebab-case (e.g., `login-form.tsx`, `product-card.tsx`)
- Hooks/utilities: camelCase (e.g., `useDebounce.ts`, `api.ts`)
- Path aliases: Use `@/*` for imports from `src/` directory

### Imports
```typescript
// Order: React, third-party libraries, local imports
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shadcn-ui/button";
import { api } from "@/lib/api";
```

### Styling
- Tailwind CSS with custom animations
- Use `clsx` or `cn` utility for conditional classes
- Pink color scheme primary (`text-pink-600`, `bg-pink-50`)
- Responsive design with mobile-first approach

### Forms & Validation
- React Hook Form with Zod schemas
- Form validation schemas at top of component files
- Error handling with toast notifications (Sonner)
- Loading states for async operations

### Error Handling
```typescript
try {
  // async operation
  toast.success("Success message");
} catch (error) {
  toast.error("Error message");
  console.error("Error details:", error);
}
```

### State Management
- Zustand for global state
- React Query for server state (if used)
- Local state with useState/useReducer

### Testing
- Jest with React Testing Library
- Component tests in `__tests__/` directory
- Mock external dependencies (e.g., next-auth)