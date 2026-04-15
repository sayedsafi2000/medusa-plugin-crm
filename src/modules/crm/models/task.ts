class CrmTask {
id: string
customer_id: string | null
lead_id: string | null
title: string
description: string | null
status: "todo" | "in_progress" | "completed" | "cancelled"
priority: "low" | "normal" | "high"
due_date: Date | null
assigned_to: string | null
created_at: Date
updated_at: Date
}

export default CrmTask

