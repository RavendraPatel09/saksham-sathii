#!/bin/bash
set -e

echo "🚀 Starting E2E integration test runs..."

# Build/verify server dependencies
cd backend
npm run build
cd ..

# Run Playwright tests
npx playwright test

echo "✅ All E2E tests executed successfully!"
