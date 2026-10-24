# Production deployment: AWS Lightsail

One Lightsail server runs everything with Docker:

```
Internet ──443/80──> Caddy (HTTPS, auto certificates) ──> app :3000 (API + live WebSocket)
GT06N ─────5023────> app (tracker gateway)
                     app ──> PostgreSQL + TimescaleDB (local only)
```

**Cost:** about **$12/month** (2 GB plan, IPv4 included) + ~$2–4 for snapshots. Domain ~₹800/year. Firebase, SSL and UptimeRobot are free.

You need: an AWS account (with the $10 budget alert), a **domain** you control, the **Firebase service-account key** (`secrets/firebase.json`), and your computer with this project.

---

## 1. Server

AWS Console → **Lightsail → Create instance**

| Setting | Value |
|---|---|
| Region | **Mumbai (ap-south-1)** |
| Blueprint | **Linux operating system → Ubuntu 24.04 LTS** |
| Network | **Dual-stack** (not IPv6-only — trackers use IPv4) |
| Plan | **$12: 2 GB RAM, 2 vCPU, 60 GB SSD** |
| Name | `gps-server` |

Then:
- **Static IP:** Networking → Create static IP → attach to `gps-server`. **This is the tracker's IP.**
- **Snapshots:** instance → Snapshots → **enable automatic snapshots** (daily server backup).

## 2. Firewall

Instance → **Networking → IPv4 Firewall**. Keep exactly these rules:

| Port | Protocol | Purpose |
|---|---|---|
| 22 | TCP | SSH |
| 80 | TCP | HTTP → redirects to HTTPS (also needed for certificates) |
| 443 | TCP | HTTPS API + live map |
| 443 | UDP | HTTP/3 (optional) |
| 5023 | TCP | GT06N trackers |

**Do not open 3000 or 5432.** The API port and database only listen on the server itself.

## 3. Domain

At your domain registrar, add a DNS record:

| Type | Name | Value |
|---|---|---|
| A | `api` | `<STATIC_IP>` |

Check from your computer (may take a few minutes): `dig +short api.yourbrand.in` → shows the static IP.

## 4. SSH access from your computer

1. Lightsail → Account → **SSH keys** → download the default key for Mumbai.
2. On your computer:
   ```bash
   cp ~/Downloads/LightsailDefaultKey-ap-south-1.pem ~/.ssh/lightsail-gps.pem
   chmod 400 ~/.ssh/lightsail-gps.pem
   ```
3. Edit `~/.ssh/config` so the `gps-server` entry points at the new server (all scripts use this name):
   ```
   Host gps-server
       HostName <STATIC_IP>
       User ubuntu
       IdentityFile ~/.ssh/lightsail-gps.pem
   ```
4. Test: `ssh gps-server hostname`

## 5. Install Docker (on the server)

```bash
ssh gps-server
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
exit
```

## 6. First upload and configuration

From your computer, in the project folder:
```bash
rsync -az --exclude node_modules --exclude .env --exclude .git --exclude secrets --exclude backups --exclude itest \
  ./ gps-server:~/gps-server/
ssh gps-server 'mkdir -p ~/gps-server/secrets'
scp secrets/firebase.json gps-server:~/gps-server/secrets/firebase.json     # push notifications
```

On the server, create `.env` with fresh secrets:
```bash
ssh gps-server
cd ~/gps-server
cp .env.example .env
sed -i "s/change_me_to_a_long_random_password/$(openssl rand -hex 24)/g" .env
sed -i "s/^ADMIN_API_KEY=.*/ADMIN_API_KEY=$(openssl rand -hex 32)/" .env
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 48)/" .env
sed -i "s/^API_DOMAIN=.*/API_DOMAIN=api.yourbrand.in/" .env        # your domain
sed -i "s/^LOG_LEVEL=.*/LOG_LEVEL=info/" .env
grep ADMIN_API_KEY .env      # save this key in your password manager
```
Optional: set `CORS_ORIGIN=https://your-web-dashboard.example` once you have a web front end (mobile apps don't need CORS).

Start everything:
```bash
docker compose up -d --build
docker compose ps                     # app, db, caddy all Up (app "healthy")
docker compose logs app | grep -E "push|listening"
curl -s https://api.yourbrand.in/health
```
The first HTTPS request may take ~10 s while Caddy gets the certificate.

## 7. Register trackers

```bash
docker compose exec app node scripts/admin-cli.js add <IMEI> --sim <SIM_NUMBER>
# a whole shipment (prints CSV of IMEI + activation code for the boxes):
docker compose exec app node scripts/admin-cli.js add-range <firstIMEI> <count>
```

Create your admin account: open `https://api.yourbrand.in/register`, sign up, then
```bash
docker compose exec app node scripts/admin-cli.js make-admin you@example.com
```
Log in again and open `https://api.yourbrand.in/admin` — trackers can now also be registered there (one or many, with a CSV of activation codes).

## 8. Backups

The server already has automatic **snapshots** (step 1). Add nightly **database** backups:
```bash
crontab -e
# add this line:
30 2 * * * cd ~/gps-server && scripts/backup.sh >> backups/backup.log 2>&1
```
Backups go to `~/gps-server/backups` (14 days kept). For off-server copies, create an S3 bucket, install and configure the AWS CLI on the server (`sudo apt install -y awscli && aws configure`), and set `BACKUP_S3_BUCKET=<bucket>` in `.env`.

**Test a restore once** (restores into a scratch database and prints counts):
```bash
scripts/restore.sh "$(ls -t backups/gps-*.dump | head -1)"
```
Real restore (replaces live data, stops the app while running): `CONFIRM=yes scripts/restore.sh backups/<file>.dump gps`

## 9. Monitoring

Create a free account at **uptimerobot.com** and add:

| Monitor | Type | Target | Alert when |
|---|---|---|---|
| API | Keyword | `https://api.yourbrand.in/health`, keyword `"status":"ok"` | keyword missing (DB down, writes failing, disk < 10 % free) |
| Trackers | Port | `<STATIC_IP>`, port 5023 | port closed |

Useful checks:
```bash
npm run logs                                                     # live server log (from your computer)
curl -s -H "x-api-key: <key>" https://api.yourbrand.in/api/v1/admin/system   # DB size, compression, counts
curl -s -H "x-api-key: <key>" https://api.yourbrand.in/api/v1/admin/stats    # points stored / dropped
```

## 10. Connect the real GT06N

SMS to the tracker's SIM (some firmware needs a `123456,` prefix):
```
APN,airteliot.com#
SERVER,0,<STATIC_IP>,5023,0#
GMT,E,0,0#
TIMER,10#
RESET#
```
Watch `npm run logs` for `device logged in`. If points are missing, check `/api/v1/admin/stats` (dropped reasons) and `/api/v1/admin/raw-packets`.

---

## Day to day

| Task | Command (from your computer) |
|---|---|
| Deploy new code | `npm run deploy` (tests → backup → upload → rebuild → health check) |
| Watch logs | `npm run logs` |
| Admin tool | `ssh gps-server 'cd ~/gps-server && docker compose exec app node scripts/admin-cli.js list'` |
| Manual backup | `ssh gps-server 'cd ~/gps-server && scripts/backup.sh'` |
| New server IP | change `HostName` in `~/.ssh/config`, the DNS A record, and re-send `SERVER,0,<IP>,5023,0#` to trackers |

**Keep:** the `caddy_data` Docker volume (certificates), `pgdata` (database), `secrets/`, `.env`. Never run `docker compose down -v` on the server — it deletes the database.
