import { Container, Heading, Text, Button } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Note = {
  id: string
  customer_id: string
  note: string
  created_by: string
  created_at: string
}

export const NotesList = ({ customerId }: { customerId?: string }) => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const url = customerId
          ? `/admin/crm/notes?customer_id=${customerId}`
          : `/admin/crm/notes`
        const response = await fetch(url)
        const data = await response.json()
        setNotes(data.notes || [])
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [customerId])

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Customer Notes</Heading>
        <Button>
          <Plus /> Add Note
        </Button>
      </div>
      {notes.length === 0 ? (
        <Text>No notes found</Text>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-4 border rounded-lg">
              <Text className="text-sm text-gray-500">
                {new Date(note.created_at).toLocaleString()}
              </Text>
              <Text className="mt-2">{note.note}</Text>
              <Text className="text-sm text-gray-500 mt-2">
                By: {note.created_by}
              </Text>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
