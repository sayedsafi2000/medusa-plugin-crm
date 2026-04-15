import { Container, Heading, Text, Button, Input, Label } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
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
  const [showForm, setShowForm] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const url = customerId
          ? `/admin/crm/notes?customer_id=${customerId}`
          : `/admin/crm/notes`
        const response = await fetch(url)
        const data = await response.json() as { notes?: Note[] }
        setNotes(data.notes || [])
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [customerId])

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    if (!customerId) {
      alert("Please access this page from a customer's detail page")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
          note: newNote,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { note?: Note }
      if (data.note) {
        setNotes([data.note, ...notes])
        setNewNote("")
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add note:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/admin/crm/notes/${noteId}`, {
        method: "DELETE",
      })
      setNotes(notes.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Customer Notes</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Add Note"}
        </Button>
      </div>
      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            {!customerId && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <Text className="text-sm text-yellow-800">
                  Please access this page from a customer's detail page to add notes.
                </Text>
              </div>
            )}
            <div>
              <Label>Note</Label>
              <textarea
                value={newNote}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                className="w-full min-h-[100px] p-2 border rounded-md"
                disabled={!customerId}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNote} disabled={submitting || !customerId}>
                {submitting ? "Adding..." : "Add Note"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {notes.length === 0 ? (
        <Text>No notes found</Text>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="p-4 border rounded-lg relative">
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X />
              </button>
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
