#!/usr/bin/env node

/**
 * WordPress MCP Server - HTTP/SSE Transport (Remote) with OAuth 2.0
 *
 * Supports remote connections from:
 * - Claude.ai web
 * - ChatGPT Custom GPTs
 * - OpenAI Agents/Assistants
 * - Any MCP-compatible platform
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import 'dotenv/config';

// Configuration
const CONFIG = {
  wordpressUrl: process.env.WORDPRESS_URL || 'https://brighterwebsites.com.au',
  apiBase: process.env.WORDPRESS_API_BASE || '/wp-json/brighter-core/v1',
  apiToken: process.env.WORDPRESS_API_TOKEN,
  serverName: process.env.MCP_SERVER_NAME || 'BrighterWebsites WordPress MCP',
  serverVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'https://mcp.brighterwebsites.com.au',
  mcpApiKey: process.env.MCP_API_KEY || 'your-secure-api-key-here',
  oauthClientId: process.env.OAUTH_CLIENT_ID || 'brighterwebsites-mcp-client',
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET || crypto.randomBytes(32).toString('hex'),
};

// In-memory token store (for production, use Redis or database)
const tokenStore = new Map();
const authCodeStore = new Map();

// WordPress API Client
class WordPressClient {
  constructor(config) {
    this.baseUrl = `${config.wordpressUrl}${config.apiBase}`;
    this.token = config.apiToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'X-Brighter-Token': this.token,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch from WordPress: ${error.message}`);
    }
  }

  async getPosts(params = {}) {
    const queryParams = new URLSearchParams({
      per_page: params.limit || 10,
      page: params.page || 1,
      ...params,
    });

    return await this.request(`/posts?${queryParams}`);
  }

  async getPost(postId) {
    return await this.request(`/posts/${postId}`);
  }

  async getFolioItems(params = {}) {
    const queryParams = new URLSearchParams({
      per_page: params.limit || 10,
      page: params.page || 1,
      ...params,
    });

    return await this.request(`/our-work?${queryParams}`);
  }

  async searchPosts(query, params = {}) {
    const queryParams = new URLSearchParams({
      search: query,
      per_page: params.limit || 10,
      ...params,
    });

    return await this.request(`/posts?${queryParams}`);
  }
}

// Initialize WordPress client
const wpClient = new WordPressClient(CONFIG);

// Create MCP Server
function createMCPServer() {
  const server = new Server(
    {
      name: CONFIG.serverName,
      version: CONFIG.serverVersion,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // MCP Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'get_posts_for_audit',
          description: 'Get WordPress posts with full Content Architecture Record (CAR) data for auditing against frameworks. Returns posts with metadata including maturity level, content intent, purpose, ALTC clusters, topics, content metrics, and SEO data.',
          inputSchema: {
            type: 'object',
            properties: {
              post_type: {
                type: 'string',
                description: 'Type of content to retrieve',
                enum: ['post', 'page', 'folio'],
                default: 'post',
              },
              limit: {
                type: 'number',
                description: 'Number of posts to retrieve (default: 10, max: 100)',
                default: 10,
              },
              page: {
                type: 'number',
                description: 'Page number for pagination',
                default: 1,
              },
              maturity_level: {
                type: 'string',
                description: 'Filter by content maturity level (if specified)',
              },
              intent: {
                type: 'string',
                description: 'Filter by content intent (if specified)',
              },
            },
          },
        },
        {
          name: 'get_post_details',
          description: 'Get detailed information for a single WordPress post, including all CAR data, content metrics, SEO fields, and custom metadata.',
          inputSchema: {
            type: 'object',
            properties: {
              post_id: {
                type: 'number',
                description: 'The WordPress post ID',
              },
            },
            required: ['post_id'],
          },
        },
        {
          name: 'search_posts',
          description: 'Search WordPress posts by keyword or phrase. Useful for finding content on specific topics or with certain characteristics.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query (searches title and content)',
              },
              limit: {
                type: 'number',
                description: 'Number of results to return (default: 10)',
                default: 10,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_folio_items',
          description: 'Get portfolio/project items (folio post type) with their CAR data and project-specific metadata.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                description: 'Number of items to retrieve (default: 10)',
                default: 10,
              },
              page: {
                type: 'number',
                description: 'Page number for pagination',
                default: 1,
              },
            },
          },
        },
      ],
    };
  });

  // MCP Tool Execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'get_posts_for_audit': {
          const posts = await wpClient.getPosts({
            limit: args.limit || 10,
            page: args.page || 1,
            maturity_level: args.maturity_level,
            intent: args.intent,
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(posts, null, 2),
              },
            ],
          };
        }

        case 'get_post_details': {
          const post = await wpClient.getPost(args.post_id);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(post, null, 2),
              },
            ],
          };
        }

        case 'search_posts': {
          const results = await wpClient.searchPosts(args.query, {
            limit: args.limit || 10,
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        }

        case 'get_folio_items': {
          const folioItems = await wpClient.getFolioItems({
            limit: args.limit || 10,
            page: args.page || 1,
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(folioItems, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // MCP Resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'wordpress://frameworks/overview',
          name: 'Content Architecture Framework Overview',
          description: 'Overview of the SCOS (Strategic Content Operating System) framework used for content analysis',
          mimeType: 'text/plain',
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === 'wordpress://frameworks/overview') {
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `# Content Architecture Framework (CAR/CAM)

## Overview
This WordPress site uses the Strategic Content Operating System (SCOS) framework for content planning, creation, and optimization.

## Key Concepts

### CAR (Content Architecture Record)
Page-level directive containing:
- **Maturity Level**: Content development stage
- **Content Intent**: Primary goal of the content
- **Content Purpose**: Specific purpose within strategy
- **ALTC Cluster**: Strategic lens/topic cluster
- **Topics**: Specific topics covered
- **Pillar Relationship**: Connection to pillar content

### CAM (Content Authority Map)
Site-level intelligence providing strategic direction.

## Content Metrics
- Word count
- H2 heading count
- Internal/external link counts
- Image count
- Last analyzed date

## Optimization Fields
- Optimization status
- Index status
- SEO metadata (title, description)

---
NOTE: Detailed framework documentation should be added to /docs/ folder.
`,
          },
        ],
      };
    }

    throw new Error(`Resource not found: ${uri}`);
  });

  return server;
}

// Express app setup
const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from Claude.ai, ChatGPT, and OpenAI domains
    const allowedOrigins = [
      'https://claude.ai',
      'https://chat.openai.com',
      'https://platform.openai.com',
      'https://chatgpt.com',
    ];

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OAuth 2.0 Helper Functions
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateAuthCode() {
  return crypto.randomBytes(16).toString('hex');
}

// Authentication Middleware (supports both OAuth tokens and API keys)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Check if it's a valid OAuth access token
  if (tokenStore.has(token)) {
    const tokenData = tokenStore.get(token);

    // Check if token is expired
    if (tokenData.expiresAt < Date.now()) {
      tokenStore.delete(token);
      return res.status(401).json({ error: 'Token expired' });
    }

    req.user = tokenData.user;
    return next();
  }

  // Check if it's the API key (fallback for direct API key auth)
  if (token === CONFIG.mcpApiKey) {
    req.user = { type: 'api_key' };
    return next();
  }

  return res.status(401).json({ error: 'Invalid token' });
}

// OAuth 2.0 Endpoints

// OAuth metadata endpoint (for auto-discovery)
app.get('/.well-known/oauth-authorization-server', (req, res) => {
  res.json({
    issuer: CONFIG.baseUrl,
    authorization_endpoint: `${CONFIG.baseUrl}/oauth/authorize`,
    token_endpoint: `${CONFIG.baseUrl}/oauth/token`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'client_credentials'],
    token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
  });
});

// Authorization endpoint (step 1 of OAuth flow)
app.get('/oauth/authorize', (req, res) => {
  const { response_type, client_id, redirect_uri, state, scope } = req.query;

  // Validate client
  if (client_id !== CONFIG.oauthClientId) {
    return res.status(400).json({ error: 'invalid_client', error_description: 'Invalid client ID' });
  }

  // For auto-approval (no user consent screen needed for MCP)
  // Generate authorization code
  const authCode = generateAuthCode();

  authCodeStore.set(authCode, {
    clientId: client_id,
    redirectUri: redirect_uri,
    scope: scope || '',
    createdAt: Date.now(),
    expiresAt: Date.now() + 600000, // 10 minutes
  });

  // Redirect back with auth code
  const redirectUrl = new URL(redirect_uri || 'http://localhost/callback');
  redirectUrl.searchParams.set('code', authCode);
  if (state) redirectUrl.searchParams.set('state', state);

  res.redirect(redirectUrl.toString());
});

// Token endpoint (step 2 of OAuth flow)
app.post('/oauth/token', (req, res) => {
  const { grant_type, code, client_id, client_secret, redirect_uri } = req.body;

  // Validate client credentials
  if (client_id !== CONFIG.oauthClientId || client_secret !== CONFIG.oauthClientSecret) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
  }

  if (grant_type === 'authorization_code') {
    // Exchange authorization code for access token
    if (!authCodeStore.has(code)) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid authorization code' });
    }

    const authCodeData = authCodeStore.get(code);

    // Check if code is expired
    if (authCodeData.expiresAt < Date.now()) {
      authCodeStore.delete(code);
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Authorization code expired' });
    }

    // Delete used auth code (one-time use)
    authCodeStore.delete(code);

    // Generate access token
    const accessToken = generateToken();
    const refreshToken = generateToken();

    tokenStore.set(accessToken, {
      user: { client_id },
      scope: authCodeData.scope,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
      refreshToken,
    });

    return res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: authCodeData.scope,
    });
  }

  if (grant_type === 'client_credentials') {
    // Direct client credentials grant (simpler flow)
    const accessToken = generateToken();

    tokenStore.set(accessToken, {
      user: { client_id },
      scope: 'read write',
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    return res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'read write',
    });
  }

  return res.status(400).json({ error: 'unsupported_grant_type' });
});

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: CONFIG.serverName,
    version: CONFIG.serverVersion,
    timestamp: new Date().toISOString(),
    oauth_enabled: true,
  });
});

// MCP SSE endpoint (with OAuth/API key auth)
app.get('/sse', authenticate, async (req, res) => {
  console.log('New SSE connection established');

  const server = createMCPServer();
  const transport = new SSEServerTransport('/message', res);

  await server.connect(transport);

  req.on('close', () => {
    console.log('SSE connection closed');
  });
});

// MCP message endpoint (with OAuth/API key auth)
app.post('/message', authenticate, async (req, res) => {
  // This endpoint is handled by the SSE transport
  res.status(200).end();
});

// Start server
async function main() {
  // Validate configuration
  if (!CONFIG.apiToken) {
    console.error('ERROR: WORDPRESS_API_TOKEN environment variable is required');
    process.exit(1);
  }

  if (CONFIG.mcpApiKey === 'your-secure-api-key-here') {
    console.warn('WARNING: Using default MCP_API_KEY. Set a secure key in .env for production.');
  }

  app.listen(CONFIG.port, () => {
    console.log(`🚀 WordPress MCP Server (HTTP/SSE) with OAuth 2.0 running on port ${CONFIG.port}`);
    console.log(`📍 Health check: ${CONFIG.baseUrl}/health`);
    console.log(`🔌 MCP endpoint: ${CONFIG.baseUrl}/sse`);
    console.log(`🌐 Connected to: ${CONFIG.wordpressUrl}`);
    console.log(`🔐 OAuth Client ID: ${CONFIG.oauthClientId}`);
    console.log(`🔑 OAuth Client Secret: ${CONFIG.oauthClientSecret.substring(0, 8)}...`);
    console.log(`\n📖 OAuth Endpoints:`);
    console.log(`   - Authorization: ${CONFIG.baseUrl}/oauth/authorize`);
    console.log(`   - Token: ${CONFIG.baseUrl}/oauth/token`);
    console.log(`   - Metadata: ${CONFIG.baseUrl}/.well-known/oauth-authorization-server`);
    console.log('\n✅ Ready to accept connections from Claude.ai, ChatGPT, and OpenAI Agents!');
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
