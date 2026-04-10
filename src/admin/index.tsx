import { defineAdminConfig } from "@medusajs/admin-sdk"

export default defineAdminConfig({
  routes: [
    {
      label: "CRM",
      path: "/crm",
      icon: "Users",
      children: [
        {
          label: "Notes",
          path: "/crm/notes",
        },
        {
          label: "Tasks",
          path: "/crm/tasks",
        },
        {
          label: "Activities",
          path: "/crm/activities",
        },
      ],
    },
  ],
})
