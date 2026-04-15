import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createLeadStep = createStep(
  "create-lead",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const lead = await crmService.createLeads(input)
    return new StepResponse(lead, lead.id)
  },
  async (leadId: string | undefined, { container }: any) => {
    if (!leadId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteLeads(leadId)
  }
)
