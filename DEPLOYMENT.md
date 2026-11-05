# Deployment

This repo deploys to Vercel through GitHub Actions (`.github/workflows/deploy.yml`).
Every push and pull request runs lint + build; only pushes to `main` deploy to production.

Follow the checklist in order the first time you set this up.

## 1. Create the Vercel project and disable auto-deploys

1. Go to the Vercel dashboard and **import this GitHub repo** as a new project.
2. In the project, open **Settings → Git** and **turn OFF** automatic Git deployments
   (Production and Preview). GitHub Actions is the only thing that should deploy,
   otherwise Vercel would deploy a second time on every push.
3. Note the **Production domain** you get; you will use it as the site origin.

## 2. Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

1. Install and log in to the CLI: `npm i -g vercel && vercel login`.
2. In the repo root run `vercel link` and select the project you just created.
3. Open `.vercel/project.json`. It contains:
   - `orgId` → the `VERCEL_ORG_ID` secret
   - `projectId` → the `VERCEL_PROJECT_ID` secret
4. **Never commit `.vercel/`** — it is ignored in `.gitignore`.

## 3. Create a `VERCEL_TOKEN`

1. Go to <https://vercel.com/account/tokens> and create a token.
2. Scope it to the team/account that owns the project. Copy it once — it is not shown again.

## 4. Add secrets and variables in GitHub

Repository → **Settings → Secrets and variables → Actions**.

**Secrets** (Secrets tab):

| Name                 | Value                                   |
| -------------------- | --------------------------------------- |
| `VERCEL_TOKEN`       | token from step 3                       |
| `VERCEL_ORG_ID`      | `orgId` from `.vercel/project.json`     |
| `VERCEL_PROJECT_ID`  | `projectId` from `.vercel/project.json` |

**Variables** (Variables tab, not secret):

| Name           | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| `API_URL`      | production backend origin, e.g. `https://api.example.com`          |
| `SITE_ORIGIN`  | production frontend origin, e.g. `https://www.example.com`         |

`API_URL` is a variable (not a secret) because it is a public, client-side URL
baked into the bundle as `VITE_STRAPI_URL`.

## 5. Add environment variables in Vercel

Vercel project → **Settings → Environment Variables** (Production):

| Name               | Value                                    |
| ------------------ | ---------------------------------------- |
| `VITE_STRAPI_URL`  | production backend origin (`API_URL`)    |
| `VITE_SITE_ORIGIN` | production frontend origin (`SITE_ORIGIN`) |

`vercel pull` fetches these at deploy time, and `vercel build` bakes them in.

## 6. First deploy — order matters

1. **Deploy the backend first** (the Strapi API) and confirm it is live and reachable
   at the `API_URL` you plan to use. The frontend fetches from it on load.
2. Complete steps 1–5 above so the GitHub secrets/variables and Vercel env vars are set.
3. Commit and push to `main` (or run the **CI/CD** workflow manually via
   `workflow_dispatch`).
4. Watch the Actions run: the `check` job (lint + build) must pass before `deploy` runs.
5. When `deploy` finishes, open the Vercel production URL and verify:
   - The home page loads and API-backed sections fetch data.
   - A deep link such as `/about` or `/tours/some-slug` loads directly
     (the `vercel.json` rewrite serves `index.html` for client routes).
   - `sitemap.xml` and canonical/OG tags point at the production origin.

## Notes

- Production deploys run only on a push to `main`; pull requests and forks never deploy.
- The `production-deploy` concurrency group ensures two production deploys never overlap.
- The workflow uses `permissions: contents: read` and never prints secret values.
