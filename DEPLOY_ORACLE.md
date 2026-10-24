# Deploy on Oracle Cloud (Always Free)

This guide sets up one free Oracle Cloud server that runs the tracker listener (port 5023), the API (port 3000) and PostgreSQL/TimescaleDB, and gives you a public IP for the GT06N.

---

## 1. Create the account

1. Sign up at <https://signup.cloud.oracle.com>.
2. **Pick your Home Region carefully. It can't be changed later.** Choose the one closest to you (for India: Mumbai or Hyderabad). Free servers can only be created in the home region.
3. A card is required for verification. Always Free resources are not charged.

## 2. Create the server (Compute instance)

Menu → **Compute → Instances → Create instance**

| Setting | Value |
|---|---|
| Name | `gps-server` |
| Image | **Canonical Ubuntu 24.04** |
| Shape | **Ampere → VM.Standard.A1.Flex**, 1 OCPU, 6 GB RAM (look for the "Always Free-eligible" label) |
| Networking | Keep "Create new virtual cloud network" and "Create new public subnet". Make sure **Assign a public IPv4 address** is ON |
| SSH keys | **Generate a key pair** → click **Save private key** (you can't download it later) |

Click **Create**. Wait until the status turns green (**Running**).

> **"Out of capacity" error?** Free ARM servers are popular. Try a different Availability Domain, retry later, or use shape **VM.Standard.E2.1.Micro** (AMD, 1 GB RAM, also Always Free). On the 1 GB shape, add swap (step 5).

## 3. Get your server IP

On the instance page, copy **Public IP address** under "Instance access". **This is the IP for the tracker.**

The IP stays the same across stops, starts and reboots. It only changes if you **terminate** (delete) the instance.

## 4. Open the ports (two places)

Oracle blocks traffic in **two** places, and both must be opened.

### 4a. Cloud firewall (Security List)
Instance page → click the **Subnet** link → **Security** (or "Security Lists") → **Default Security List** → **Add Ingress Rules**. Add one rule per port:

| Source CIDR | IP Protocol | Destination Port | Purpose |
|---|---|---|---|
| `0.0.0.0/0` | TCP | `5023` | GT06N tracker |
| `0.0.0.0/0` | TCP | `3000` | API (for testing; close later if you add Nginx) |
| `0.0.0.0/0` | TCP | `80` | HTTP (Nginx, optional) |
| `0.0.0.0/0` | TCP | `443` | HTTPS (Nginx, optional) |

Port 22 (SSH) is already open by default.

### 4b. Server firewall (iptables)
Oracle's Ubuntu image ships with strict iptables rules. Done in step 5.

## 5. Connect and set up the server

On your computer (Linux/macOS terminal, or PowerShell on Windows):

```bash
chmod 400 ~/Downloads/ssh-key-*.key
ssh -i ~/Downloads/ssh-key-*.key ubuntu@<PUBLIC_IP>
```

Then **on the server**:

```bash
# Open the ports in the server's own firewall and keep them after reboot
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5023 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
exit    # log out so the docker group applies
```

**Only on the 1 GB (E2.1.Micro) shape**, also add 2 GB swap so PostgreSQL has room:
```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 6. Upload the project

From **your computer**, in the project folder (`gpstest`):

```bash
rsync -av --exclude node_modules --exclude .env \
  -e "ssh -i ~/Downloads/ssh-key-*.key" ./ ubuntu@<PUBLIC_IP>:~/gps-server
```

(If the project is on GitHub, you can `git clone` it on the server instead.)

## 7. Start the app

SSH back in, then:

```bash
cd ~/gps-server
cp .env.example .env
# Set a secret key so you can send commands like WHERE# to the tracker:
sed -i "s/change_me_to_a_long_random_password/$(openssl rand -hex 24)/g" .env
sed -i "s/^ADMIN_API_KEY=.*/ADMIN_API_KEY=$(openssl rand -hex 32)/" .env
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 48)/" .env
grep ADMIN_API_KEY .env        # copy this key somewhere safe
docker compose up -d --build
docker compose logs -f app
```

You should see:
```
[db] connected
[tcp] listening for GT06N devices on port 5023
[api] HTTP API on port 3000
```
Press `Ctrl+C` to stop watching logs (the app keeps running). It restarts automatically after reboots.

## 8. Test from your computer

```bash
nc -vz <PUBLIC_IP> 5023                              # should say "succeeded"
curl http://<PUBLIC_IP>:3000/health                  # {"status":"ok","database":true}
# register a test IMEI on the server first: docker compose exec app node scripts/admin-cli.js add 359710049095095
node scripts/simulate-device.js --host <PUBLIC_IP>   # fake tracker, Ctrl+C to stop
curl -H "x-api-key: <key>" http://<PUBLIC_IP>:3000/api/v1/admin/devices/359710049095095
```

If `nc` times out, a port is still closed: recheck step 4a and the iptables commands.

## 9. Point the GT06N at the server

SMS these to the Airtel SIM number in the tracker (some firmware needs a password prefix like `123456,`):

```
APN,airteliot.com#
SERVER,0,<PUBLIC_IP>,5023,0#
GMT,E,0,0#
TIMER,10#
RESET#
```

Register the IMEI first (`docker compose exec app node scripts/admin-cli.js add <IMEI>`). Watch `docker compose logs -f app` on the server: you should see `device logged in`. Check it with:

```
curl -H "x-api-key: <key>" http://<PUBLIC_IP>:3000/api/v1/admin/devices/<IMEI>
```

---

## Things to know

- **Idle reclaim:** Oracle may reclaim Always Free servers that sit nearly idle for 7 days (very low CPU, network and memory use). A GPS server is light, so this can happen. To avoid it, upgrade the account to **Pay As You Go** (Billing → Upgrade). Always Free resources stay free after upgrading; just don't create paid resources. Set a budget alert to be safe.
- **HTTPS:** iOS apps (and Android release builds by default) require HTTPS. Use the Nginx + certbot steps in [README.md](README.md#4-https-for-the-api-recommended-for-apps) with a domain pointing to your IP, then remove the port 3000 rule.
- **Updating the code:** re-run the `rsync` command from step 6, then on the server: `cd ~/gps-server && docker compose up -d --build`.
- **Backups:** `docker compose exec -T db pg_dump -U gps -Fc gps > backup-$(date +%F).dump`
