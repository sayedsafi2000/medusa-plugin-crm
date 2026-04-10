import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createCustomerTaskStep } from "./steps/create-customer-task"

export const createCustomerTaskWorkflow = createWorkflow(
  "create-customer-task",
  createCustomerTaskStep
)
