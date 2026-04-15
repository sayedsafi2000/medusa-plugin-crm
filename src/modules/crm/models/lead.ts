class CrmLead {
  declare id: string
  declare email: string
  declare phone: string | null
  declare name: string
  declare title: string
  declare company: string | null
  declare status: "new" | "contacted" | "qualified" | "proposal" | "closed_won" | "closed_lost"
  declare description: string | null
  declare metadata: Record<string, any> | null
  declare created_at: Date
  declare updated_at: Date
}

export default CrmLead

