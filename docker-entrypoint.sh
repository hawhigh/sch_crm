#!/bin/sh
set -e

echo "🔧 Running Prisma schema push..."
npx prisma db push

echo "🌱 Running seed..."
npx tsx prisma/seed.ts || echo "⚠️  Seed skipped (may already be populated)"

echo "🚀 Starting Talkin CRM server..."
exec npx tsx server/index.ts
