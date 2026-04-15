import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { CRM_MODULE } from "../../../../../modules/crm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = (req.validatedBody || req.body) as { id?: string }

  if (!id) {
    res.status(400).json({ error: "Segment id is required" })
    return
  }

  try {
    const segment = await crmService.retrieveCustomerSegment(id)
    const criteria = segment.criteria || {}

    const customerModule = req.scope.resolve(Modules.CUSTOMER) as any
    const orderModule = req.scope.resolve(Modules.ORDER) as any

    let customers = await customerModule.listCustomers({}, {
      take: 1000,
      select: ["id", "email", "first_name", "last_name", "created_at"],
    })

    const enriched: Array<{
      id: string
      email: string
      name: string
      total_spent: number
      order_count: number
      last_order_date: string | null
      created_at: string
    }> = []

    for (const customer of customers) {
      let totalSpent = 0
      let orderCount = 0
      let lastOrderDate: string | null = null

      try {
        const orders = await orderModule.listOrders(
          { customer_id: customer.id },
          { select: ["id", "total", "created_at"] }
        )
        orderCount = orders.length
        totalSpent = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)
        if (orders.length > 0) {
          lastOrderDate = orders.map((o: any) => o.created_at).sort().pop() || null
        }
      } catch {
        // no orders
      }

      enriched.push({
        id: customer.id,
        email: customer.email,
        name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        total_spent: totalSpent,
        order_count: orderCount,
        last_order_date: lastOrderDate,
        created_at: customer.created_at,
      })
    }

    let filtered = enriched

    if (criteria.min_total_spent !== undefined) {
      filtered = filtered.filter((c) => c.total_spent >= criteria.min_total_spent)
    }
    if (criteria.max_total_spent !== undefined) {
      filtered = filtered.filter((c) => c.total_spent <= criteria.max_total_spent)
    }
    if (criteria.min_order_count !== undefined) {
      filtered = filtered.filter((c) => c.order_count >= criteria.min_order_count)
    }
    if (criteria.max_order_count !== undefined) {
      filtered = filtered.filter((c) => c.order_count <= criteria.max_order_count)
    }
    if (criteria.last_order_after) {
      filtered = filtered.filter((c) => c.last_order_date && c.last_order_date >= criteria.last_order_after)
    }
    if (criteria.last_order_before) {
      filtered = filtered.filter((c) => c.last_order_date && c.last_order_date <= criteria.last_order_before)
    }

    if (criteria.rules && criteria.rules.length > 0) {
      for (const rule of criteria.rules) {
        filtered = filtered.filter((c) => {
          const val = (c as any)[rule.field]
          if (val === undefined) return false
          switch (rule.operator) {
            case "eq": return String(val) === rule.value
            case "neq": return String(val) !== rule.value
            case "gt": return Number(val) > Number(rule.value)
            case "gte": return Number(val) >= Number(rule.value)
            case "lt": return Number(val) < Number(rule.value)
            case "lte": return Number(val) <= Number(rule.value)
            case "contains": return String(val).toLowerCase().includes(rule.value.toLowerCase())
            default: return true
          }
        })
      }
    }

    const matchingIds = filtered.map((c) => c.id)

    const existingAssignments = await crmService.listCustomerSegmentAssignments({ segment_id: id })
    for (const assignment of existingAssignments) {
      if (!matchingIds.includes(assignment.customer_id)) {
        await crmService.deleteCustomerSegmentAssignments(assignment.id)
      }
    }

    const existingCustomerIds = existingAssignments.map((a: any) => a.customer_id)
    for (const customerId of matchingIds) {
      if (!existingCustomerIds.includes(customerId)) {
        await crmService.createCustomerSegmentAssignments({
          customer_id: customerId,
          segment_id: id,
          assigned_by: "system",
        })
      }
    }

    await crmService.updateCustomerSegments({
      id,
      customer_count: matchingIds.length,
      last_refreshed_at: new Date().toISOString(),
    })

    res.json({
      segment_id: id,
      customer_count: matchingIds.length,
      preview: filtered.slice(0, 50),
    })
  } catch (error) {
    console.error("Failed to refresh segment:", error)
    res.status(500).json({ error: "Failed to refresh segment" })
  }
}
