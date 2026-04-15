import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { limit = 50, offset = 0 } = req.query

  try {
    const campaigns = await crm.listCrmCampaign({
      skip: Number(offset),
      take: Number(limit),
    })

    res.json({
      campaigns,
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
    const campaign = await crm.createCrmCampaign(req.body)
    res.status(201).json(campaign)
  } catch (error) {
    res.status(400).json({ error: (error as any).message })
  }
}
