# I Require Sustenance

A food ordering service for a single restaurant. Guests browse the menu, add dishes
to a cart and place a pickup order. Restaurant staff manage the menu and the incoming
orders.

Built with React, React Router, TypeScript and Supabase (Auth, Database and Storage).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

## Environment variables

The app needs a Supabase project. Create one at [supabase.com](https://supabase.com),
then copy the values from **Project Settings -> API** into `.env.local`:

| Variable                 | Where to find it                     |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Project Settings -> API -> Project URL |
| `VITE_SUPABASE_ANON_KEY` | Project Settings -> API -> anon public key |

`.env.local` is git-ignored. Only client-safe keys belong in it — the `service_role`
key must never end up in the source code or in the repository.

## Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the dev server                    |
| `npm run build`   | Type-check and build for production     |
| `npm run lint`    | Run Oxlint                              |
| `npm run preview` | Preview the production build locally    |

## Project structure

```
src/
  lib/        Shared clients and low level helpers (Supabase client)
  services/   Database, auth and storage calls
  hooks/      Custom hooks that wrap the services
  context/    React context providers
  components/ Reusable UI components
  pages/      Route components
  types/      Shared TypeScript types
```
