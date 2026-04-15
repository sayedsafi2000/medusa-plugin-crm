import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createCustomerTagStep = createStep(
  "create-customer-tag",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const tag = await crmService.createCustomerTags(input)
    return new StepResponse(tag, tag.id)
  },
  async (tagId: string | undefined, { container }: any) => {
    if (!tagId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteCustomerTags(tagId)
  }
)
