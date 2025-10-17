Vercel deploy (frontend-only)

This repository contains a Vite frontend. The following instructions deploy only the frontend to Vercel.

Build settings
- Framework: Other (Vite)
- Build command: npm ci && npm run build
- Output directory: dist

Environment variable
- VITE_API_URL: https://<your-backend-domain-or-app-url>/api

Using Vercel web UI
1. Go to https://vercel.com/new
2. Import your GitHub repo `fenilghael/EcoConnect-Sphere---v0` (grant access if needed)
3. Under "Root Directory" leave blank (frontend is at repo root).
4. Set Build Command to:
   npm ci && npm run build
5. Set Output Directory to:
   dist
6. Add Environment Variable `VITE_API_URL` (Production)
7. Deploy.

Using Vercel CLI
1. Install vercel CLI:
   npm i -g vercel
2. From repo root run:
   vercel login
   vercel --prod --confirm --name ecoconnect-frontend --env VITE_API_URL="https://<your-backend>/api"

Notes
- The `vercel.json` file included sets the static-build to use the `dist` directory and routes all paths to `index.html` for SPA routing. Make sure your `vite.config.ts` contains `base: './'` so asset paths resolve correctly.
- If you want to host both frontend and backend on Vercel, consider separating the backend or using serverless functions; currently backend is configured as a Node Express app and is better run on App Platform or a Droplet.
