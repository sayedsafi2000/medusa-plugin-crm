import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { customer_id, tag_ids, assigned_by } = (req.validatedBody || req.body) as {
    customer_id: string
    tag_ids: string[]
    assigned_by?: string
  }

  if (!customer_id || !tag_ids?.length) {
    res.status(400).json({ error: "customer_id and tag_ids are required" })
    return
  }

  try {
    const assignments: any[] = []
    for (const tag_id of tag_ids) {
      const existing = await crmService.listCustomerTagAssignments({
        customer_id,
        tag_id,
      })
      if (existing.length === 0) {
        const assignment = await crmService.createCustomerTagAssignments({
          customer_id,
          tag_id,
          assigned_by: assigned_by || "Admin",
        })
        assignments.push(assignment)
      }
    }

    for (const tag_id of tag_ids) {
      const tagAssignments = await crmService.listCustomerTagAssignments({ tag_id })
      await crmService.updateCustomerTags({
        id: tag_id,
        customer_count: tagAssignments.length,
      })
    }

    res.json({ assignments, count: assignments.length })
  } catch (error) {
    console.error("Failed to assign tags:", error)
    res.status(500).json({ error: "Failed to assign tags" })
  }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { customer_id, tag_id } = (req.validatedBody || req.body) as {
    customer_id: string
    tag_id: string
  }

  if (!customer_id || !tag_id) {
    res.status(400).json({ error: "customer_id and tag_id are required" })
    return
  }

  try {
    const existing = await crmService.listCustomerTagAssignments({
      customer_id,
      tag_id,
    })

    for (const assignment of existing) {
      await crmService.deleteCustomerTagAssignments(assignment.id)
    }

    const tagAssignments = await crmService.listCustomerTagAssignments({ tag_id })
    await crmService.updateCustomerTags({
      id: tag_id,
      customer_count: tagAssignments.length,
    })

    res.json({ removed: true })
  } catch (error) {
    console.error("Failed to remove tag:", error)
    res.status(500).json({ error: "Failed to remove tag" })
  }
}
