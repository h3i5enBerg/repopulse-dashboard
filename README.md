# RepoPulse Dashboard

> Real-time Git repository audit dashboard and developer hygiene scoring engine powered by [`@nirajsatam/git-commit-audit`](https://www.npmjs.com/package/@nirajsatam/git-commit-audit).

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![npm package](https://img.shields.io/npm/v/@nirajsatam/git-commit-audit.svg)](https://www.npmjs.com/package/@nirajsatam/git-commit-audit)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

RepoPulse is a serverless-ready web application built with Next.js (App Router, React 19, TypeScript, Tailwind CSS) that connects directly to the live `@nirajsatam/git-commit-audit` npm package to audit public GitHub repositories or local git histories.

---

## Features

- **Live npm Package Integration**: Powered directly by [`@nirajsatam/git-commit-audit`](https://www.npmjs.com/package/@nirajsatam/git-commit-audit) installed from the public npm registry.
- **Serverless & Cloud Safe**: Clones shallow Git histories (`--depth` clamped between 5 and 50 commits) into temporary directories and safely removes them in `finally` blocks.
- **One-Click Presets**: Quick audit buttons for showcase repositories:
  - `https://github.com/h3i5enBerg/git-commit-audit`
  - `https://github.com/h3i5enBerg/TerminalMusicPlayer`
  - `https://github.com/h3i5enBerg/smart-expense-tracker`
- **KPI Summary Cards**: Real-time Health Score (0–100) with color-coded Grade badges (A–F), Conventional Commits compliance percentage, analyzed commit counts, and flagged issues.
- **Visual Analytics**: Interactive horizontal distribution charts for commit types (`feat`, `fix`, `docs`, `refactor`, `chore`, `other`) and contributor metrics.
- **Flagged Issues Table**: Details commit short hash, subject, author, rule violations (`conventional-format`, `lazy-message`, `bulk-commit`), penalties, and actionable fix suggestions.
- **Recent Commits Log**: Monospace commit logs with formatted timestamps and insertion/deletion badges.

---

## Live Package on npm

The engine behind RepoPulse is published on the official npm registry:
- **npm**: [`@nirajsatam/git-commit-audit`](https://www.npmjs.com/package/@nirajsatam/git-commit-audit)
- **Install**: `npm install @nirajsatam/git-commit-audit`
- **CLI**: `npx @nirajsatam/git-commit-audit`

---

## Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/h3i5enBerg/repopulse-dashboard.git
cd repopulse-dashboard

# Install dependencies from npm
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## Deployment Guide

### Deploying to Vercel

RepoPulse is optimized for Vercel with Node.js runtime and extended function timeouts (`maxDuration = 30`).

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Ensure the framework preset is set to **Next.js**.
4. Deploy without extra environment variables.

### Deploying via Vercel CLI

```bash
npm install -g vercel
vercel
```

---

## License

MIT © [h3i5enBerg](https://github.com/h3i5enBerg)
