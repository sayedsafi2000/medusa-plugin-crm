class CrmCustomer {
  declare id: string
  declare medusa_customer_id: string
  declare email: string
  declare phone: string | null
  declare name: string | null
  declare metadata: Record<string, any> | null
  declare created_at: Date
  declare updated_at: Date
}

export default CrmCustomer

