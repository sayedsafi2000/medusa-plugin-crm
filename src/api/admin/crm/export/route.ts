import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

function convertToCSV(data: any[], headers: string[]): string {
  const headerLine = headers.join(",")
  const dataLines = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header]
        if (value === null || value === undefined) return ""
        if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(",")
  )
  return [headerLine, ...dataLines].join("\n")
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { type = "customer" } = req.query

  try {
    if (!["customer", "lead"].includes(type as string)) {
      return res.status(400).json({ error: "type must be 'customer' or 'lead'" })
    }

    let data: any[] = []
    let headers: string[] = []

    if (type === "customer") {
      data = await crm.listCrmCustomer({ take: 10000 })
      headers = ["id", "medusa_customer_id", "email", "phone", "name", "created_at", "updated_at"]
    } else if (type === "lead") {
      data = await crm.listCrmLead({ take: 10000 })
      headers = ["id", "email", "phone", "name", "title", "company", "status", "created_at", "updated_at"]
    }

    const csv = convertToCSV(data, headers)

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="${type}s_export_${Date.now()}.csv"`)
    res.send(csv)
  } catch (error) {
    res.status(400).json({ error: (error as any).message })
  }
}
