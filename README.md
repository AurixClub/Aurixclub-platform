# AURIX Club Website Monorepo

The official web platform and backend architecture for the **AURIX** club.

## Tech Stack

- **Monorepo Manager**: [Turborepo](https://turbo.build/) + [pnpm workspaces](https://pnpm.io/workspaces)
- **Frontend App**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animation & 3D**: [Framer Motion](https://www.framer.com/motion/), [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), [Drei](https://github.com/pmndrs/drei)
- **Backend & Database**: [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`)
- **Validation**: [Zod](https://zod.dev/)
- **Language**: TypeScript (Strict Mode)

---

## Directory Structure

```text
aurix/
├── apps/
│   └── web/                                # Next.js 15 Frontend Application
│       ├── app/
│       │   ├── (marketing)/
│       │   │   ├── page.tsx               # / (Home)
│       │   │   ├── about/page.tsx         # /about
│       │   │   ├── team/page.tsx          # /team
│       │   │   └── programs/page.tsx      # /programs
│       │   ├── login/page.tsx             # /login
│       │   ├── join/page.tsx              # /join
│       │   ├── layout.tsx                 # Root HTML Layout
│       │   ├── loading.tsx                # Loading UI
│       │   ├── error.tsx                  # Global Client Error Boundary
│       │   └── globals.css                # Tailwind CSS Directives & Variables
│       ├── components/
│       │   ├── layout/                    # Layout wrappers & containers
│       │   ├── navigation/                # Navbar, footer, menus
│       │   ├── home/                      # Home page sections
│       │   ├── about/                     # About page sections
│       │   ├── team/                      # Team page sections
│       │   ├── programs/                  # Programs page sections
│       │   ├── auth/                      # Authentication widgets
│       │   └── ui/                        # Reusable shadcn/ui components
│       ├── hooks/                         # Custom React hooks
│       ├── lib/                           # Utility functions & helpers
│       ├── public/
│       │   ├── images/                    # General static assets
│       │   └── aurix/                     # Club branding assets
│       └── package.json
├── packages/
│   ├── backend/                           # Backend Business Logic & Controllers
│   │   ├── controllers/                   # Request/Response handlers only
│   │   ├── services/                      # Business rules & orchestration
│   │   ├── models/                        # DB access layer
│   │   ├── validators/                    # Zod schemas & input validation
│   │   └── index.ts
│   ├── types/                             # Shared TypeScript Types
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── program.ts
│   │   ├── team.ts
│   │   ├── application.ts
│   │   └── index.ts
│   ├── supabase/                          # Supabase Client & Migrations
│   │   ├── client.ts                      # Browser Supabase client
│   │   ├── server.ts                      # Server / SSR Supabase client
│   │   ├── migrations/                    # SQL schema migrations
│   │   └── index.ts
│   ├── eslint-config/                     # Shared ESLint configuration
│   └── typescript-config/                 # Shared tsconfig presets
├── package.json                           # Root workspace manifest
├── pnpm-workspace.yaml                    # Workspace definitions
├── turbo.json                             # Turborepo pipeline configuration
├── tsconfig.json                          # Base root TypeScript config
├── .env.example                           # Environment variables template
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 18.0.0`
- [pnpm](https://pnpm.io/) `>= 9.0.0`

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` inside `apps/web` or at the root:

```bash
cp .env.example apps/web/.env.local
```

### 3. Run Development Server

```bash
pnpm dev
```

The web application will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts development server for all apps in parallel |
| `pnpm build` | Compiles and builds all packages and apps with Turborepo caching |
| `pnpm type-check` | Runs strict TypeScript type-checking across the entire monorepo |
| `pnpm lint` | Runs ESLint across all apps and packages |

---

## Architectural Rules

1. **Frontend**: All UI and page routes belong in `apps/web`.
2. **Backend**: Business logic belongs in `packages/backend`.
3. **Layer Separation**: Database access goes through `models → services → controllers`.
4. **Controllers**: Must only handle input parsing, calling services, and formatting HTTP responses.
5. **Types**: Shared data types must live in `packages/types` and be reused across frontend and backend.
6. **Strict Types**: Strict mode is enabled everywhere. Never use `any`.
