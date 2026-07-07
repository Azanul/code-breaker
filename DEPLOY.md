# Deploy

## 1. Deploy p2pcf Worker + R2 bucket

Follow the [p2pcf INSTALL.md](https://github.com/gfodor/p2pcf/blob/main/INSTALL.md):

```bash
git clone https://github.com/gfodor/p2pcf.git
cd p2pcf
npm install
npx wrangler login

# Create R2 bucket (if not exists)
npx wrangler r2 bucket create p2pcf

# Update wrangler.toml with your bucket binding
npx wrangler deploy
```

This gives you a URL like `https://p2pcf.<your-subdomain>.workers.dev`.

## 2. Update P2PCF_WORKER_URL

In `public/game.js` line 12, replace:

```js
const P2PCF_WORKER_URL = 'https://p2pcf.YOUR-WORKER.workers.dev'
```

with your actual worker URL.

## 3. Deploy Pages project

Build then deploy the `dist/` directory:

```bash
npm run build
npx wrangler pages deploy dist --project-name code-break
```

Or via the dashboard: connect your git repo, set build command to `npm run build`, set build output to `dist`.
