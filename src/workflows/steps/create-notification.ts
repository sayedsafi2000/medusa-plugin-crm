import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createNotificationStep = createStep(
  "create-notification",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const notification = await crmService.createNotifications(input)
    return new StepResponse(notification, notification.id)
  },
  async (notificationId: string | undefined, { container }: any) => {
    if (!notificationId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteNotifications(notificationId)
  }
)
