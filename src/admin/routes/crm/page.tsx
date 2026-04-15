import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Users } from "@medusajs/icons"
import { Outlet, Link } from "react-router-dom"
import { Container, Heading, Text, Button } from "@medusajs/ui"

const CrmPage = () => (
  <Container>
    <div className="flex items-center justify-between mb-6">
      <div>
        <Heading level="h1">CRM</Heading>
        <Text className="text-ui-fg-subtle">Customer Relationship Management</Text>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Link to="notes">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Notes</span>
          <span className="text-sm text-ui-fg-subtle">Customer notes and annotations</span>
        </Button>
      </Link>
      <Link to="tasks">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Tasks</span>
          <span className="text-sm text-ui-fg-subtle">Task management and tracking</span>
        </Button>
      </Link>
      <Link to="activities">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Activities</span>
          <span className="text-sm text-ui-fg-subtle">Activity timeline and history</span>
        </Button>
      </Link>
      <Link to="leads">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Sales Pipeline</span>
          <span className="text-sm text-ui-fg-subtle">Lead management and pipeline</span>
        </Button>
      </Link>
      <Link to="campaigns">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Campaigns</span>
          <span className="text-sm text-ui-fg-subtle">Marketing campaigns</span>
        </Button>
      </Link>
      <Link to="automations">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Automations</span>
          <span className="text-sm text-ui-fg-subtle">Automation rules and workflows</span>
        </Button>
      </Link>
      <Link to="segments">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Segments</span>
          <span className="text-sm text-ui-fg-subtle">Customer segments</span>
        </Button>
      </Link>
      <Link to="tags">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Tags</span>
          <span className="text-sm text-ui-fg-subtle">Customer tags</span>
        </Button>
      </Link>
      <Link to="communications">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Communications</span>
          <span className="text-sm text-ui-fg-subtle">Communication logs</span>
        </Button>
      </Link>
      <Link to="notifications">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Notifications</span>
          <span className="text-sm text-ui-fg-subtle">Admin notifications</span>
        </Button>
      </Link>
      <Link to="roles">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Roles</span>
          <span className="text-sm text-ui-fg-subtle">Role-based permissions</span>
        </Button>
      </Link>
      <Link to="settings">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Settings</span>
          <span className="text-sm text-ui-fg-subtle">CRM configuration</span>
        </Button>
      </Link>
      <Link to="analytics">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Analytics</span>
          <span className="text-sm text-ui-fg-subtle">CRM analytics dashboard</span>
        </Button>
      </Link>
      <Link to="timeline">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Timeline</span>
          <span className="text-sm text-ui-fg-subtle">Customer timeline view</span>
        </Button>
      </Link>
      <Link to="error-logs">
        <Button variant="secondary" className="w-full h-auto py-4 flex flex-col gap-2">
          <span className="text-lg font-semibold">Error Logs</span>
          <span className="text-sm text-ui-fg-subtle">Error tracking and debugging</span>
        </Button>
      </Link>
    </div>
    <Outlet />
  </Container>
)

export const config = defineRouteConfig({
  label: "CRM",
  icon: Users,
})

export default CrmPage
