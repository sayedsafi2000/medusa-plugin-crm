import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { customer_ids, segment_id, assigned_by } = (req.validatedBody || req.body) as {
    customer_ids: string[]
    segment_id: string
    assigned_by?: string
  }

  if (!customer_ids?.length || !segment_id) {
    res.status(400).json({ error: "customer_ids and segment_id are required" })
    return
  }

  try {
    const assignments: any[] = []
    for (const customer_id of customer_ids) {
      const existing = await crmService.listCustomerSegmentAssignments({
        customer_id,
        segment_id,
      })
      if (existing.length === 0) {
        const assignment = await crmService.createCustomerSegmentAssignments({
          customer_id,
          segment_id,
          assigned_by: assigned_by || "Admin",
        })
        assignments.push(assignment)
      }
    }

    const segmentAssignments = await crmService.listCustomerSegmentAssignments({ segment_id })
    await crmService.updateCustomerSegments({
      id: segment_id,
      customer_count: segmentAssignments.length,
    })

    res.json({ assignments, count: assignments.length })
  } catch (error) {
    console.error("Failed to assign segment:", error)
    res.status(500).json({ error: "Failed to assign segment" })
  }
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { customer_id, segment_id } = (req.validatedBody || req.body) as {
    customer_id: string
    segment_id: string
  }

  if (!customer_id || !segment_id) {
    res.status(400).json({ error: "customer_id and segment_id are required" })
    return
  }

  try {
    const existing = await crmService.listCustomerSegmentAssignments({
      customer_id,
      segment_id,
    })

    for (const assignment of existing) {
      await crmService.deleteCustomerSegmentAssignments(assignment.id)
    }

    const segmentAssignments = await crmService.listCustomerSegmentAssignments({ segment_id })
    await crmService.updateCustomerSegments({
      id: segment_id,
      customer_count: segmentAssignments.length,
    })

    res.json({ removed: true })
  } catch (error) {
    console.error("Failed to remove from segment:", error)
    res.status(500).json({ error: "Failed to remove from segment" })
  }
}
