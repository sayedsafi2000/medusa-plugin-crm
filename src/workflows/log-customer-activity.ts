import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { logCustomerActivityStep } from "./steps/log-customer-activity"

export const logCustomerActivityWorkflow = createWorkflow(
  "log-customer-activity",
  logCustomerActivityStep
)
