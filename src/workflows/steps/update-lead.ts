import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

type UpdateLeadInput = {
  id: string
  [key: string]: unknown
}

export const updateLeadStep = createStep(
  "update-lead",
  async (input: UpdateLeadInput, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const lead = await crmService.updateLeads(input)
    return new StepResponse(lead, lead.id)
  },
  async (leadId: string | undefined, { container }: any) => {
    if (!leadId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.updateLeads({ id: leadId, stage: "new" })
  }
)
