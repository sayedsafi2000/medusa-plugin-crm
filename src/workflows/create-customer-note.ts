import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createCustomerNoteStep } from "./steps/create-customer-note"

export const createCustomerNoteWorkflow = createWorkflow(
  "create-customer-note",
  createCustomerNoteStep
)
