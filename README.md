# Medusa CRM Plugin

A comprehensive CRM (Customer Relationship Management) plugin for Medusa.js that helps you manage customer relationships through notes, tasks, and activity tracking.

## Features

- **Customer Notes**: Add and manage notes for customers
- **Customer Tasks**: Create and track tasks with priorities, due dates, and assignments
- **Activity Timeline**: Automatically track customer activities (orders, logins, emails, etc.)
- **Admin UI Integration**: Seamless integration with Medusa admin panel
- **Real-time Updates**: Event-based activity tracking

## Installation

### 1. Install the plugin

```bash
npm install @musafir/medusa-plugin-crm
# or
yarn add @musafir/medusa-plugin-crm
# or
pnpm add @musafir/medusa-plugin-crm
```

### 2. Configure the plugin

Add the plugin to your `medusa-config.ts`:

```typescript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  // ... other config
  plugins: [
    {
      resolve: "@musafir/medusa-plugin-crm",
      options: {},
    },
    // ... other plugins
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

## Usage

### Admin Panel

After installation, you'll see a new **CRM** section in your admin sidebar with:
- **Notes**: View and manage customer notes
- **Tasks**: Create and track customer tasks
- **Activities**: View customer activity timeline

### API Endpoints

The plugin provides the following API endpoints:

#### Notes
- `GET /admin/crm/notes` - List all notes (optionally filter by customer_id)
- `POST /admin/crm/notes` - Create a new note
- `GET /admin/crm/notes/:id` - Get a specific note
- `DELETE /admin/crm/notes/:id` - Delete a note

#### Tasks
- `GET /admin/crm/tasks` - List all tasks (optionally filter by customer_id, status)
- `POST /admin/crm/tasks` - Create a new task
- `GET /admin/crm/tasks/:id` - Get a specific task
- `POST /admin/crm/tasks/:id` - Update a task
- `DELETE /admin/crm/tasks/:id` - Delete a task

#### Activities
- `GET /admin/crm/activities` - List all activities (optionally filter by customer_id, activity_type)

### Data Models

#### Customer Note
```typescript
{
  id: string
  customer_id: string
  note: string
  created_by: string
  metadata: Record<string, any> | null
  created_at: Date
  updated_at: Date
}
```

#### Customer Task
```typescript
{
  id: string
  customer_id: string
  title: string
  description: string | null
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  due_date: Date | null
  assigned_to: string | null
  created_by: string
  metadata: Record<string, any> | null
  created_at: Date
  updated_at: Date
}
```

#### Customer Activity
```typescript
{
  id: string
  customer_id: string
  activity_type: "order" | "note" | "task" | "login" | "email" | "other"
  activity_data: Record<string, any>
  created_at: Date
}
```

## Development

### Building the plugin

```bash
npm run build
```

### Running in development mode

```bash
npm run dev
```

### Publishing to npm

```bash
npm run deploy
```

## Database Tables

The plugin creates the following tables in your database:
- `customer_note` - Stores customer notes
- `customer_task` - Stores customer tasks
- `customer_activity` - Stores customer activities

## Event Subscribers

The plugin automatically tracks customer activities for the following events:
- `customer.created` - New customer registration
- `customer.updated` - Customer profile updates
- `order.placed` - New order placement
- `order.updated` - Order updates

## License

MIT

## Support

For issues and feature requests, please visit the GitHub repository.
# medusa-plugin-crm
