import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createLeadStep } from "./steps/create-lead"

export const createLeadWorkflow = createWorkflow(
  "create-lead",
  createLeadStep
)
