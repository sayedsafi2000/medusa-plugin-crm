import React, { useState, useEffect } from "react"
import { Button, Input, Textarea, Select, Text, Heading } from "@medusajs/ui"

export const EmailTemplatesPanel: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    category: "general",
    variables: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("/admin/crm/templates")
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!formData.name || !formData.subject || !formData.body) {
      alert("Please fill all required fields")
      return
    }

    try {
      const response = await fetch("/admin/crm/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          variables: formData.variables
            ? formData.variables.split(",").map((v) => v.trim())
            : undefined,
        }),
      })

      if (response.ok) {
        setFormData({ name: "", subject: "", body: "", category: "general", variables: "" })
        setShowForm(false)
        await fetchTemplates()
      }
    } catch (error) {
      console.error("Failed to create template:", error)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Heading level="h3">Email Templates</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Template"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <Input
            placeholder="Template Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Email Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <Textarea
            placeholder="Email Body (supports HTML)"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows={6}
          />
          <Input
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <Input
            placeholder="Variables (comma-separated, e.g. {{name}}, {{email}})"
            value={formData.variables}
            onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
          />
          <Button onClick={handleCreateTemplate}>Create Template</Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {templates.length === 0 ? (
          <Text className="text-gray-500">No templates yet</Text>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="p-3 border rounded bg-white">
              <div className="font-semibold text-sm">{template.name}</div>
              <div className="text-sm text-gray-600">{template.subject}</div>
              {template.category && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                  {template.category}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EmailTemplatesPanel
