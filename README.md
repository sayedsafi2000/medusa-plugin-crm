# Medusa CRM Plugin

A production-ready, advanced CRM plugin for MedusaJS v2 with sales pipeline, marketing campaigns, automation rules, notifications, role-based permissions, CSV export, error logging, and a full admin UI.

## Features

### Core CRM
- **Customer Notes** — Full CRUD, attach to customers & orders
- **Customer Tasks** — Full CRUD with status, priority, due dates, assignments, order attachment
- **Activity Timeline** — Auto-tracked activities (orders, notes, tasks, campaigns, communications, automations)
- **Customer Segments** — Dynamic/static segments with advanced criteria (total spent, order count, last order date)
- **Customer Tags** — Colored tags with customer counts

### Sales Pipeline
- **Lead Management** — 6-stage pipeline (New → Qualified → Proposal → Negotiation → Won/Lost)
- **Kanban Board** — Visual drag-and-drop pipeline view
- **Lead Scoring** — Probability & estimated value tracking
- **Lead Sources** — Website, referral, social media, email, phone

### Communication
- **Communication Logs** — Email, SMS, WhatsApp, Call tracking (inbound/outbound)
- **Delivery Tracking** — Sent, delivered, failed, pending status

### Marketing
- **Campaign Management** — Multi-channel campaigns (email, SMS, WhatsApp, multi-channel)
- **Campaign Tracking** — Sent, delivered, opened, clicked, converted, failed, bounced counts
- **Segment Targeting** — Target specific customer segments

### Automation Rule System
- **Trigger-Action Rules** — Order created → send message, customer created → add to segment, etc.
- **Built-in Types** — Follow-up, abandoned cart, birthday, re-engagement, high-value order
- **Retry Mechanism** — Max retries, retry count, last error tracking
- **Scheduled Jobs** — Abandoned cart (every 6h), birthday (daily 8am), re-engagement (weekly Mon 9am)

### Notifications
- **Admin Notifications** — High-value orders, new leads, failed campaigns, automation errors
- **Mark Read/Unread** — Bulk mark-as-read, per-notification read status
- **Severity Levels** — Info, warning, error, success

### Role & Permissions
- **CRM Roles** — Admin, Sales Rep, Marketing Manager (seeded by default)
- **Granular Permissions** — Per-resource read/create/update/delete/send/execute
- **Default Roles** — Auto-seeded on first run

### Export System
- **CSV Export** — Export notes, tasks, leads, campaigns, activities, communications
- **Filter Support** — Filter exports by customer_id, status, stage

### Settings Panel
- **API Keys** — WhatsApp, Email, SMS API keys (stored as secrets)
- **Campaign Defaults** — Default campaign channel type
- **Automation Defaults** — Abandoned cart delay, birthday automation toggle
- **Notification Settings** — High-value threshold, notification email

### Error Logging
- **Error Log Model** — Source, error code, message, stack trace, reference tracking
- **Retry Mechanism** — Pending → retrying → resolved/failed lifecycle
- **Error Sources** — API, workflow, automation, campaign, notification, job, export, subscriber

### Performance
- **Pagination** — All list APIs support `limit` (max 100) and `offset` with total `count`
- **Optimized Queries** — `listAndCount` with `take`/`skip`/`order` on all endpoints

### Customer Detail Widget
- **CRM Overview** — Injected into Medusa's customer detail page
- **Timeline View** — Shows notes, tasks, activities, communications in unified timeline
- **Quick Actions** — Add notes directly from customer detail page

## Installation

### 1. Install the plugin

```bash
npm install medusa-plugin-crm
# or
yarn add medusa-plugin-crm
```

### 2. Configure the plugin

Add to your `medusa-config.ts`:

```typescript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  plugins: [
    {
      resolve: "medusa-plugin-crm",
      options: {},
    },
  ],
})
```

### 3. Run migrations

```bash
npx medusa db:migrate
```

### 4. Start your Medusa server

```bash
npx medusa develop
```

The plugin auto-seeds default roles (admin, sales_rep, marketing) and default settings on first run.

## Admin Pages

After installation, a **CRM** section appears in the admin sidebar with:

| Page | Description |
|---|---|
| Notes | Customer notes with CRUD |
| Tasks | Task management with filters |
| Sales Pipeline | Kanban lead board |
| Activities | Activity timeline |
| Analytics | Dashboard with metrics |
| Communications | Communication log management |
| Campaigns | Campaign creation & tracking |
| Automations | Automation rule management |
| Segments | Customer segment builder |
| Tags | Tag management |
| Timeline | Unified customer timeline |
| Notifications | Admin notification center |
| Roles & Permissions | CRM role management |
| Error Logs | Error tracking & retry |
| Settings | API keys & configuration |

## API Endpoints

All endpoints support pagination via `limit` (default 50, max 100) and `offset` query params. Responses include `count` for total records.

### Notes
- `GET /admin/crm/notes` — List (filters: `customer_id`, `order_id`)
- `POST /admin/crm/notes` — Create
- `GET /admin/crm/notes/:id` — Retrieve
- `POST /admin/crm/notes/:id` — Update
- `DELETE /admin/crm/notes/:id` — Delete

### Tasks
- `GET /admin/crm/tasks` — List (filters: `customer_id`, `order_id`, `status`, `priority`, `assigned_to`)
- `POST /admin/crm/tasks` — Create
- `GET /admin/crm/tasks/:id` — Retrieve
- `POST /admin/crm/tasks/:id` — Update
- `DELETE /admin/crm/tasks/:id` — Delete

### Activities
- `GET /admin/crm/activities` — List (filters: `customer_id`, `order_id`, `activity_type`, `severity`)

### Leads
- `GET /admin/crm/leads` — List (filters: `stage`, `assigned_to`, `source`)
- `POST /admin/crm/leads` — Create
- `GET /admin/crm/leads/:id` — Retrieve
- `POST /admin/crm/leads/:id` — Update
- `DELETE /admin/crm/leads/:id` — Delete

### Communication Logs
- `GET /admin/crm/communication-logs` — List (filters: `customer_id`, `lead_id`, `type`, `direction`)
- `POST /admin/crm/communication-logs` — Create
- `GET /admin/crm/communication-logs/:id` — Retrieve
- `POST /admin/crm/communication-logs/:id` — Update
- `DELETE /admin/crm/communication-logs/:id` — Delete

### Campaigns
- `GET /admin/crm/campaigns` — List (filters: `status`, `type`)
- `POST /admin/crm/campaigns` — Create
- `GET /admin/crm/campaigns/:id` — Retrieve
- `POST /admin/crm/campaigns/:id` — Update
- `DELETE /admin/crm/campaigns/:id` — Delete

### Automations
- `GET /admin/crm/automations` — List (filters: `status`, `type`, `is_active`)
- `POST /admin/crm/automations` — Create
- `GET /admin/crm/automations/:id` — Retrieve
- `POST /admin/crm/automations/:id` — Update
- `DELETE /admin/crm/automations/:id` — Delete

### Segments
- `GET /admin/crm/segments` — List (filters: `is_dynamic`)
- `POST /admin/crm/segments` — Create
- `GET /admin/crm/segments/:id` — Retrieve
- `POST /admin/crm/segments/:id` — Update
- `DELETE /admin/crm/segments/:id` — Delete

### Tags
- `GET /admin/crm/tags` — List
- `POST /admin/crm/tags` — Create
- `GET /admin/crm/tags/:id` — Retrieve
- `POST /admin/crm/tags/:id` — Update
- `DELETE /admin/crm/tags/:id` — Delete

### Notifications
- `GET /admin/crm/notifications` — List (filters: `recipient_id`, `type`, `is_read`, `severity`)
- `POST /admin/crm/notifications` — Create
- `GET /admin/crm/notifications/:id` — Retrieve
- `POST /admin/crm/notifications/:id` — Update
- `DELETE /admin/crm/notifications/:id` — Delete
- `POST /admin/crm/notifications/mark-read` — Bulk mark as read (body: `{ ids: string[] }`)

### Settings
- `GET /admin/crm/settings` — List all (filter: `category`)
- `POST /admin/crm/settings` — Create or update (upsert by key)
- `GET /admin/crm/settings/:key` — Get by key
- `DELETE /admin/crm/settings/:key` — Delete by key

### Error Logs
- `GET /admin/crm/error-logs` — List (filters: `source`, `status`)
- `POST /admin/crm/error-logs` — Create
- `GET /admin/crm/error-logs/:id` — Retrieve
- `POST /admin/crm/error-logs/:id` — Update (retry/resolve)
- `DELETE /admin/crm/error-logs/:id` — Delete

### Roles
- `GET /admin/crm/roles` — List
- `POST /admin/crm/roles` — Create
- `GET /admin/crm/roles/:id` — Retrieve
- `POST /admin/crm/roles/:id` — Update
- `DELETE /admin/crm/roles/:id` — Delete

### Timeline
- `GET /admin/crm/timeline` — Unified timeline (required: `customer_id` or `order_id`)

### Segment Preview
- `POST /admin/crm/segment-preview` — Preview customers matching criteria

### Export
- `GET /admin/crm/export` — CSV export (query: `resource`, `customer_id`, `status`, `stage`)
  - Resources: `notes`, `tasks`, `leads`, `campaigns`, `activities`, `communications`

### Analytics
- `GET /admin/crm/analytics` — Dashboard metrics

## Data Models (13)

| Model | Table | Description |
|---|---|---|
| CustomerNote | `customer_note` | Notes with customer_id & order_id |
| CustomerTask | `customer_task` | Tasks with status/priority/due_date & order_id |
| CustomerActivity | `customer_activity` | Activities with severity & order_id |
| CustomerSegment | `customer_segment` | Segments with is_dynamic & refresh_interval |
| CustomerTag | `customer_tag` | Colored tags |
| Lead | `lead` | Sales pipeline leads |
| CommunicationLog | `communication_log` | Communication tracking |
| Campaign | `campaign` | Campaigns with full tracking (failed/bounced) |
| Automation | `automation` | Trigger-action rules with retry |
| Notification | `crm_notification` | Admin notifications |
| CrmSetting | `crm_setting` | Key-value settings with categories |
| ErrorLog | `crm_error_log` | Error tracking with retry lifecycle |
| CrmRole | `crm_role` | Role-based permissions |

## Event Subscribers

The plugin auto-tracks activities and dispatches notifications:

- **`customer.created`** — Logs activity + dispatches "New Customer" notification
- **`customer.updated`** — Logs activity
- **`order.placed`** — Logs activity + dispatches "High Value Order" notification (if total ≥ threshold)
- **`order.updated`** — Logs activity

All subscriber errors are automatically logged to the `crm_error_log` table.

## Scheduled Jobs

| Job | Schedule | Description |
|---|---|---|
| Abandoned Cart Follow-up | Every 6 hours | Runs active abandoned cart automations |
| Birthday Automation | Daily at 8am | Runs birthday automations |
| Re-engagement Automation | Weekly Monday 9am | Runs re-engagement automations |
| Seed CRM Defaults | Yearly (one-time) | Seeds default roles & settings |

## Workflows

```
createCustomerNoteWorkflow
createCustomerTaskWorkflow
logCustomerActivityWorkflow
createLeadWorkflow
updateLeadWorkflow
createCommunicationLogWorkflow
createCampaignWorkflow
createAutomationWorkflow
createCustomerSegmentWorkflow
createCustomerTagWorkflow
createNotificationWorkflow
logErrorWorkflow
```

## Development

```bash
yarn build    # Build the plugin
yarn dev      # Development mode
yarn deploy   # Publish to npm
```

## License

MIT
