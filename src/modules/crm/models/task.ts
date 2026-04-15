class CrmTask {
  declare id: string
  declare customer_id: string | null
  declare lead_id: string | null
  declare title: string
  declare description: string | null
  declare status: "todo" | "in_progress" | "completed" | "cancelled"
  declare priority: "low" | "normal" | "high"
  declare due_date: Date | null
  declare assigned_to: string | null
  declare created_at: Date
  declare updated_at: Date
}

export default CrmTask

