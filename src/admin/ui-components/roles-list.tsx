import { Container, Heading, Text, Button, Badge, Input, Label } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type CrmRole = {
  id: string
  name: string
  label: string
  permissions: Record<string, string[]>
  is_default: boolean
  created_at: string
}

const permissionGroups = {
  notes: ["read", "create", "update", "delete"],
  tasks: ["read", "create", "update", "delete"],
  leads: ["read", "create", "update", "delete"],
  campaigns: ["read", "create", "update", "delete", "send"],
  automations: ["read", "create", "update", "delete", "execute"],
  segments: ["read", "create", "update", "delete"],
  tags: ["read", "create", "update", "delete"],
  communications: ["read", "create", "update", "delete"],
  analytics: ["read"],
  settings: ["read", "update"],
  export: ["read", "execute"],
  notifications: ["read", "update"],
}

export const RolesList = () => {
  const [roles, setRoles] = useState<CrmRole[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    label: "",
    permissions: {} as Record<string, string[]>,
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/admin/crm/roles")
        const data = await response.json() as { roles?: CrmRole[] }
        setRoles(data.roles || [])
      } catch (error) {
        console.error("Failed to fetch roles:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const handleAddRole = async () => {
    if (!newRole.name.trim() || !newRole.label.trim()) return
    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      })
      const data = await response.json() as { role?: CrmRole }
      if (data.role) {
        setRoles([data.role, ...roles])
        setNewRole({ name: "", label: "", permissions: {} })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add role:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      await fetch(`/admin/crm/roles/${roleId}`, { method: "DELETE" })
      setRoles(roles.filter((r) => r.id !== roleId))
    } catch (error) {
      console.error("Failed to delete role:", error)
    }
  }

  const togglePermission = (group: string, perm: string) => {
    const current = newRole.permissions[group] || []
    const updated = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm]
    setNewRole({
      ...newRole,
      permissions: { ...newRole.permissions, [group]: updated },
    })
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">CRM Roles & Permissions</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Create Role"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role Name *</Label>
                <Input
                  value={newRole.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="sales_manager"
                />
              </div>
              <div>
                <Label>Display Label *</Label>
                <Input
                  value={newRole.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRole({ ...newRole, label: e.target.value })}
                  placeholder="Sales Manager"
                />
              </div>
            </div>
            <div>
              <Text className="font-medium mb-2">Permissions</Text>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(permissionGroups).map(([group, perms]) => (
                  <div key={group} className="p-2 border rounded">
                    <Text className="font-medium text-sm capitalize mb-1">{group}</Text>
                    <div className="flex flex-wrap gap-1">
                      {perms.map((perm) => (
                        <button
                          key={`${group}-${perm}`}
                          className={`px-2 py-0.5 text-xs rounded border ${
                            (newRole.permissions[group] || []).includes(perm)
                              ? "bg-blue-100 border-blue-400 text-blue-700"
                              : "bg-gray-50 border-gray-300 text-gray-500"
                          }`}
                          onClick={() => togglePermission(group, perm)}
                        >
                          {perm}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRole} disabled={submitting}>
                {submitting ? "Creating..." : "Create Role"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {roles.length === 0 ? (
        <Text>No roles defined</Text>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="p-3 border rounded-lg relative">
              {!role.is_default && (
                <button onClick={() => handleDeleteRole(role.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <X />
                </button>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Heading level="h3">{role.label}</Heading>
                <Badge color="grey">{role.name}</Badge>
                {role.is_default && <Badge color="blue">Default</Badge>}
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(role.permissions || {}).map(([group, perms]) => (
                  perms.length > 0 && (
                    <Badge key={group} color="purple" size="small">
                      {group}: {perms.join(", ")}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
