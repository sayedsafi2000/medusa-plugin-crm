class CrmCustomer {
id: string
medusa_customer_id: string
email: string
phone: string | null
name: string | null
metadata: Record<string, any> | null
created_at: Date
updated_at: Date
}

export default CrmCustomer

