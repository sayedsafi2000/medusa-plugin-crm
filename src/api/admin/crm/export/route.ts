import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCSVRow(columns: string[], row: Record<string, any>): string {
  return columns.map((col) => escapeCSV(row[col])).join(",")
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { resource, customer_id, stage, status } = req.validatedQuery || req.query

  const resourceType = (resource as string) || "customers"

  try {
    let csv = ""
    let filename = ""

    switch (resourceType) {
      case "notes": {
        const filters: Record<string, unknown> = {}
        if (customer_id) filters.customer_id = customer_id
        const notes = await crmService.listCustomerNotes(filters, { take: 10000 })
        const cols = ["id", "customer_id", "order_id", "note", "created_by", "created_at"]
        csv = cols.join(",") + "\n" + notes.map((n: any) => toCSVRow(cols, n)).join("\n")
        filename = "crm-notes.csv"
        break
      }
      case "tasks": {
        const filters: Record<string, unknown> = {}
        if (customer_id) filters.customer_id = customer_id
        if (status) filters.status = status
        const tasks = await crmService.listCustomerTasks(filters, { take: 10000 })
        const cols = ["id", "customer_id", "order_id", "title", "status", "priority", "assigned_to", "due_date", "created_at"]
        csv = cols.join(",") + "\n" + tasks.map((t: any) => toCSVRow(cols, t)).join("\n")
        filename = "crm-tasks.csv"
        break
      }
      case "leads": {
        const filters: Record<string, unknown> = {}
        if (stage) filters.stage = stage
        const leads = await crmService.listLeads(filters, { take: 10000 })
        const cols = ["id", "contact_name", "contact_email", "company", "source", "stage", "estimated_value", "probability", "assigned_to", "created_at"]
        csv = cols.join(",") + "\n" + leads.map((l: any) => toCSVRow(cols, l)).join("\n")
        filename = "crm-leads.csv"
        break
      }
      case "campaigns": {
        const filters: Record<string, unknown> = {}
        if (status) filters.status = status
        const campaigns = await crmService.listCrmCampaigns(filters, { take: 10000 })
        const cols = ["id", "name", "type", "status", "total_recipients", "sent_count", "delivered_count", "opened_count", "clicked_count", "converted_count", "failed_count", "bounced_count"]
        csv = cols.join(",") + "\n" + campaigns.map((c: any) => toCSVRow(cols, c)).join("\n")
        filename = "crm-campaigns.csv"
        break
      }
      case "activities": {
        const filters: Record<string, unknown> = {}
        if (customer_id) filters.customer_id = customer_id
        const activities = await crmService.listCustomerActivities(filters, { take: 10000 })
        const cols = ["id", "customer_id", "order_id", "activity_type", "severity", "created_at"]
        csv = cols.join(",") + "\n" + activities.map((a: any) => toCSVRow(cols, a)).join("\n")
        filename = "crm-activities.csv"
        break
      }
      case "communications": {
        const filters: Record<string, unknown> = {}
        if (customer_id) filters.customer_id = customer_id
        const logs = await crmService.listCommunicationLogs(filters, { take: 10000 })
        const cols = ["id", "customer_id", "type", "direction", "subject", "recipient", "sender", "status", "created_at"]
        csv = cols.join(",") + "\n" + logs.map((l: any) => toCSVRow(cols, l)).join("\n")
        filename = "crm-communications.csv"
        break
      }
      default:
        res.status(400).json({ error: "Invalid resource type. Use: notes, tasks, leads, campaigns, activities, communications" })
        return
    }

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.send(csv)
  } catch (error) {
    console.error("Export failed:", error)
    res.status(500).json({ error: "Export failed" })
  }
}
