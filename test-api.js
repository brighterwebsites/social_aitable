#!/usr/bin/env node

/**
 * Quick test script to verify WordPress API connection
 */

import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '.env') });

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://brighterwebsites.com.au';
const API_BASE = process.env.WORDPRESS_API_BASE || '/wp-json/brighter-core/v1';
const API_TOKEN = process.env.WORDPRESS_API_TOKEN;

async function testConnection() {
  console.log('🔍 Testing WordPress API Connection...\n');
  console.log(`WordPress URL: ${WORDPRESS_URL}`);
  console.log(`API Base: ${API_BASE}`);
  console.log(`Token: ${API_TOKEN ? '✅ Set' : '❌ Missing'}\n`);

  if (!API_TOKEN) {
    console.error('❌ WORDPRESS_API_TOKEN not found in .env file');
    process.exit(1);
  }

  try {
    // Test 1: Get posts
    console.log('Test 1: Fetching posts...');
    const postsUrl = `${WORDPRESS_URL}${API_BASE}/posts?per_page=2`;

    const response = await fetch(postsUrl, {
      headers: {
        'X-Brighter-Token': API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${errorText}`);
      process.exit(1);
    }

    const posts = await response.json();
    console.log(`✅ Successfully fetched ${posts.length} posts\n`);

    if (posts.length > 0) {
      const firstPost = posts[0];
      console.log('📄 Sample Post Data:');
      console.log(`   ID: ${firstPost.id || 'N/A'}`);
      console.log(`   Title: ${firstPost.title || 'N/A'}`);
      console.log(`   URL: ${firstPost.url || firstPost.link || 'N/A'}`);

      // Check for CAR data
      if (firstPost.meta) {
        console.log('\n📊 CAR Data Available:');
        console.log(`   Maturity Level: ${firstPost.meta.bw_cont_maturity || 'N/A'}`);
        console.log(`   Content Intent: ${firstPost.meta.bw_intent || 'N/A'}`);
        console.log(`   Word Count: ${firstPost.meta.bw_word_count || 'N/A'}`);
      }
    }

    console.log('\n✅ WordPress API connection successful!');
    console.log('\n🚀 Ready to deploy to VPS and connect to Claude!\n');

  } catch (error) {
    console.error(`❌ Connection failed: ${error.message}`);
    process.exit(1);
  }
}

testConnection();
