import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createCommunicationLogStep = createStep(
  "create-communication-log",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const log = await crmService.createCommunicationLogs(input)
    return new StepResponse(log, log.id)
  },
  async (logId: string | undefined, { container }: any) => {
    if (!logId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteCommunicationLogs(logId)
  }
)
