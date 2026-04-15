import { Container, Heading, Text, Button, Badge, Input, Label } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Tag = {
  id: string
  name: string
  color: string | null
  customer_count: number
  created_by: string
  created_at: string
}

export const TagsList = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newTag, setNewTag] = useState({
    name: "",
    color: "#6366f1",
  })

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/admin/crm/tags")
        const data = await response.json() as { tags?: Tag[] }
        setTags(data.tags || [])
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleAddTag = async () => {
    if (!newTag.name.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTag.name,
          color: newTag.color,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { tag?: Tag }
      if (data.tag) {
        setTags([data.tag, ...tags])
        setNewTag({ name: "", color: "#6366f1" })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add tag:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      await fetch(`/admin/crm/tags/${tagId}`, {
        method: "DELETE",
      })
      setTags(tags.filter((t) => t.id !== tagId))
    } catch (error) {
      console.error("Failed to delete tag:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Customer Tags</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Create Tag"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tag Name *</Label>
                <Input
                  value={newTag.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="VIP"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTag.color || "#6366f1"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag({ ...newTag, color: e.target.value })}
                    className="h-8 w-8 border rounded cursor-pointer"
                  />
                  <Input
                    value={newTag.color || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag({ ...newTag, color: e.target.value })}
                    placeholder="#6366f1"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTag} disabled={submitting}>
                {submitting ? "Creating..." : "Create Tag"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {tags.length === 0 ? (
        <Text>No tags found</Text>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="relative group inline-flex items-center gap-2 px-3 py-2 border rounded-lg"
              style={{ borderColor: tag.color || undefined }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.color || "#6366f1" }}
              />
              <Text className="font-medium">{tag.name}</Text>
              <Badge size="small" color="grey">{tag.customer_count}</Badge>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
