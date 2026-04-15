import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { logErrorStep } from "./steps/log-error"

export const logErrorWorkflow = createWorkflow(
  "log-error",
  logErrorStep
)
