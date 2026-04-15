import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createCustomerTagStep } from "./steps/create-customer-tag"

export const createCustomerTagWorkflow = createWorkflow(
  "create-customer-tag",
  createCustomerTagStep
)
