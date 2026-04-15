#!/bin/bash

# NPM Package Verification Script
# This script verifies that @sayedsafi/medusa-plugin-crm is ready for npm distribution

echo "🔍 Verifying @sayedsafi/medusa-plugin-crm npm package..."
echo ""

# 1. Check entry point exists
if [ -f ".medusa/server/src/index.js" ]; then
    echo "✅ Entry point exists: .medusa/server/src/index.js"
else
    echo "❌ Entry point NOT found"
    exit 1
fi

# 2. Check all required models are built
MODELS=("customer" "lead" "task" "campaign" "communication-log" "customer-note" "email-template")
for model in "${MODELS[@]}"; do
    if [ -f ".medusa/server/src/modules/crm/models/$model.js" ]; then
        echo "✅ Model compiled: $model.js"
    else
        echo "❌ Model NOT found: $model.js"
        exit 1
    fi
done

# 3. Check all API routes are built
ROUTES=("customers" "leads" "tasks" "campaigns" "communications" "notes" "templates" "import" "export")
for route in "${ROUTES[@]}"; do
    if [ -f ".medusa/server/src/api/admin/crm/$route/route.js" ]; then
        echo "✅ API route compiled: $route"
    else
        echo "❌ API route NOT found: $route"
        exit 1
    fi
done

# 4. Check migrations are built
MIGRATIONS=(
    ".medusa/server/src/migrations/Migration20250416000000_InitCRM.js"
    ".medusa/server/src/migrations/Migration20250416000001_AddNotesAndTemplates.js"
)
for migration in "${MIGRATIONS[@]}"; do
    if [ -f "$migration" ]; then
        echo "✅ Migration compiled: $(basename $migration)"
    else
        echo "❌ Migration NOT found: $migration"
        exit 1
    fi
done

# 5. Check service is built
if [ -f ".medusa/server/src/modules/crm/service.js" ] && [ -f ".medusa/server/src/modules/crm/service/campaign.js" ]; then
    echo "✅ Services compiled: service.js, campaign.js"
else
    echo "❌ Services NOT found"
    exit 1
fi

# 6. Check admin UI is built
if [ -f ".medusa/server/src/admin/index.js" ]; then
    echo "✅ Admin UI compiled: index.js"
else
    echo "❌ Admin UI NOT found"
    exit 1
fi

# 7. Verify package.json configuration
if grep -q '"name": "@sayedsafi/medusa-plugin-crm"' package.json; then
    echo "✅ Package name correct: @sayedsafi/medusa-plugin-crm"
else
    echo "❌ Package name incorrect"
    exit 1
fi

if grep -q '"main": ".medusa/server/src/index.js"' package.json; then
    echo "✅ Main entry point configured"
else
    echo "❌ Main entry point NOT configured"
    exit 1
fi

# 8. Count total compiled files
TOTAL_FILES=$(find .medusa/server -type f | wc -l)
echo "✅ Total files in build: $TOTAL_FILES"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ ALL CHECKS PASSED! Package is ready for npm"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 To publish to npm:"
echo "   npm publish"
echo ""
echo "🔗 Installation command for users:"
echo "   npm install @sayedsafi/medusa-plugin-crm"
echo ""
echo "📝 Add to medusa-config.js:"
echo "   plugins: ['@sayedsafi/medusa-plugin-crm']"
echo ""
