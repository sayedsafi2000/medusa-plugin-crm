import { Container, Heading, Text, Button, Badge, Input, Label } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Segment = {
  id: string
  name: string
  description: string | null
  criteria: Record<string, any>
  customer_count: number
  created_by: string
  created_at: string
}

export const SegmentsList = () => {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    criteria_field: "",
    criteria_operator: "eq",
    criteria_value: "",
  })

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await fetch("/admin/crm/segments")
        const data = await response.json() as { segments?: Segment[] }
        setSegments(data.segments || [])
      } catch (error) {
        console.error("Failed to fetch segments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSegments()
  }, [])

  const handleAddSegment = async () => {
    if (!newSegment.name.trim() || !newSegment.criteria_field.trim()) return

    setSubmitting(true)
    try {
      const criteria = {
        rules: [
          {
            field: newSegment.criteria_field,
            operator: newSegment.criteria_operator,
            value: newSegment.criteria_value,
          },
        ],
        conjunction: "and",
      }

      const response = await fetch("/admin/crm/segments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSegment.name,
          description: newSegment.description || null,
          criteria,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { segment?: Segment }
      if (data.segment) {
        setSegments([data.segment, ...segments])
        setNewSegment({
          name: "",
          description: "",
          criteria_field: "",
          criteria_operator: "eq",
          criteria_value: "",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add segment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSegment = async (segmentId: string) => {
    try {
      await fetch(`/admin/crm/segments/${segmentId}`, {
        method: "DELETE",
      })
      setSegments(segments.filter((s) => s.id !== segmentId))
    } catch (error) {
      console.error("Failed to delete segment:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Customer Segments</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Create Segment"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <Label>Segment Name *</Label>
              <Input
                value={newSegment.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSegment({ ...newSegment, name: e.target.value })}
                placeholder="High Value Customers"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={newSegment.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewSegment({ ...newSegment, description: e.target.value })}
                placeholder="Segment description..."
                className="w-full min-h-[80px] p-2 border rounded-md"
              />
            </div>
            <div className="p-3 border rounded-md bg-white">
              <Text className="font-medium mb-2">Criteria Rule</Text>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Field *</Label>
                  <Input
                    value={newSegment.criteria_field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSegment({ ...newSegment, criteria_field: e.target.value })}
                    placeholder="total_spent"
                  />
                </div>
                <div>
                  <Label>Operator</Label>
                  <select
                    value={newSegment.criteria_operator}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewSegment({ ...newSegment, criteria_operator: e.target.value })}
                    className="w-full h-8 border rounded-md px-2 text-sm"
                  >
                    <option value="eq">Equals</option>
                    <option value="neq">Not Equals</option>
                    <option value="gt">Greater Than</option>
                    <option value="gte">Greater or Equal</option>
                    <option value="lt">Less Than</option>
                    <option value="lte">Less or Equal</option>
                    <option value="contains">Contains</option>
                  </select>
                </div>
                <div>
                  <Label>Value</Label>
                  <Input
                    value={newSegment.criteria_value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSegment({ ...newSegment, criteria_value: e.target.value })}
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddSegment} disabled={submitting}>
                {submitting ? "Creating..." : "Create Segment"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {segments.length === 0 ? (
        <Text>No segments found</Text>
      ) : (
        <div className="space-y-4">
          {segments.map((segment) => (
            <div key={segment.id} className="p-4 border rounded-lg relative">
              <button
                onClick={() => handleDeleteSegment(segment.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X />
              </button>
              <div className="flex items-center gap-2 mb-2 pr-8">
                <Heading level="h3">{segment.name}</Heading>
                <Badge color="blue">{segment.customer_count} customers</Badge>
              </div>
              {segment.description && (
                <Text className="text-sm text-gray-600 mb-2">{segment.description}</Text>
              )}
              <div className="p-3 bg-gray-50 rounded-md mt-2">
                <Text className="text-xs text-gray-500 font-medium mb-1">Criteria</Text>
                <Text className="text-sm">
                  {segment.criteria?.rules
                    ? (segment.criteria.rules as Array<{ field: string; operator: string; value: string }>)
                        .map((r: { field: string; operator: string; value: string }) => `${r.field} ${r.operator} ${r.value}`)
                        .join(` ${segment.criteria.conjunction || "and"} `)
                    : JSON.stringify(segment.criteria)}
                </Text>
              </div>
              <Text className="text-sm text-gray-500 mt-2">
                Created: {new Date(segment.created_at).toLocaleDateString()} by {segment.created_by}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
