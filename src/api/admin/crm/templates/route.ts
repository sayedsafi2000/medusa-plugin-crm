import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { category, limit = 50, offset = 0 } = req.query

  try {
    const filters = category ? { category } : {}
    const templates = await crm.listCrmEmailTemplate({
      filters,
      skip: Number(offset),
      take: Number(limit),
    })

    res.json({
      templates,
      count: templates.length,
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
  const { name, subject, body, category, variables, is_default } = req.body as any

  try {
    if (!name || !subject || !body) {
      return res.status(400).json({ error: "name, subject, and body are required" })
    }

    const template = await crm.createCrmEmailTemplate({
      name,
      subject,
      body,
      category,
      variables,
      is_default: is_default || false,
    })

    res.status(201).json(template)
  } catch (error) {
    res.status(400).json({ error: (error as any).message })
  }
}
