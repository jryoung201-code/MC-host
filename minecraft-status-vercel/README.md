# ⛏ Minecraft Status Site — Vercel

A pixel-styled live status page for your Minecraft server, deployed on Vercel for free.

## Features
- 🟢 Online / offline indicator with live ping
- 👥 Player count + online player names
- 📋 One-click IP copy
- ⏱ MOTD display
- 🔁 Auto-refreshes every 30 seconds

---

## Deploy in 3 Steps

### 1. Set your server address

Edit `vercel.json` and replace the env values:
```json
"env": {
  "MC_HOST": "your-tunnel.at.playit.gg",
  "MC_PORT": "25565"
}
```

Also update the display host in `public/index.html`:
```js
const DISPLAY_HOST = window.MC_HOST || "your-tunnel.at.playit.gg";
```

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

### 3. Deploy to Vercel

**Option A — Vercel Dashboard (easiest):**
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Click Deploy ✅

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel
```

---

## Project Structure

```
├── api/
│   └── status.js       ← Serverless function: pings the MC server
├── public/
│   └── index.html      ← The status page UI
├── vercel.json         ← Routing + env config
└── package.json
```

## Environment Variables

| Variable  | Description               | Example                        |
|-----------|---------------------------|--------------------------------|
| `MC_HOST` | Your server hostname/IP   | `abc.at.playit.gg`             |
| `MC_PORT` | Server port (default 25565) | `25565`                      |

You can also set these in the Vercel dashboard under **Settings → Environment Variables** to avoid hardcoding them.
