import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { customer_id, limit = 50, offset = 0 } = req.query

  try {
    if (!customer_id) {
      return res.status(400).json({ error: "customer_id is required" })
    }

    const notes = await crm.listCrmCustomerNote({
      filters: { customer_id },
      skip: Number(offset),
      take: Number(limit),
      orderBy: { created_at: "DESC" },
    })

    res.json({
      notes,
      count: notes.length,
      limit,
      offset,
    })
  } catch (error) {
    res.status(500).json({ error: (error as any).message })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { customer_id, content, created_by } = req.body as any

  try {
    if (!customer_id || !content) {
      return res.status(400).json({ error: "customer_id and content are required" })
    }

    const note = await crm.createCrmCustomerNote({
      customer_id,
      content,
      created_by,
    })

    res.status(201).json(note)
  } catch (error) {
    res.status(400).json({ error: (error as any).message })
  }
}
