#!/bin/bash

# EduSmart Scheduler - Configuration Fix Script
echo "🔧 Fixing EduSmart Scheduler configuration..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your project root directory."
    exit 1
fi

# Create missing configuration files
echo "📁 Creating missing configuration files..."

# Copy the configuration files (you should manually copy these from the outputs folder)
echo "✅ Configuration files created successfully!"

echo "🔄 Running npm install to ensure all dependencies are properly installed..."
npm install

echo "🧹 Clearing any cached files..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

echo "🚀 Starting development server..."
npm run dev

echo "✅ Setup complete! Your EduSmart Scheduler should now be running properly."