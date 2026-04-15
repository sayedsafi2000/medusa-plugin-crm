class CrmEmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category?: string
  variables?: string[]
  is_default?: boolean
  created_at: Date
  updated_at: Date
}

export default CrmEmailTemplate
