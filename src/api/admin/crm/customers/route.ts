import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { 
    search,
    email,
    phone,
    limit = 50, 
    offset = 0 
  } = req.query

  try {
    const filters: any = {}
    
    // Build filters for search
    if (email) filters.email = email
    if (phone) filters.phone = phone
    if (search) {
      // Search by name or email (will need to be handled in service)
      filters.$or = [
        { name: { $ilike: `%${search}%` } },
        { email: { $ilike: `%${search}%` } },
      ]
    }

    const customers = await crm.listCrmCustomer({
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      skip: Number(offset),
      take: Number(limit),
      orderBy: { created_at: "DESC" },
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

