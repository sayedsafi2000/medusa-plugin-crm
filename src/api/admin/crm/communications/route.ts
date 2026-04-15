import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { limit = 100, offset = 0 } = req.query

  try {
    const logs = await crm.listCrmCommunicationLog({
      skip: Number(offset),
      take: Number(limit),
    })

    res.json({
      logs,
      limit,
      offset,
    })
  } catch (error) {
    res.status(500).json({ error: (error as any).message })
  }
}
