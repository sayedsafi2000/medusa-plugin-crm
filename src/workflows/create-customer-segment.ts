import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createCustomerSegmentStep } from "./steps/create-customer-segment"

export const createCustomerSegmentWorkflow = createWorkflow(
  "create-customer-segment",
  createCustomerSegmentStep
)
