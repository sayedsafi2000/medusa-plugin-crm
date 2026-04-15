import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createCommunicationLogStep } from "./steps/create-communication-log"

export const createCommunicationLogWorkflow = createWorkflow(
  "create-communication-log",
  createCommunicationLogStep
)
