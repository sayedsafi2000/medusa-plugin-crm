import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const { type, data } = req.body as any

  try {
    if (!type || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "type and data array are required" })
    }

    if (!["customer", "lead"].includes(type)) {
      return res.status(400).json({ error: "type must be 'customer' or 'lead'" })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
      created: [] as any[],
    }

    for (let i = 0; i < data.length; i++) {
      try {
        let record
        if (type === "customer") {
          record = await crm.createCrmCustomer({
            medusa_customer_id: data[i].medusa_customer_id || `import_${Date.now()}_${i}`,
            email: data[i].email,
            phone: data[i].phone,
            name: data[i].name,
            metadata: data[i].metadata,
          })
        } else if (type === "lead") {
          record = await crm.createCrmLead({
            email: data[i].email,
            phone: data[i].phone,
            name: data[i].name,
            title: data[i].title,
            company: data[i].company,
            status: data[i].status || "new",
            description: data[i].description,
            metadata: data[i].metadata,
          })
        }

        results.success++
        results.created.push(record)
      } catch (error: any) {
        results.failed++
        results.errors.push({
          row: i + 1,
          error: error.message,
          data: data[i],
        })
      }
    }

    res.json({
      message: `Bulk import completed: ${results.success} succeeded, ${results.failed} failed`,
      ...results,
    })
  } catch (error) {
    res.status(400).json({ error: (error as any).message })
  }
}
