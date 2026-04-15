import React, { useState, useEffect } from "react"
import { Button, Input, Text, Heading } from "@medusajs/ui"

export const CustomerNotesPanel: React.FC<{ customerId: string }> = ({ customerId }) => {
  const [notes, setNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [customerId])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/admin/crm/notes?customer_id=${customerId}`)
      const data = await response.json()
      setNotes(data.notes || [])
    } catch (error) {
      console.error("Failed to fetch notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      const response = await fetch("/admin/crm/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          content: newNote,
        }),
      })

      if (response.ok) {
        setNewNote("")
        await fetchNotes()
      }
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <Heading level="h3" className="mb-4">
        Customer Notes
      </Heading>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddNote} disabled={loading}>
          Add Note
        </Button>
      </div>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <Text className="text-gray-500">No notes yet</Text>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 rounded border">
              <p className="text-sm">{note.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(note.created_at).toLocaleDateString()}
                {note.created_by ? ` by ${note.created_by}` : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CustomerNotesPanel
