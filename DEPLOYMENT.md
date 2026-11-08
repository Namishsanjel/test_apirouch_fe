# Deployment

The frontend is a Vite React SPA deployed to a Contabo server. Nginx on that
server serves the build from `/var/www/apitours/frontend/` and proxies `/api/`
and `/uploads/` to the Strapi backend on `127.0.0.1:1337`, so the site and API
share one origin.

The workflow `.github/workflows/deploy.yml`:

- **check** — runs lint, tests (if defined) and build on every pull request and
  push to `main`.
- **deploy** — runs only on a push to `main`, after `check` passes. It rebuilds,
  writes the SSH key and known-hosts secrets to files, rsyncs `dist/` to
  `/var/www/apitours/frontend/`, then runs a smoke test
  (`curl -fsS http://127.0.0.1/`) over SSH on the server.

## Required secrets

Configure these in the repository under **Settings → Secrets and variables →
Actions → Secrets**. The deploy job fails with a clear error if any is empty.

| Name               | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| `SSH_HOST`         | server hostname or IP                                              |
| `SSH_USER`         | SSH user with write access to `/var/www/apitours/frontend/`        |
| `SSH_PORT`         | SSH port (e.g. `22`)                                               |
| `SSH_PRIVATE_KEY`  | private key for `SSH_USER`, able to log in to the server           |
| `SSH_KNOWN_HOSTS`  | server host keys, from `ssh-keyscan -p <port> <host>`              |

The private key file is written with `chmod 600`; host-key checking stays on
(`StrictHostKeyChecking=yes`) using only `SSH_KNOWN_HOSTS`. Secrets are never
printed.

## Build variables

These are public client-side values and stay as repository **Variables**
(**Settings → Secrets and variables → Actions → Variables**):

| Name           | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| `SITE_ORIGIN`  | production frontend origin, e.g. `https://www.example.com`            |

`SITE_ORIGIN` is baked into the bundle as `VITE_SITE_ORIGIN` for canonical
URLs, Open Graph tags and `sitemap.xml`.

In production `VITE_STRAPI_URL` is **left empty**, which means "same origin":
the app calls `/api/...` and renders Strapi media at `/uploads/...`, resolved
against the site origin and proxied by Nginx. For local development set
`VITE_STRAPI_URL=http://localhost:1337` in `.env.local` to reach a local Strapi.

## Notes

- The app is a client-side SPA, so Nginx must rewrite unknown paths to
  `index.html` (`try_files $uri $uri/ /index.html;`) for deep links to work.
- Production deployments happen only on a push to `main`; pull requests just
  run the checks.
