import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { crmModuleService } from "../../modules/crm"

export const createCustomerTaskStep = createStep(
  "create-customer-task",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(crmModuleService)
    const task = await crmService.createCustomerTasks(input)
    return new StepResponse(task, task.id)
  },
  async (taskId: string | undefined, { container }: any) => {
    if (!taskId) return
    const crmService: any = container.resolve(crmModuleService)
    await crmService.deleteCustomerTasks(taskId)
  }
)
