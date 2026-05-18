# 🎮 Minecraft Server via GitHub Actions

Host a **free** Minecraft server using GitHub Actions + playit.gg tunnel. Runs up to ~6 hours per session.

---

## 📋 Prerequisites

- A free [GitHub](https://github.com) account
- A free [playit.gg](https://playit.gg) account (for the tunnel)

---

## 🚀 Setup (One-Time)

### 1. Fork / Create this repo
Push all these files to a new GitHub repository.

### 2. Get your playit.gg tunnel token
1. Sign up at [playit.gg](https://playit.gg)
2. Create a new tunnel → choose **Minecraft Java** (port 25565)
3. Copy your **secret token** from the agent setup page

### 3. (Optional) Set yourself as OP
Edit `server-config/ops.json`:
- Replace `YOUR-UUID-HERE` with your Minecraft UUID (look it up at [mcuuid.net](https://mcuuid.net))
- Replace `YourUsername` with your Minecraft username

### 4. (Optional) Tweak server settings
Edit `server-config/server.properties` to change difficulty, max players, MOTD, etc.

---

## ▶️ Starting the Server

1. Go to your repo on GitHub
2. Click **Actions** → **Minecraft Server**
3. Click **Run workflow**
4. Enter:
   - `mc_version` — e.g. `1.20.4`
   - `tunnel_token` — your playit.gg secret token
5. Click **Run workflow** ✅

---

## 🔌 Connecting to the Server

1. Wait ~60 seconds for the server to start
2. Open the **Actions run logs** and look for the playit.gg address, e.g.:
   ```
   your-name.at.playit.gg:12345
   ```
3. In Minecraft → **Multiplayer** → **Add Server** → paste the address

---

## ⚠️ Limitations

| Limit | Detail |
|-------|--------|
| ⏱ Session length | ~6 hours (GitHub Actions limit) |
| 💾 World persistence | World is **lost** when the run ends unless you add a save step |
| 🔁 RAM | ~3.5 GB available |
| 🌍 Region | GitHub's `ubuntu-latest` runners (usually US East) |

---

## 💾 Saving Your World (Optional)

To keep your world between sessions, add this step at the **end** of the workflow (before the server starts, after it stops — requires setup):

```yaml
- name: Upload world as artifact
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: minecraft-world
    path: world/
    retention-days: 30
```

And to restore it at the start of a new run, download the artifact and unzip it before starting the server.

---

## 🛠 Tech Stack

- **Paper MC** — high-performance Minecraft server
- **GitHub Actions** — free compute (2 vCPU, ~7 GB RAM)
- **playit.gg** — free tunnel (no port forwarding needed)
- **Java 21 (Temurin)** — via `actions/setup-java`
