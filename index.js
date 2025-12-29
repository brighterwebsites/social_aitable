#!/usr/bin/env node

/**
 * WordPress MCP Server for Brighter Websites
 *
 * Connects Claude to WordPress content for analysis and auditing
 * against documented content architecture frameworks.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import 'dotenv/config';

// Configuration
const CONFIG = {
  wordpressUrl: process.env.WORDPRESS_URL || 'https://brighterwebsites.com.au',
  apiBase: process.env.WORDPRESS_API_BASE || '/wp-json/brighter-core/v1',
  apiToken: process.env.WORDPRESS_API_TOKEN,
  serverName: process.env.MCP_SERVER_NAME || 'BrighterWebsites WordPress MCP',
  serverVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
};

// WordPress API Client
class WordPressClient {
  constructor(config) {
    this.baseUrl = `${config.wordpressUrl}${config.apiBase}`;
    this.token = config.apiToken;
  }

  /**
   * Make authenticated request to WordPress API
   */
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

  /**
   * Get posts with full CAR (Content Architecture Record) data
   */
  async getPosts(params = {}) {
    const queryParams = new URLSearchParams({
      per_page: params.limit || 10,
      page: params.page || 1,
      ...params,
    });

    return await this.request(`/posts?${queryParams}`);
  }

  /**
   * Get single post with all metadata
   */
  async getPost(postId) {
    return await this.request(`/posts/${postId}`);
  }

  /**
   * Get portfolio/folio items (projects)
   */
  async getFolioItems(params = {}) {
    const queryParams = new URLSearchParams({
      per_page: params.limit || 10,
      page: params.page || 1,
      ...params,
    });

    return await this.request(`/our-work?${queryParams}`);
  }

  /**
   * Search posts by criteria
   */
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

// Initialize MCP server
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

/**
 * MCP Tools - What Claude can do with WordPress content
 */
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

/**
 * MCP Tool Execution
 */
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

/**
 * MCP Resources - Documentation and frameworks
 */
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

// Start the server
async function main() {
  // Validate configuration
  if (!CONFIG.apiToken) {
    console.error('ERROR: WORDPRESS_API_TOKEN environment variable is required');
    console.error('Get your token from: WordPress Admin → Brighter Support → API Settings');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('WordPress MCP Server running');
  console.error(`Connected to: ${CONFIG.wordpressUrl}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
