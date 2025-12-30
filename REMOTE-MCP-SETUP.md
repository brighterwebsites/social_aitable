# Remote MCP Server Setup Guide

Complete guide to deploy your WordPress MCP Server with HTTPS for use with Claude.ai, ChatGPT, and OpenAI Agents.

## 🎯 What This Enables

Once deployed, you'll have a **public MCP server** that can be used by:
- ✅ Claude.ai (web version)
- ✅ ChatGPT Custom GPTs
- ✅ OpenAI Agents/Assistants
- ✅ Any MCP-compatible platform

---

## Prerequisites

- ✅ VPS with root/sudo access
- ✅ Node.js 20+ installed
- ✅ nginx installed
- ✅ Domain/subdomain DNS configured (e.g., `mcp.brighterwebsites.com.au`)
- ✅ WordPress API token

---

## Step 1: DNS Configuration

**Before you begin, set up your subdomain DNS:**

1. Log in to your domain registrar or DNS provider
2. Add an **A Record**:
   - **Name:** `mcp` (or `mcp.brighterwebsites.com.au` depending on provider)
   - **Type:** A
   - **Value:** Your VPS IP (e.g., `70.36.114.234`)
   - **TTL:** 3600 (or default)

3. **Test DNS propagation:**
   ```bash
   # On your local computer
   ping mcp.brighterwebsites.com.au

   # Should return your VPS IP
   ```

**Wait 5-15 minutes for DNS to propagate** before proceeding.

---

## Step 2: Install nginx (if not already installed)

```bash
# Check if nginx is installed
nginx -v

# If not installed (Ubuntu/Debian):
sudo apt update
sudo apt install nginx -y

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Step 3: Install Certbot (Let's Encrypt SSL)

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL/AlmaLinux (if needed)
# sudo yum install certbot python3-certbot-nginx -y
```

---

## Step 4: Deploy MCP Server Code

```bash
# If you haven't already, clone/pull the repo on VPS
cd /opt/social_aitable
git pull origin claude/plan-wordpress-mcp-XWdk3

# Install new dependencies
npm install

# Generate a secure API key
# (or use this command to generate a random one)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env file
nano .env
```

**Add these new lines to .env:**
```env
# ... existing config ...

# Remote MCP Server Configuration
PORT=3000
MCP_API_KEY=paste-your-generated-api-key-here
```

**Save:** `Ctrl + X` → `Y` → `Enter`

---

## Step 5: Test the HTTP Server Locally

```bash
# Start the HTTP MCP server
npm run start:http

# You should see:
# 🚀 WordPress MCP Server (HTTP/SSE) running on port 3000
# 📍 Health check: http://localhost:3000/health
# 🔌 MCP endpoint: http://localhost:3000/sse
# ...
```

**In another terminal, test the health endpoint:**
```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "server": "BrighterWebsites WordPress MCP",
  "version": "1.0.0",
  "timestamp": "2025-..."
}
```

**If it works, stop the server** (`Ctrl + C`) and continue.

---

## Step 6: Configure nginx

```bash
# Copy the nginx config
sudo cp nginx.conf.example /etc/nginx/sites-available/mcp-brighterwebsites

# Edit to verify domain name
sudo nano /etc/nginx/sites-available/mcp-brighterwebsites

# Make sure these lines have YOUR subdomain:
# server_name mcp.brighterwebsites.com.au;

# Save and exit
```

**Enable the site:**
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/mcp-brighterwebsites /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If OK, reload nginx
sudo systemctl reload nginx
```

---

## Step 7: Get SSL Certificate with Let's Encrypt

**IMPORTANT:** Make sure your DNS is propagated first! (Test with `ping mcp.brighterwebsites.com.au`)

```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d mcp.brighterwebsites.com.au

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Optionally share email with EFF
```

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/mcp.brighterwebsites.com.au/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/mcp.brighterwebsites.com.au/privkey.pem
```

**Start nginx again:**
```bash
sudo systemctl start nginx
```

**Test nginx config again:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 8: Run MCP Server with PM2

```bash
# Stop the local stdio version if running
pm2 stop wordpress-mcp

# Start the HTTP version
pm2 start index-http.js --name wordpress-mcp-http

# Check logs
pm2 logs wordpress-mcp-http

# Save PM2 config
pm2 save
```

**Verify it's running:**
```bash
pm2 status
```

You should see `wordpress-mcp-http` with status **online**.

---

## Step 9: Test HTTPS Endpoint

**From your local computer or VPS:**

```bash
# Test health endpoint (no auth required)
curl https://mcp.brighterwebsites.com.au/health
```

**Expected response:**
```json
{
  "status": "ok",
  "server": "BrighterWebsites WordPress MCP",
  "version": "1.0.0",
  "timestamp": "..."
}
```

**Test MCP endpoint with auth:**
```bash
# Replace YOUR_API_KEY with the one from .env
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://mcp.brighterwebsites.com.au/sse
```

**You should see SSE connection established** (might appear to hang - that's normal for SSE).

---

## Step 10: Connect to Claude.ai

1. Go to https://claude.ai
2. Click the **🔌 icon** (bottom of chat)
3. Click **"Add custom connector"**
4. Fill in:
   - **Name:** `brighterwebsites-wordpress`
   - **MCP Server URL:** `https://mcp.brighterwebsites.com.au/sse`
   - **Authentication:** OAuth
   - **OAuth Client ID:** (leave blank)
   - **OAuth Client Secret:** (leave blank)

**Wait, that won't work!** 😅

### Actually - Simple API Key Method:

For now, Claude.ai expects OAuth. **We'll use a workaround:**

Create a simple proxy that adds the Authorization header:

```bash
# Create auth-proxy.js
nano /opt/social_aitable/auth-proxy.js
```

**Paste this:**
```javascript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const API_KEY = process.env.MCP_API_KEY;
const BACKEND_URL = 'http://localhost:3000';

app.get('/sse', async (req, res) => {
  const response = await fetch(`${BACKEND_URL}/sse`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      ...req.headers,
    },
  });

  response.body.pipe(res);
});

app.listen(3001, () => console.log('Auth proxy running on port 3001'));
```

---

## Step 11: Connect to ChatGPT

1. Go to https://chatgpt.com
2. Navigate to **Explore GPTs** → **Create a GPT**
3. In the **Configure** tab, scroll to **Actions**
4. Click **"Add Action"**
5. For **Authentication**, choose **API Key**
6. Set:
   - **MCP Server URL:** `https://mcp.brighterwebsites.com.au/sse`
   - **API Key:** Your MCP_API_KEY from .env
   - **Auth Type:** Bearer

---

## Step 12: Connect to OpenAI Agents

1. Go to https://platform.openai.com/agent-builder
2. Create a new agent
3. In the **Tools** section, click **MCP**
4. Fill in:
   - **MCP Server URL:** `https://mcp.brighterwebsites.com.au/sse`
   - **API Key:** Your MCP_API_KEY from .env

---

## Firewall Configuration

Make sure ports 80 and 443 are open:

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## Troubleshooting

### SSL Certificate Issues

**Error: "Certificate not found"**
```bash
# List certificates
sudo certbot certificates

# If missing, re-run certbot
sudo systemctl stop nginx
sudo certbot certonly --standalone -d mcp.brighterwebsites.com.au
sudo systemctl start nginx
```

### nginx Errors

**Error: "Address already in use"**
```bash
# Check what's using port 80/443
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# If it's apache or another service, stop it
sudo systemctl stop apache2  # or httpd
```

### MCP Server Not Responding

```bash
# Check PM2 status
pm2 logs wordpress-mcp-http

# Check if port 3000 is in use
sudo netstat -tulpn | grep :3000

# Restart
pm2 restart wordpress-mcp-http
```

### DNS Not Resolving

```bash
# Check DNS
dig mcp.brighterwebsites.com.au

# Check from VPS
curl -I http://mcp.brighterwebsites.com.au

# If 502 Bad Gateway, check if MCP server is running
pm2 status
```

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Key Management:**
   - Never commit .env to git ✅ (already in .gitignore)
   - Use a strong, random API key
   - Rotate keys periodically

2. **Rate Limiting:**
   - Consider adding rate limiting for production
   - Can be done at nginx level

3. **Monitoring:**
   - Check PM2 logs regularly: `pm2 logs`
   - Monitor nginx logs: `tail -f /var/log/nginx/mcp-access.log`

4. **SSL Renewal:**
   - Certbot auto-renews every 60 days
   - Test renewal: `sudo certbot renew --dry-run`

---

## Testing Your Remote MCP Server

Once deployed, test with these prompts:

### In Claude.ai:
```
"Use the brighterwebsites-wordpress MCP server to get my last 5 blog posts"
```

### In ChatGPT:
```
"Fetch my WordPress content and show me the posts with their CAR data"
```

### In OpenAI Agent:
```
"Analyze my WordPress content for maturity levels"
```

---

## Next Steps

✅ **Working remote MCP server!**

Now you can:
1. **Blog about it** - "AI-Ready Websites with MCP"
2. **Add more tools** - Write capabilities, advanced analytics
3. **Multi-site support** - Connect all 3 of your sites
4. **Public demo** - Let others connect to your public endpoints

---

## Quick Reference

**Start/Stop Commands:**
```bash
pm2 start wordpress-mcp-http
pm2 stop wordpress-mcp-http
pm2 restart wordpress-mcp-http
pm2 logs wordpress-mcp-http
```

**nginx Commands:**
```bash
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo nginx -t  # Test config
```

**SSL Renewal:**
```bash
sudo certbot renew
```

**Your MCP URL:**
```
https://mcp.brighterwebsites.com.au/sse
```

**Health Check:**
```
https://mcp.brighterwebsites.com.au/health
```

---

Need help? Check the main [README.md](README.md) or open an issue on GitHub.
