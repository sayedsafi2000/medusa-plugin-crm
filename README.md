# Medusa CRM Plugin

A simple and powerful CRM plugin for MedusaJS v2 that helps you manage customers, leads, tasks, and run automated email, SMS, and WhatsApp campaigns.

## Features

✅ **Customer Management** - Sync and manage all Medusa customers  
✅ **Lead Management** - Track and nurture sales leads with status pipeline  
✅ **Task Management** - Create and track tasks for your sales team  
✅ **Email Campaigns** - Send campaigns via SendGrid  
✅ **SMS Campaigns** - Send SMS via Twilio  
✅ **WhatsApp Campaigns** - Send WhatsApp messages via Twilio  
✅ **Campaign Types** - Manual, scheduled, and trigger-based campaigns  
✅ **Communication Logs** - Track all sent messages and delivery status  
✅ **Analytics Dashboard** - View CRM metrics and performance  
✅ **REST API** - Complete API for programmatic access  
✅ **Admin UI** - Beautiful admin panel for managing all CRM data

## Installation

1. Install the plugin in your Medusa backend:

```bash
npm install medusa-plugin-crm
# or
yarn add medusa-plugin-crm
```

2. Add the plugin to your `medusa-config.js`:

```js
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  plugins: [
    "medusa-plugin-crm",
  ],
})
```

3. Set environment variables:

```env
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourstore.com

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=14155552671
```

4. Run migrations:

```bash
npx medusa db:migrate
```

5. Start your Medusa server:

```bash
npx medusa develop
```

Access the CRM dashboard at `/admin/crm`

## Admin Dashboard

Access the CRM dashboard at `/admin/crm`:

- **Dashboard** - Overview of all CRM metrics
- **Customers** - Manage customer profiles
- **Leads** - Track leads through the sales pipeline
- **Tasks** - Assign and track team tasks
- **Campaigns** - Create and manage campaigns
- **Communications** - View all sent messages and delivery status

## API Endpoints

### Customers
- `GET /admin/crm/customers` - List all customers (pagination: limit, offset)
- `POST /admin/crm/customers` - Create a new customer

#### Body Example:
```json
{
  "medusa_customer_id": "cus_123",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "name": "John Doe"
}
```

### Leads
- `GET /admin/crm/leads` - List all leads
- `POST /admin/crm/leads` - Create a new lead

#### Body Example:
```json
{
  "email": "lead@example.com",
  "name": "Jane Smith",
  "title": "Partnership Inquiry",
  "company": "ACME Corp",
  "status": "new"
}
```

### Tasks
- `GET /admin/crm/tasks` - List all tasks
- `POST /admin/crm/tasks` - Create a new task

#### Body Example:
```json
{
  "customer_id": "cust_123",
  "title": "Follow up call",
  "description": "Call to discuss pricing",
  "priority": "high",
  "due_date": "2025-04-20T10:00:00Z",
  "status": "todo"
}
```

### Campaigns
- `GET /admin/crm/campaigns` - List all campaigns
- `POST /admin/crm/campaigns` - Create a new campaign

#### Body Example:
```json
{
  "name": "Spring Promotion",
  "description": "30% off spring items",
  "type": "manual",
  "channels": {
    "email": true,
    "sms": false,
    "whatsapp": false
  },
  "template": {
    "subject": "Spring Sale - 30% Off!",
    "body": "Don't miss our spring sale. Use code SPRING30 for 30% off!"
  },
  "recipients": {
    "customer_ids": ["cus_123", "cus_456"]
  }
}
```

### Send Campaign
- `POST /admin/crm/campaigns/send` - Send a campaign

#### Body Example:
```json
{
  "campaign_id": "camp_123"
}
```

Response:
```json
{
  "success": true,
  "sent": 45,
  "failed": 2,
  "total": 47
}
```

### Communication Logs
- `GET /admin/crm/communications` - List all sent messages and their status

## Database Schema

### crm_customer
- `id` - Primary key (UUID)
- `medusa_customer_id` - Link to Medusa customer
- `email` - Customer email
- `phone` - Customer phone
- `name` - Customer name
- `metadata` - Custom metadata JSON
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### crm_lead
- `id` - Primary key (UUID)
- `email` - Lead email
- `phone` - Lead phone (optional)
- `name` - Lead name
- `title` - Lead title/subject
- `company` - Company name (optional)
- `status` - Pipeline status (new|contacted|qualified|proposal|closed_won|closed_lost)
- `description` - Notes about lead
- `metadata` - Custom metadata JSON
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### crm_task
- `id` - Primary key (UUID)
- `customer_id` - Associated customer (optional)
- `lead_id` - Associated lead (optional)
- `title` - Task title
- `description` - Task description (optional)
- `status` - todo|in_progress|completed|cancelled
- `priority` - low|normal|high
- `due_date` - Task due date (optional)
- `assigned_to` - Assigned user (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### crm_campaign
- `id` - Primary key (UUID)
- `name` - Campaign name
- `description` - Campaign description (optional)
- `channels` - JSON: {email, sms, whatsapp}
- `type` - manual|scheduled|trigger
- `status` - draft|scheduled|running|completed|paused
- `template` - JSON: {subject, body, variables}
- `recipients` - JSON: {customer_ids, lead_ids, segment}
- `schedule` - JSON: {send_at, frequency} for scheduled campaigns
- `trigger` - JSON: {event, conditions} for trigger campaigns
- `sent_count` - Number of messages sent
- `failed_count` - Number of failed messages
- `sent_at` - When campaign was sent
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### crm_communication_log
- `id` - Primary key (UUID)
- `customer_id` - Associated customer (optional)
- `lead_id` - Associated lead (optional)
- `campaign_id` - Associated campaign ID
- `channel` - email|sms|whatsapp
- `recipient` - Email/phone of recipient
- `status` - pending|sent|failed|bounced
- `subject` - Message subject (for email)
- `message` - Message content
- `error_message` - Error details if failed
- `sent_at` - When message was sent
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Configuration

### SendGrid Setup

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Get your API key from Settings → API Keys
3. Add to `.env`:
   ```
   SENDGRID_API_KEY=SG.xxx...
   SENDGRID_FROM_EMAIL=noreply@yourstore.com
   ```

### Twilio Setup

1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number for SMS
4. Set up WhatsApp for your Twilio number (optional)
5. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxx...
   TWILIO_AUTH_TOKEN=xxx...
   TWILIO_PHONE_NUMBER=+1234567890
   TWILIO_WHATSAPP_NUMBER=14155552671  # Optional
   ```

## Troubleshooting

### Email campaigns not sending

1. Verify `SENDGRID_API_KEY` is set correctly in your `.env`
2. Ensure `SENDGRID_FROM_EMAIL` is a verified sender in SendGrid
3. Check the communication logs at `/admin/crm/communications`
4. Verify recipient email addresses are valid

### SMS/WhatsApp not sending

1. Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set
2. Ensure you have sufficient Twilio account credits
3. Check that phone numbers are in correct international format (+1234567890)
4. Review the communication logs for error messages

### Database migration errors

```bash
# Reset migrations (development only)
npx medusa db:drop
npx medusa db:migrate
```

## Development

```bash
# Install dependencies
yarn install

# Development mode
yarn dev

# Build for production
yarn build

# Publish to NPM
yarn deploy
```

## Publishing to NPM

### Prerequisites

1. Update version in `package.json`
2. Build the plugin: `yarn build`
3. Create NPM account at [npmjs.com](https://npmjs.com)
4. Login: `npm login`

### Publish

```bash
yarn deploy
# or
npm publish
```

## Support

For issues and feature requests: [GitHub Issues](https://github.com/sayedsafi2000/medusa-plugin-crm/issues)

## License

MIT © 2025 Musafir

## Changelog

### 1.0.0 (April 16, 2025)
- ✨ Initial release
- ✨ Customer management
- ✨ Lead pipeline
- ✨ Task management
- ✨ Email campaigns via SendGrid
- ✨ SMS campaigns via Twilio
- ✨ WhatsApp campaigns via Twilio
- ✨ Communication logs
- ✨ Admin dashboard
- ✨ Complete REST API
