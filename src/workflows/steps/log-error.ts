import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const logErrorStep = createStep(
  "log-error",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const errorLog = await crmService.createErrorLogs(input)
    return new StepResponse(errorLog, errorLog.id)
  },
  async (errorLogId: string | undefined, { container }: any) => {
    if (!errorLogId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteErrorLogs(errorLogId)
  }
)
