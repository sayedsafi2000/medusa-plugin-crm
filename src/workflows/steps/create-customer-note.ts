import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createCustomerNoteStep = createStep(
  "create-customer-note",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const note = await crmService.createCustomerNotes(input)
    return new StepResponse(note, note.id)
  },
  async (noteId: string | undefined, { container }: any) => {
    if (!noteId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteCustomerNotes(noteId)
  }
)
