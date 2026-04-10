import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { crmModuleService } from "../../modules/crm"

export const logCustomerActivityStep = createStep(
  "log-customer-activity",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(crmModuleService)
    const activity = await crmService.createCustomerActivities(input)
    return new StepResponse(activity, activity.id)
  },
  async (activityId: string | undefined, { container }: any) => {
    if (!activityId) return
    const crmService: any = container.resolve(crmModuleService)
    await crmService.deleteCustomerActivities(activityId)
  }
)
