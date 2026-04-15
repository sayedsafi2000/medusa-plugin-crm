import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { source, status, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (source) filters.source = source
  if (status) filters.status = status

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [errors, count] = await crmService.listAndCountErrorLogs(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ error_logs: errors, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const data = req.validatedBody || req.body
  const errorLog = await crmService.createErrorLogs(data)
  res.json({ error_log: errorLog })
}
