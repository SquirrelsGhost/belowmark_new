# Belowmark

A Next.js 16 project with TypeScript, Tailwind CSS 4, and PostgreSQL (Drizzle ORM).

## Getting Started

1. Configure your environment variables in `.env.local` (see `.env.example`):
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/belowmark
```

2. Push or migrate the PostgreSQL schema:
```bash
npm run db:push
```

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## Architecture

This project follows a strict **component-based architecture**. Every piece of UI is a component. Pages are composers only — they assemble components, never define raw JSX markup inline.

### Folder Structure

```
src/
├── app/                  # App Router — pages, layouts & API routes ONLY
├── components/           # All UI components
│   ├── navigation/       # Feature-grouped components
│   └── ui/               # Atomic primitives (Button, Badge, …)
├── db/                   # PostgreSQL connection pool (index.ts) & Drizzle schema (schema.ts)
├── hooks/                # Custom hooks (use*.ts)
├── lib/                  # Utilities, typed env & API helpers
├── services/             # Business logic & database services
├── translations/         # Type-safe i18n translations (DE / EN)
├── types/                # Shared TypeScript types
└── styles/               # globals.css only
```

### Key Rules

| Rule | Summary |
|---|---|
| **Component files** | `PascalCase.tsx`, one component per file, max 150 lines |
| **Props** | Explicit `interface Props`, no `any` |
| **Composition** | Prefer `<Parent><Child /></Parent>` over prop arrays |
| **Direct imports** | Import directly from component file path, no barrel `index.ts` |
| **Server/Client** | Default Server Component; `"use client"` only at leaf level |
| **Styling** | Tailwind classes only; no inline `style={{}}` |
| **Constants** | In `src/lib/constants.ts` or top of file — no magic strings in JSX |
| **Database** | PostgreSQL via Drizzle ORM (`src/db/`), business logic in `src/services/` |

> Full rules for AI agents are in [`AGENTS.md`](./AGENTS.md).

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (`pg` + Drizzle ORM) |
| Linting | ESLint 9 |
