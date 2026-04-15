import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { criteria } = (req.validatedBody || req.body) as {
    criteria: {
      rules?: Array<{ field: string; operator: string; value: string }>
      conjunction?: string
      min_total_spent?: number
      max_total_spent?: number
      min_order_count?: number
      max_order_count?: number
      last_order_after?: string
      last_order_before?: string
    }
  }

  if (!criteria) {
    res.status(400).json({ error: "criteria is required" })
    return
  }

  try {
    const customerModule = req.scope.resolve(Modules.CUSTOMER) as any
    const orderModule = req.scope.resolve(Modules.ORDER) as any

    let customers = await customerModule.listCustomers({}, {
      take: 1000,
      select: ["id", "email", "first_name", "last_name", "created_at"],
    })

    const enrichedCustomers: any[] = []

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
          lastOrderDate = orders
            .map((o: any) => o.created_at)
            .sort()
            .pop()
        }
      } catch {
        // Customer may have no orders
      }

      enrichedCustomers.push({
        id: customer.id,
        email: customer.email,
        name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        total_spent: totalSpent,
        order_count: orderCount,
        last_order_date: lastOrderDate,
      })
    }

    let filtered = enrichedCustomers

    if (criteria.min_total_spent !== undefined) {
      filtered = filtered.filter((c) => c.total_spent >= criteria.min_total_spent!)
    }
    if (criteria.max_total_spent !== undefined) {
      filtered = filtered.filter((c) => c.total_spent <= criteria.max_total_spent!)
    }
    if (criteria.min_order_count !== undefined) {
      filtered = filtered.filter((c) => c.order_count >= criteria.min_order_count!)
    }
    if (criteria.max_order_count !== undefined) {
      filtered = filtered.filter((c) => c.order_count <= criteria.max_order_count!)
    }
    if (criteria.last_order_after) {
      filtered = filtered.filter((c) => c.last_order_date && c.last_order_date >= criteria.last_order_after!)
    }
    if (criteria.last_order_before) {
      filtered = filtered.filter((c) => c.last_order_date && c.last_order_date <= criteria.last_order_before!)
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

    res.json({
      preview: filtered.slice(0, 50),
      total_count: filtered.length,
    })
  } catch (error) {
    console.error("Segment preview failed:", error)
    res.status(500).json({ error: "Segment preview failed" })
  }
}
