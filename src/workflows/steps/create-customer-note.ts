import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { crmModuleService } from "../../modules/crm"

export const createCustomerNoteStep = createStep(
  "create-customer-note",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(crmModuleService)
    const note = await crmService.createCustomerNotes(input)
    return new StepResponse(note, note.id)
  },
  async (noteId: string | undefined, { container }: any) => {
    if (!noteId) return
    const crmService: any = container.resolve(crmModuleService)
    await crmService.deleteCustomerNotes(noteId)
  }
)
