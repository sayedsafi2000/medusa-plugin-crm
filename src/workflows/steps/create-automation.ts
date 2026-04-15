import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createAutomationStep = createStep(
  "create-automation",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const automation = await crmService.createAutomations(input)
    return new StepResponse(automation, automation.id)
  },
  async (automationId: string | undefined, { container }: any) => {
    if (!automationId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteAutomations(automationId)
  }
)
