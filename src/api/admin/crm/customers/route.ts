import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { limit = 50, offset = 0 } = req.query

  try {
    const customers = await crm.listCrmCustomer({
      skip: Number(offset),
      take: Number(limit),
    })

    res.json({
      customers,
      count: customers.length,
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

  try {
    const customer = await crm.createCrmCustomer(req.body)
    res.status(201).json(customer)
  } catch (error) {
    res.status(400).json({ error: (error as any).message })
  }
}

