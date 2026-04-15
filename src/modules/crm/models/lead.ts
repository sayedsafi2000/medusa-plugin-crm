class CrmLead {
id: string
email: string
phone: string | null
name: string
title: string
company: string | null
status: "new" | "contacted" | "qualified" | "proposal" | "closed_won" | "closed_lost"
description: string | null
metadata: Record<string, any> | null
created_at: Date
updated_at: Date
}

export default CrmLead

