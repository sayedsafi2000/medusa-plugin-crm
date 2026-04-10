import { SubscriberArgs } from "@medusajs/framework"
import { crmModuleService } from "../modules/crm"
import CrmModuleService from "../modules/crm/service"

export default async function customerActivitySubscriber({
  event,
  container,
}: SubscriberArgs<any>) {
  const crmService: CrmModuleService = container.resolve(crmModuleService)

  try {
    const data = event.data
    await crmService.createCustomerActivities({
      customer_id: data.customerId || data.id,
      activity_type: event.name,
      activity_data: data,
    } as any)
  } catch (error) {
    console.error("Failed to create customer activity:", error)
  }
}

export const config = {
  event: ["customer.created", "customer.updated", "order.placed", "order.updated"],
}
