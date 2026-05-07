# IELTS SAT Study Tracker

A full-stack personal Notion-style study dashboard for IELTS, SAT, daily planning, vocabulary, habits, notes, calendar items, goals, streaks, and progress charts.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- Recharts
- date-fns

## Setup Commands

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run prisma:seed
npm run dev
```

Open the local URL printed by Next.js, usually:

```bash
http://localhost:3000
```

## Database Commands

```bash
npm run db:migrate
npm run prisma:seed
npm run db:studio
```

## Run Locally

```bash
npm run dev
```

For a production build check:

```bash
npm run build
```

## Folder Structure

```text
app/                 Next.js pages, layouts, and API routes
app/api/             CRUD endpoints for study data
components/          Reusable UI and feature components
components/ui/       Small shared UI helpers
lib/                 Prisma, API, date, and client utilities
prisma/              Prisma schema and seed script
types/               Shared TypeScript entity types
```
