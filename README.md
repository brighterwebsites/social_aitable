# WordPress MCP Server for Brighter Websites

A Model Context Protocol (MCP) server that connects AI platforms to your WordPress site for content analysis and auditing against your documented content architecture frameworks.

## What This Does

This MCP server allows AI platforms (Claude, ChatGPT, OpenAI Agents) to:
- **Read and analyze** your WordPress content (posts, pages, portfolio items)
- **Access full CAR data** (Content Architecture Records) including:
  - Content strategy fields (maturity level, intent, purpose)
  - ALTC clusters and topics
  - Content metrics (word count, headings, links, images)
  - SEO metadata and optimization status
- **Audit content** against your SCOS (Strategic Content Operating System) framework
- **Search and filter** content by various criteria

## Two Deployment Options

### 1. **Local MCP** (Claude Desktop only)
- Runs on your local machine
- Connects via stdio transport
- Quick setup, perfect for testing
- **See setup instructions below** ⬇️

### 2. **Remote MCP** (Claude.ai, ChatGPT, OpenAI Agents)
- Runs on your VPS with HTTPS
- Accessible via URL from any AI platform
- Requires SSL certificate and nginx
- **See [REMOTE-MCP-SETUP.md](REMOTE-MCP-SETUP.md)** 🌐

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure WordPress API Token

1. Log in to your WordPress admin at https://brighterwebsites.com.au/wp-admin
2. Go to **Brighter Support → API Settings**
3. Copy your API token (option: `bw_api_token`)

### 3. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and add your API token:

```env
WORDPRESS_URL=https://brighterwebsites.com.au
WORDPRESS_API_BASE=/wp-json/brighter-core/v1
WORDPRESS_API_TOKEN=your_actual_token_here
```

### 4. Test the Server

```bash
npm start
```

You should see:
```
WordPress MCP Server running
Connected to: https://brighterwebsites.com.au
```

## Connecting to Claude

### Claude Desktop (Recommended for Testing)

1. Open Claude Desktop settings (File → Settings → Developer)
2. Click "Edit Config" to open `claude_desktop_config.json`
3. Add this MCP server:

```json
{
  "mcpServers": {
    "brighterwebsites-wordpress": {
      "command": "node",
      "args": ["/home/user/social_aitable/index.js"],
      "env": {
        "WORDPRESS_URL": "https://brighterwebsites.com.au",
        "WORDPRESS_API_BASE": "/wp-json/brighter-core/v1",
        "WORDPRESS_API_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

4. Restart Claude Desktop
5. Look for the 🔌 icon - you should see "brighterwebsites-wordpress" connected

### Claude.ai (Web - Remote MCP)

For the web version, you'll need to:
1. Deploy this server to your VPS (see Deployment section below)
2. Use a reverse proxy (nginx) with HTTPS
3. Add it as a remote MCP server in Claude.ai

## Available Tools

Once connected, Claude can use these tools:

### 1. `get_posts_for_audit`
Get WordPress posts with full CAR data for content auditing.

**Parameters:**
- `post_type` (optional): 'post', 'page', or 'folio' (default: 'post')
- `limit` (optional): Number of posts (default: 10, max: 100)
- `page` (optional): Page number for pagination
- `maturity_level` (optional): Filter by maturity level
- `intent` (optional): Filter by content intent

**Example usage in Claude:**
```
"Analyze my last 20 blog posts for content maturity gaps"
```

### 2. `get_post_details`
Get detailed information for a specific post.

**Parameters:**
- `post_id` (required): The WordPress post ID

**Example usage:**
```
"Show me full details for post ID 1234"
```

### 3. `search_posts`
Search posts by keyword.

**Parameters:**
- `query` (required): Search term
- `limit` (optional): Number of results (default: 10)

**Example usage:**
```
"Find all posts about 'topical authority'"
```

### 4. `get_folio_items`
Get portfolio/project items.

**Parameters:**
- `limit` (optional): Number of items (default: 10)
- `page` (optional): Page number

**Example usage:**
```
"Show me my portfolio projects"
```

## Content Architecture Framework

The server exposes your SCOS framework documentation as MCP resources. Claude can access:

- Content Architecture Framework Overview
- CAR (Content Architecture Record) structure
- CAM (Content Authority Map) concepts
- Content metrics and optimization fields

**Note:** Detailed framework docs should be added to the `/docs/` folder in this repo.

## Deployment to VPS

### Option 1: Run with systemd (Production)

1. Copy this directory to your VPS:
```bash
scp -r /home/user/social_aitable user@your-vps:/opt/wordpress-mcp
```

2. Create systemd service:
```bash
sudo nano /etc/systemd/system/wordpress-mcp.service
```

```ini
[Unit]
Description=WordPress MCP Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/wordpress-mcp
Environment="WORDPRESS_URL=https://brighterwebsites.com.au"
Environment="WORDPRESS_API_BASE=/wp-json/brighter-core/v1"
Environment="WORDPRESS_API_TOKEN=your_token_here"
ExecStart=/usr/bin/node /opt/wordpress-mcp/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

3. Enable and start:
```bash
sudo systemctl enable wordpress-mcp
sudo systemctl start wordpress-mcp
```

### Option 2: Run with PM2 (Easy)

```bash
npm install -g pm2
pm2 start index.js --name wordpress-mcp
pm2 save
pm2 startup
```

## Troubleshooting

### "WORDPRESS_API_TOKEN environment variable is required"
- Make sure you've created the `.env` file with your token
- Check that the token is correct (no extra spaces)

### "WordPress API error: 401"
- Your API token is invalid or expired
- Get a fresh token from WordPress Admin → Brighter Support → API Settings

### "WordPress API error: 404"
- Check that the API endpoint exists at `/wp-json/brighter-core/v1`
- Verify the endpoint is accessible (not blocked by security plugins)

### Claude doesn't see the MCP server
- Check that the server is running (`npm start`)
- Verify the config path in `claude_desktop_config.json` is correct
- Restart Claude Desktop after making config changes

## Next Steps

1. **Add Framework Docs**: Create `/docs/` folder with your SCOS framework documentation
2. **Test Content Audit**: Ask Claude to audit your content against your frameworks
3. **Expand Tools**: Add more tools for content updates (write capability)
4. **Public Demo**: Deploy with HTTPS for public "AI-ready websites" demonstration

## API Endpoints Reference

Based on your WordPress API (update as needed):

**Base URL:** `https://brighterwebsites.com.au/wp-json/brighter-core/v1`

**Authentication:** All endpoints require `X-Brighter-Token` header

**Endpoints:**
- `GET /posts` - Blog posts with CAR data
- `GET /posts/{id}` - Single post details
- `GET /our-work` - Portfolio/folio items
- Additional endpoints: (add from your Cursor output)

## License

MIT - Built for Brighter Websites content architecture system
