# VPS Deployment Guide - WordPress MCP Server

Complete step-by-step guide to deploy your WordPress MCP server on your VPS.

## Prerequisites

- VPS with CyberPanel installed ✅
- SSH access (PuTTY) ✅
- Node.js installed on VPS (we'll check/install)
- Your WordPress API token: `5OHxwlAHPOHOURM3k722ZnXVfEDujGWO` ✅

---

## Step 1: Connect to Your VPS via PuTTY

1. Open PuTTY
2. Enter your VPS IP address
3. Port: 22 (default SSH)
4. Click "Open"
5. Login with your credentials

---

## Step 2: Check/Install Node.js

Once connected to your VPS, run:

```bash
# Check if Node.js is installed
node --version
npm --version
```

**If Node.js is NOT installed:**

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Step 3: Clone the Repository

```bash
# Navigate to your preferred directory (e.g., /opt or /home/yourusername)
cd /opt

# Clone the repository
git clone https://github.com/brighterwebsites/social_aitable.git

# Navigate to the project
cd social_aitable

# Checkout the MCP server branch
git checkout claude/plan-wordpress-mcp-XWdk3
```

---

## Step 4: Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file
nano .env
```

**In nano editor:**
- Your token is already configured in the repo (.env file)
- Press `Ctrl + X`, then `Y`, then `Enter` to save

**OR** if you want to verify/update:

```env
WORDPRESS_URL=https://brighterwebsites.com.au
WORDPRESS_API_BASE=/wp-json/brighter-core/v1
WORDPRESS_API_TOKEN=5OHxwlAHPOHOURM3k722ZnXVfEDujGWO
MCP_SERVER_NAME=BrighterWebsites WordPress MCP
MCP_SERVER_VERSION=1.0.0
```

---

## Step 5: Install Dependencies

```bash
npm install
```

---

## Step 6: Test the Connection

```bash
node test-api.js
```

**Expected output:**
```
✅ Successfully fetched 2 posts
📄 Sample Post Data:
   ID: 123
   Title: Your Post Title
   ...
✅ WordPress API connection successful!
```

**If you see errors:**
- Check that your API token is correct
- Verify the WordPress site is accessible
- Check firewall rules allow outbound HTTPS

---

## Step 7: Choose Deployment Method

### **Option A: PM2 (Recommended - Easy & Production-Ready)**

PM2 keeps your MCP server running, restarts it on crashes, and starts on boot.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the MCP server
pm2 start index.js --name wordpress-mcp

# View logs
pm2 logs wordpress-mcp

# Make it start on server reboot
pm2 startup
pm2 save

# Check status
pm2 status
```

**PM2 Commands:**
```bash
pm2 stop wordpress-mcp      # Stop the server
pm2 restart wordpress-mcp   # Restart the server
pm2 logs wordpress-mcp      # View logs
pm2 delete wordpress-mcp    # Remove from PM2
```

### **Option B: systemd (Advanced)**

Create a systemd service for more control:

```bash
sudo nano /etc/systemd/system/wordpress-mcp.service
```

**Paste this:**

```ini
[Unit]
Description=WordPress MCP Server for Brighter Websites
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/social_aitable
Environment="WORDPRESS_URL=https://brighterwebsites.com.au"
Environment="WORDPRESS_API_BASE=/wp-json/brighter-core/v1"
Environment="WORDPRESS_API_TOKEN=5OHxwlAHPOHOURM3k722ZnXVfEDujGWO"
ExecStart=/usr/bin/node /opt/social_aitable/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable wordpress-mcp
sudo systemctl start wordpress-mcp

# Check status
sudo systemctl status wordpress-mcp

# View logs
sudo journalctl -u wordpress-mcp -f
```

### **Option C: Run in Foreground (Testing Only)**

For quick testing (not for production):

```bash
npm start
```

**Note:** This will stop when you close your SSH session. Use PM2 or systemd for persistent operation.

---

## Step 8: Connect to Claude Desktop

Now that the MCP server is running on your VPS, connect it to Claude Desktop on your **local computer**.

### **Method 1: Direct Connection (VPS Accessible)**

If your VPS has a public IP and you can SSH to it:

1. **On your local computer**, open Claude Desktop settings
2. Go to: **Developer → Edit Config**
3. Find or create `claude_desktop_config.json`
4. Add this configuration:

```json
{
  "mcpServers": {
    "brighterwebsites-wordpress": {
      "command": "ssh",
      "args": [
        "your-vps-user@your-vps-ip",
        "cd /opt/social_aitable && node index.js"
      ]
    }
  }
}
```

**Replace:**
- `your-vps-user` with your VPS username
- `your-vps-ip` with your VPS IP address

### **Method 2: Local Development (Easier for Testing)**

**Clone the repo on your LOCAL computer:**

```bash
# On your local computer (not VPS)
git clone https://github.com/brighterwebsites/social_aitable.git
cd social_aitable
git checkout claude/plan-wordpress-mcp-XWdk3
npm install

# Create .env file with your token
cp .env.example .env
# Edit .env and add your token
```

**Then in Claude Desktop config:**

```json
{
  "mcpServers": {
    "brighterwebsites-wordpress": {
      "command": "node",
      "args": ["/path/to/social_aitable/index.js"],
      "env": {
        "WORDPRESS_URL": "https://brighterwebsites.com.au",
        "WORDPRESS_API_BASE": "/wp-json/brighter-core/v1",
        "WORDPRESS_API_TOKEN": "5OHxwlAHPOHOURM3k722ZnXVfEDujGWO"
      }
    }
  }
}
```

**Replace** `/path/to/social_aitable/index.js` with the actual path on your computer.

4. **Restart Claude Desktop**

5. **Look for the 🔌 icon** at the bottom of Claude Desktop - you should see "brighterwebsites-wordpress" connected

---

## Step 9: Test with Claude

Once connected, try these prompts in Claude Desktop:

```
"Get my last 5 blog posts and show me their content maturity levels"
```

```
"Audit my content for posts that are missing CAR data"
```

```
"Find all posts with maturity level 'developing' and show their word counts"
```

```
"Search for posts about 'topical authority' and analyze their structure"
```

---

## Troubleshooting

### MCP Server Won't Start

**Check logs:**
```bash
# If using PM2:
pm2 logs wordpress-mcp

# If using systemd:
sudo journalctl -u wordpress-mcp -n 50
```

**Common issues:**
- Missing .env file → Run `cp .env.example .env`
- Wrong API token → Check WordPress Admin → Brighter Support → API Settings
- Node.js not installed → See Step 2

### Claude Desktop Can't Connect

1. **Check MCP server is running** on VPS:
   ```bash
   pm2 status
   # or
   sudo systemctl status wordpress-mcp
   ```

2. **Check Claude Desktop config path** is correct

3. **Check logs** in Claude Desktop: Help → Show Logs

4. **Try local method** (Method 2) first to verify the code works

### API Returns 401 Unauthorized

- Token is wrong or expired
- Get fresh token from WordPress Admin
- Update .env file and restart server:
  ```bash
  pm2 restart wordpress-mcp
  # or
  sudo systemctl restart wordpress-mcp
  ```

### API Returns 404 Not Found

- API endpoint doesn't exist
- Check your WordPress site: `https://brighterwebsites.com.au/wp-json/brighter-core/v1/posts`
- Verify MU plugin is active

---

## Security Notes

⚠️ **Important:**

1. **Never commit .env to git** (already in .gitignore ✅)
2. **Token is sensitive** - treat like a password
3. **For public demo later**, we'll set up:
   - OAuth authentication
   - Read-only tokens
   - Rate limiting

---

## Next Steps

Once everything works:

1. ✅ **Add Framework Docs** to `/docs/` folder so Claude can reference them
2. ✅ **Test Content Audits** against your SCOS framework
3. ✅ **Add Write Tools** (update posts, meta fields)
4. ✅ **Public Demo Setup** with HTTPS and subdomain
5. ✅ **Blog Post** about "AI-Ready Websites" 🚀

---

## Quick Reference

**Start server:**
```bash
pm2 start wordpress-mcp
```

**Check logs:**
```bash
pm2 logs wordpress-mcp
```

**Restart after changes:**
```bash
cd /opt/social_aitable
git pull origin claude/plan-wordpress-mcp-XWdk3
npm install
pm2 restart wordpress-mcp
```

**Test API manually:**
```bash
curl -H "X-Brighter-Token: 5OHxwlAHPOHOURM3k722ZnXVfEDujGWO" \
  https://brighterwebsites.com.au/wp-json/brighter-core/v1/posts?per_page=1
```

---

Need help? Check the main [README.md](README.md) or open an issue on GitHub.
