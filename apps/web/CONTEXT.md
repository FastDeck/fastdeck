# apps/web — Context

## What is this?

The `@fastdeck/web` workspace is the **public-facing web application** for FastDeck. It serves as the marketing site, documentation hub, and eventually the web dashboard for managing profiles online.

Built with **React 18 + Vite 5**, it shares the same design system tokens and shared types as the rest of the monorepo.

---

## Responsibilities

| Responsibility | Details |
|---------------|---------|
| **Marketing** | Landing page showcasing FastDeck features, screenshots, and downloads |
| **Documentation** | Getting started guides, plugin authoring docs, action references |
| **Web Dashboard** (V3) | Cloud-synced profile management, grid editor in the browser |
| **Design System host** | Canonical CSS design tokens shared across all web-rendered surfaces |

---

## Folder Structure

```
apps/web/
│
├── index.html                  # Entry HTML — SEO meta, Inter font, theme-color
├── vite.config.ts              # Vite: port 3000, @/ and @shared/ aliases
├── tsconfig.json               # Extends ../../tsconfig.base.json
├── package.json                # @fastdeck/web — React 18, Framer Motion, Vite
│
└── src/
    ├── main.tsx                # React DOM root (StrictMode)
    ├── App.tsx                 # Root application component / routing shell
    ├── index.css               # Global design system (tokens, reset, utilities)
    │
    ├── pages/                  # (planned) Route-level page components
    │   ├── Home.tsx            # Landing page / hero
    │   ├── Docs.tsx            # Documentation index
    │   └── Dashboard.tsx       # (V3) Authenticated profile manager
    │
    ├── components/             # (planned) Reusable UI components
    │   ├── Navbar/
    │   ├── Hero/
    │   ├── FeatureCard/
    │   └── Footer/
    │
    └── assets/                 # (planned) Static images, icons, og images
```

---

## Design System

The `src/index.css` file defines the canonical **CSS design tokens** for all web-rendered surfaces:

- **Color palette**: HSL-based with dark mode as default. Accent `hsl(250, 90%, 65%)`.
- **Glassmorphism**: `backdrop-filter: blur`, semi-transparent backgrounds, subtle borders.
- **Typography**: Inter font, fluid `clamp()` sizes from `xs` to `5xl`.
- **Spacing scale**: `--space-1` through `--space-24`.
- **Animations**: `fadeInUp`, `gradient-shift`, `pulse-glow`, `float` keyframes.
- **Components**: `.nav`, `.hero`, `.card`, `.btn`, `.card-grid`, `.footer`.

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `react@18` | UI framework |
| `react-dom@18` | DOM rendering |
| `framer-motion@11` | Animations — scroll-reveal, hover, page transitions |
| `vite@5` | Dev server and bundler |
| `@vitejs/plugin-react` | Vite React fast-refresh integration |
| `typescript@5` | Type safety |

---

## Scripts

```bash
yarn dev:web          # Start dev server at http://localhost:3000
yarn build:web        # TypeScript check + Vite production build
```

---

## Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@/` | `apps/web/src/` |
| `@shared/` | `packages/shared/src/` |

---

## SEO

Every page must include:
- `<title>FastDeck — [Page Name]</title>`
- `<meta name="description" content="..." />`
- A single `<h1>` per page
- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<footer>`)
- `lang="en"` on the root `<html>`
