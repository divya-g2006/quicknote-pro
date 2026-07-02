Deployment Instructions

Render (fullstack):
- In Render create a new Web Service from Git repository.
- Build Command: `npm --prefix client run build`
- Start Command: `npm --prefix server start`
- Set `NODE_ENV=production` and add any `MONGODB_URI` and other env vars in the service settings.
- Ensure the build artifact `client/dist` is present after the build so the server can serve static files.

Vercel (frontend only):
- Deploy the `client` folder as a Vercel project.
- Set the Root Directory to `client` and use the default Vercel settings (build: `npm run build`, output: `dist`).

Notes:
- For a single fullstack deployment prefer Render or Heroku-like providers that can run the Express server and serve static assets.
- Vercel is recommended for static frontend deployment only; in that case set the API URL in the client to point to the server URL.
