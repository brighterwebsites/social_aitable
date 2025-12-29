#!/bin/bash

echo "================================================"
echo "WordPress MCP Server Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your WordPress API token!"
    echo "   Get your token from: WordPress Admin → Brighter Support → API Settings"
    echo ""
    echo "   Then run: npm start"
else
    echo "✅ .env file already exists"
    echo ""
    echo "Ready to start! Run: npm start"
fi

echo ""
echo "================================================"
echo "Setup complete!"
echo "================================================"
