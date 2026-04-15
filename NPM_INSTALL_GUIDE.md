# How to Install @sayedsafi/medusa-plugin-crm from NPM

This guide explains exactly how to install and configure the plugin from npm.

## Step 1: Install the Plugin

```bash
cd /Users/safi/Desktop/Musafir\ storefront/musafir-medusa-backend

npm install @sayedsafi/medusa-plugin-crm
# or
yarn add @sayedsafi/medusa-plugin-crm
# or  
pnpm add @sayedsafi/medusa-plugin-crm
```

This will:
- Download the package from npm registry
- Extract to `node_modules/@sayedsafi/medusa-plugin-crm/`
- Install all dependencies (including @sendgrid/mail and twilio)
- Create/update package-lock.json

## Step 2: Configure medusa-config.js

Edit your `medusa-config.js` and add the plugin:

```javascript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    // ... your existing config ...
  },
  plugins: [
    // ... other plugins ...
    "@sayedsafi/medusa-plugin-crm",  // Add this line
  ],
})
```

## Step 3: Set Environment Variables

Add to your `.env` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourstore.com

# Twilio Configuration (for SMS & WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=14155552671  # Optional
```

## Step 4: Run Database Migrations

The plugin includes 2 migrations that will be executed:

```bash
# This will run BOTH migrations automatically
npx medusa db:migrate

# You'll see:
# - Migration20250416000000_InitCRM (creates base CRM tables)
# - Migration20250416000001_AddNotesAndTemplates (adds notes & templates)
```

**Tables created:**
- `crm_customer` - Customer records
- `crm_lead` - Sales leads
- `crm_task` - Team tasks
- `crm_campaign` - Email/SMS/WhatsApp campaigns
- `crm_communication_log` - Message delivery logs
- `crm_customer_note` - Internal customer notes
- `crm_email_template` - Reusable email templates

## Step 5: Start Your Backend

```bash
npx medusa develop
```

You should see:
```
info: Medusa server is running on port 9000
info: Plugin 'crm' loaded successfully
```

## Step 6: Access the Admin Panel

Go to your Medusa admin:
- URL: `http://localhost:7001/admin/crm`

You'll see:
- **Dashboard** - CRM overview metrics
- **Customers** - Search, filter, add notes
- **Leads** - Track with pipeline status
- **Tasks** - Assign to team
- **Campaigns** - Create and send email/SMS/WhatsApp
- **Communications** - View delivery logs
- **Templates** - Create reusable email templates

## Step 7: Test the API

Test basic endpoints:

```bash
# List customers
curl http://localhost:9000/admin/crm/customers

# Create a customer
curl -X POST http://localhost:9000/admin/crm/customers \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","phone":"+1234567890"}'

# Add a note to customer
curl -X POST http://localhost:9000/admin/crm/notes \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"cust_123","content":"VIP customer"}'

# List templates
curl http://localhost:9000/admin/crm/templates

# Export customers as CSV
curl http://localhost:9000/admin/crm/export?type=customer -o customers.csv
```

---

## What Happens During Installation

### Files Installed
- 26 compiled JavaScript files
- 2 database migrations
- 7 data models
- 9 API route handlers
- 1 admin UI module
- 2 services (CRM Module Service + Campaign Service)

### No Files Modified
- ✅ No changes to Medusa's core files
- ✅ No changes to existing migrations
- ✅ No changes to existing database tables
- ✅ No hooks into customer auth/signup
- ✅ No modifications to existing modules

### Database Safety
- ✅ All tables prefixed with `crm_` (isolated)
- ✅ Migrations can be rolled back with `down()` method
- ✅ Foreign keys properly configured
- ✅ Indices created for performance

---

## Troubleshooting

### Plugin not loading?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npx medusa develop
```

### Migrations failed?
```bash
# Check migration status
npx medusa db:show

# Manually run migrations
npx medusa db:migrate
```

### SendGrid/Twilio not working?
```bash
# Verify environment variables are set
echo $SENDGRID_API_KEY
echo $TWILIO_ACCOUNT_SID

# Check backend logs for errors
# They appear in console when you run `npx medusa develop`
```

### Admin panel not showing CRM?
```bash
# Rebuild admin UI
npm run build

# Clear browser cache and refresh
# http://localhost:7001/admin/crm
```

---

## What You Get

✅ **Customer Management**
- Sync Medusa customers
- Add notes and metadata
- Search and filter

✅ **Lead Management**
- Track sales pipeline
- 6 status stages
- Team assignment

✅ **Task Management**
- Create tasks
- Set priorities & due dates
- Assign to team

✅ **Email/SMS/WhatsApp Campaigns**
- Pre-built templates
- Segment recipients
- Track delivery

✅ **Bulk Operations**
- Import customers/leads (JSON)
- Export data (CSV)
- Batch email sending

✅ **REST API**
- Full CRUD on all entities
- Advanced search & filtering
- Programmatic access

✅ **Database Safety**
- Isolated tables
- No conflicts
- Easy rollback

---

## Next Steps

1. ✅ Install package
2. ✅ Configure medusa-config.js
3. ✅ Set environment variables
4. ✅ Run migrations
5. ✅ Start backend
6. ✅ Access admin panel
7. ✅ Create first customer
8. ✅ Send test campaign

Enjoy your new CRM! 🚀
