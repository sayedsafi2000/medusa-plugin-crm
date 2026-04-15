import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createCustomerSegmentStep = createStep(
  "create-customer-segment",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const segment = await crmService.createCustomerSegments(input)
    return new StepResponse(segment, segment.id)
  },
  async (segmentId: string | undefined, { container }: any) => {
    if (!segmentId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteCustomerSegments(segmentId)
  }
)
