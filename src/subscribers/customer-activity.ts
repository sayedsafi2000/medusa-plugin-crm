import { SubscriberArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/utils"
import { CRM_MODULE } from "../modules/crm"
import CrmModuleService from "../modules/crm/service"

type ActivityType = "order" | "note" | "task" | "login" | "email" | "campaign" | "communication" | "automation" | "other"

function eventToActivityType(eventName: string): ActivityType {
  if (eventName.startsWith("order.")) return "order"
  if (eventName.startsWith("customer.")) return "other"
  return "other"
}

async function resolveCustomerId(
  eventName: string,
  data: Record<string, unknown> | undefined,
  container: SubscriberArgs<any>["container"]
): Promise<string | null> {
  if (!data) return null
  if (eventName.startsWith("customer.")) {
    const id = data.id
    return typeof id === "string" ? id : null
  }
  if (eventName.startsWith("order.")) {
    const orderId = data.id
    if (typeof orderId !== "string") return null
    try {
      const orderModule = container.resolve(Modules.ORDER) as {
        retrieveOrder: (id: string) => Promise<{ customer_id?: string | null }>
      }
      const order = await orderModule.retrieveOrder(orderId)
      const cid = order?.customer_id
      return typeof cid === "string" && cid.length ? cid : null
    } catch {
      return null
    }
  }
  return null
}

async function dispatchNotification(
  crmService: any,
  type: string,
  title: string,
  message: string,
  severity: string,
  referenceType?: string,
  referenceId?: string
) {
  try {
    await crmService.createNotifications({
      recipient_id: "admin",
      recipient_type: "admin",
      type,
      title,
      message,
      severity,
      reference_type: referenceType || null,
      reference_id: referenceId || null,
    })
  } catch (error) {
    console.error("Failed to dispatch notification:", error)
  }
}

export default async function customerActivitySubscriber({
  event,
  container,
}: SubscriberArgs<{ id?: string; customer_id?: string; customerId?: string }>) {
  const crmService = container.resolve(CRM_MODULE) as CrmModuleService

  try {
    const data = (event.data ?? {}) as Record<string, unknown>
    const customer_id = await resolveCustomerId(event.name, data, container)

    const activity_type = eventToActivityType(event.name)

    const order_id = event.name.startsWith("order.") ? (data.id as string) || null : null

    if (customer_id) {
      await crmService.createCustomerActivities({
        customer_id,
        order_id,
        activity_type,
        activity_data: {
          ...data,
          event_name: event.name,
        },
      })
    }

    // Dispatch notifications for key events
    if (event.name === "order.placed" && data.total) {
      const total = Number(data.total)
      if (total >= 500) {
        await dispatchNotification(
          crmService,
          "high_value_order",
          "High Value Order",
          `Order ${data.id} placed with total ${total}. Customer: ${customer_id || "unknown"}`,
          "success",
          "order",
          data.id as string
        )
      }
    }

    if (event.name === "customer.created" && customer_id) {
      await dispatchNotification(
        crmService,
        "new_lead",
        "New Customer",
        `New customer registered: ${customer_id}`,
        "info",
        "customer",
        customer_id
      )
    }

    // Trigger automations (basic logging for now)
    const automations = await crmService.listAutomations({
      trigger_event: event.name,
      is_active: true,
      status: "active",
    })

    for (const automation of automations) {
      try {
        await crmService.updateAutomations({
          id: automation.id,
          last_run_at: new Date(),
          run_count: (automation.run_count || 0) + 1,
          success_count: (automation.success_count || 0) + 1,
        })
      } catch (err) {
        console.error("Automation trigger error:", err)
      }
    }
  } catch (error) {
    console.error("Failed to create customer activity:", error)
    try {
      await crmService.createErrorLogs({
        source: "subscriber",
        error_message: error instanceof Error ? error.message : String(error),
        stack_trace: error instanceof Error ? error.stack || null : null,
        reference_type: "event",
        reference_id: event.name,
        status: "pending",
      })
    } catch {
      // Silently fail if error logging itself fails
    }
  }
}

export const config = {
  event: ["customer.created", "customer.updated", "order.placed", "order.updated"],
}
