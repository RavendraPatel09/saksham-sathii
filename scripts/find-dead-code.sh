#!/bin/bash
echo "🔍 Scanning for dead code..."

# Find unused files in src/
echo -e "\n📄 Potentially unused TypeScript files:"
find src -name "*.ts" -o -name "*.tsx" | while read file; do
  import_count=$(grep -r --include="*.ts" --include="*.tsx" "import.*from.*${file}" src --exclude-dir=node_modules 2>/dev/null | wc -l)
  if [ $import_count -eq 0 ]; then
    echo "  ⚠️  $file (imported 0 times)"
  fi
done

# Find unused components
echo -e "\n🧩 Potentially unused components:"
grep -r "export const\|export function" src/components --include="*.tsx" | while read line; do
  component_name=$(echo "$line" | sed 's/.*export \(const\|function\) \([^ (]*\).*/\2/')
  usage_count=$(grep -r "$component_name" src --include="*.tsx" --exclude-dir=components 2>/dev/null | wc -l)
  if [ $usage_count -eq 0 ]; then
    echo "  ⚠️  Component '$component_name' not imported anywhere"
  fi
done

echo -e "\n✅ Dead code scan complete."
