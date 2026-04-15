import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createAutomationStep } from "./steps/create-automation"

export const createAutomationWorkflow = createWorkflow(
  "create-automation",
  createAutomationStep
)
