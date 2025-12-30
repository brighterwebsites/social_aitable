#!/usr/bin/env node

/**
 * WordPress MCP Server - HTTP/SSE Transport (Remote)
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
import 'dotenv/config';

// Configuration
const CONFIG = {
  wordpressUrl: process.env.WORDPRESS_URL || 'https://brighterwebsites.com.au',
  apiBase: process.env.WORDPRESS_API_BASE || '/wp-json/brighter-core/v1',
  apiToken: process.env.WORDPRESS_API_TOKEN,
  serverName: process.env.MCP_SERVER_NAME || 'BrighterWebsites WordPress MCP',
  serverVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
  port: process.env.PORT || 3000,
  mcpApiKey: process.env.MCP_API_KEY || 'your-secure-api-key-here',
};

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

// API Key Authentication Middleware
function authenticateApiKey(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (apiKey !== CONFIG.mcpApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    server: CONFIG.serverName,
    version: CONFIG.serverVersion,
    timestamp: new Date().toISOString(),
  });
});

// MCP SSE endpoint
app.get('/sse', authenticateApiKey, async (req, res) => {
  console.log('New SSE connection established');

  const server = createMCPServer();
  const transport = new SSEServerTransport('/message', res);

  await server.connect(transport);

  req.on('close', () => {
    console.log('SSE connection closed');
  });
});

// MCP message endpoint
app.post('/message', authenticateApiKey, async (req, res) => {
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
    console.error('WARNING: Using default MCP_API_KEY. Please set a secure API key in .env file');
  }

  app.listen(CONFIG.port, () => {
    console.log(`🚀 WordPress MCP Server (HTTP/SSE) running on port ${CONFIG.port}`);
    console.log(`📍 Health check: http://localhost:${CONFIG.port}/health`);
    console.log(`🔌 MCP endpoint: http://localhost:${CONFIG.port}/sse`);
    console.log(`🌐 Connected to: ${CONFIG.wordpressUrl}`);
    console.log(`🔑 API Key authentication: ${CONFIG.mcpApiKey !== 'your-secure-api-key-here' ? 'ENABLED' : 'DISABLED (default key)'}`);
    console.log('\nReady to accept connections from Claude.ai, ChatGPT, and OpenAI Agents!');
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
