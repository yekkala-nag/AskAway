#!/bin/bash
# scripts/set-vercel-env.sh — set Vercel environment variables via CLI
# Usage: bash scripts/set-vercel-env.sh
# Requires: vercel CLI installed and logged in (vercel login)

set -e

SUPABASE_URL="https://zmrplimcswbfhgkbslpx.supabase.co"
ANON_KEY="sb_publishable_EJjKBlWI67H1Z9q5EqA30A_3wpaAOnf"

echo "Setting Vercel environment variables..."
echo "Supabase URL: $SUPABASE_URL"
echo "Anon key: ${ANON_KEY:0:20}..."
echo ""
echo "⚠️  You will be prompted to paste:"
echo "  - SUPABASE_SERVICE_ROLE_KEY (sb_secret_... from Supabase Dashboard → Settings → API)"
echo "  - OPENAI_API_KEY (sk-... from platform.openai.com/api-keys)"
echo ""

# Client-side (VITE_ prefix, exposed to browser)
vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "$ANON_KEY"

# Server-side (no VITE_ prefix, never reaches client)
echo "Paste your service_role key (sb_secret_...):"
read -r SERVICE_ROLE_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SERVICE_ROLE_KEY"
vercel env add SUPABASE_URL production <<< "$SUPABASE_URL"

echo "Paste your OpenAI API key (sk-...):"
read -r OPENAI_KEY
vercel env add OPENAI_API_KEY production <<< "$OPENAI_KEY"

echo ""
echo "✅ All environment variables set. Redeploy with: vercel --prod"