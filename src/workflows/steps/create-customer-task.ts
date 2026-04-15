import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createCustomerTaskStep = createStep(
  "create-customer-task",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const task = await crmService.createCustomerTasks(input)
    return new StepResponse(task, task.id)
  },
  async (taskId: string | undefined, { container }: any) => {
    if (!taskId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteCustomerTasks(taskId)
  }
)
