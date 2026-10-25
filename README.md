# MemeShelf

MemeShelf is a personal meme library: upload WebP and GIF images, search your collection, and install the app as a PWA with Web Share Target support on supported platforms.

**Stack:** [Next.js](https://nextjs.org/) (App Router) · [Convex](https://convex.dev/) (database, auth, file storage, background jobs) · Google sign-in via [@convex-dev/auth](https://labs.convex.dev/auth)

## Features

- Google authentication and per-user media isolation
- Shelf grid with search (Convex full-text search)
- Upload via dialog, drag-and-drop, clipboard paste, and PWA share target
- Optional AI-generated titles, captions, and tags (Vercel AI Gateway) or local mock enrichment
- Thumbnail generation with [Sharp](https://sharp.pixelplumbing.com/) on Convex Node actions

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+
- A [Convex](https://convex.dev/) account and CLI (`pnpm add -g convex` or `pnpm exec convex`)
- A [Google Cloud](https://console.cloud.google.com/) OAuth 2.0 client (Web application) for sign-in
- (Optional) [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key for production-style metadata enrichment

## Quick start

1. **Clone and install**

   ```bash
   git clone https://github.com/ErfanEbrahimnia/memeshelf.git
   cd memeshelf
   pnpm install
   ```

2. **Environment**

   Copy the example file and fill in values from your Convex dev deployment:

   ```bash
   cp .env.example .env.local
   ```

   Run Convex in dev mode once to create/link a deployment and populate `NEXT_PUBLIC_CONVEX_URL` (and related vars) in `.env.local`:

   ```bash
   pnpm exec convex dev
   ```

   See [.env.example](./.env.example) for local vs Convex deployment variables.

3. **Convex Auth (Google)**

   Configure auth secrets on your Convex deployment (Dashboard → Settings → Environment variables, or `pnpm exec convex env set`). At minimum you need:

   - `SITE_URL` — app origin (e.g. `http://localhost:3000` for local dev)
   - `JWT_PRIVATE_KEY` and `JWKS` — signing keys for sessions ([Convex Auth setup](https://labs.convex.dev/auth/setup))
   - `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` — from your Google OAuth client

   In Google Cloud Console, add authorized redirect URIs for Convex Auth (your deployment’s auth callback URLs as described in the Convex Auth docs).

4. **AI enrichment (optional)**

   - **Local / no API cost:** keep `MEME_AI_MOCK=true` in `.env.local` (synced to Convex when using `pnpm dev`).
   - **Real enrichment:** set `MEME_AI_MOCK` to false or unset it and set `AI_GATEWAY_API_KEY` on the Convex deployment.

5. **Run**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000), sign in, and open **My shelf**.

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `pnpm dev`    | Convex dev + Next.js dev server      |
| `pnpm build`  | Production Next.js build             |
| `pnpm start`  | Start production Next.js server      |
| `pnpm lint`   | ESLint                               |

## Project layout

| Path        | Role                                      |
| ----------- | ----------------------------------------- |
| `app/`      | Next.js routes, UI, PWA manifest          |
| `convex/`   | Schema, queries/mutations, auth, processing |
| `components/` | Shared UI (shadcn-style)                |
| `lib/`      | Client helpers (e.g. PWA share target)    |
| `public/`   | Icons, share-target service worker        |
| `.agents/`, `.claude/` | Convex/Cursor agent skills for development |

## Deployment

- **Frontend:** any Node host that runs Next.js (e.g. Vercel). Set `NEXT_PUBLIC_CONVEX_URL` to your production Convex URL.
- **Backend:** deploy Convex with `pnpm exec convex deploy`. Set production `SITE_URL`, auth keys, Google OAuth credentials, and optional `AI_GATEWAY_API_KEY` on the production deployment.
- Update Google OAuth redirect URIs for your production domain.

## Security

See [SECURITY.md](./SECURITY.md) for how to report issues and notes on storage URLs and authentication.

## Contributing

This project does not accept outside contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © Erfan Ebrahimnia
