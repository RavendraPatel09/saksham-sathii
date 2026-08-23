#!/bin/bash
echo "🔐 Scanning for unused environment variables..."

echo "Env vars used in code:"
grep -r "process\.env\|import\.meta\.env" src --include="*.ts" --include="*.tsx" | sed 's/.*\(process\.env\|import\.meta\.env\)\.\([A-Z_]*\).*/\2/' | sort | uniq

echo -e "\nEnv vars defined in .env.example:"
cat .env.example 2>/dev/null | grep "=" | sed 's/=.*//' | sort

echo -e "\n✅ Done comparing."
