# Deployment

This repo's GitHub Actions workflow (`.github/workflows/deploy.yml`) runs lint,
test (if defined) and build on every push and pull request. On pushes to `main`
it also uploads the build output (`dist/`) as a workflow artifact named
`build-output`, which a future deployment step can download and publish.

The hosting target for this frontend is **still to be decided**. There is no
automated deploy job at the moment.

## Build variables

Configure these in the repository under **Settings → Secrets and variables →
Actions → Variables**:

| Name           | Value                                                     |
| -------------- | --------------------------------------------------------- |
| `API_URL`      | production backend origin, e.g. `https://api.example.com` |
| `SITE_ORIGIN`  | production frontend origin, e.g. `https://www.example.com` |

`API_URL` is baked into the bundle as `VITE_STRAPI_URL`; `SITE_ORIGIN` is used
to generate canonical URLs in `sitemap.xml`. Both are public client-side
values, so they are stored as variables rather than secrets.

## Notes

- Production artifacts are produced only on a push to `main`; pull requests just
  run the checks.
- The app is a client-side SPA, so the eventual host must rewrite unknown paths
  to `index.html` for deep links to work. `vercel.json` currently holds that
  rewrite rule; keep or replace it with an equivalent config for whichever
  host is chosen.
