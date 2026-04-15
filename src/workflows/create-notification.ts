import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createNotificationStep } from "./steps/create-notification"

export const createNotificationWorkflow = createWorkflow(
  "create-notification",
  createNotificationStep
)
