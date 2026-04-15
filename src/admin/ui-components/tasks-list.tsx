import { Container, Heading, Text, Button, Badge, Input, Label, Select } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Task = {
  id: string
  customer_id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  due_date?: string
  assigned_to?: string
  created_by: string
  created_at: string
}

const statusColors = {
  pending: "grey",
  in_progress: "blue",
  completed: "green",
  cancelled: "red",
} as const

const priorityColors = {
  low: "grey",
  medium: "orange",
  high: "red",
} as const

type Customer = {
  id: string
  email: string
  first_name?: string
  last_name?: string
}

export const TasksList = ({ customerId }: { customerId?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(customerId)
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([])
  const [searchingCustomers, setSearchingCustomers] = useState(false)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    due_date: "",
    assigned_to: "",
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = selectedCustomerId
          ? `/admin/crm/tasks?customer_id=${selectedCustomerId}`
          : `/admin/crm/tasks`
        const response = await fetch(url)
        const data = await response.json() as { tasks?: Task[] }
        setTasks(data.tasks || [])
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [selectedCustomerId])

  const searchCustomersByEmail = async (email: string) => {
    if (!email || email.length < 2) {
      setCustomerSearchResults([])
      setShowCustomerDropdown(false)
      return
    }

    setSearchingCustomers(true)
    try {
      const response = await fetch(`/admin/customers?q=${email}`)
      const data = await response.json() as { customers?: Customer[] }
      setCustomerSearchResults(data.customers || [])
      setShowCustomerDropdown(true)
    } catch (error) {
      console.error("Failed to search customers:", error)
      setCustomerSearchResults([])
    } finally {
      setSearchingCustomers(false)
    }
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setSelectedCustomerId(customer.id)
    setCustomerEmail(`${customer.email}${customer.first_name ? ` (${customer.first_name} ${customer.last_name || ""})` : ""}`)
    setShowCustomerDropdown(false)
    setCustomerSearchResults([])
  }

  const handleClearCustomer = () => {
    setSelectedCustomer(null)
    setSelectedCustomerId(undefined)
    setCustomerEmail("")
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return
    if (!selectedCustomerId) {
      alert("Please select a customer to add a task")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTask,
          customer_id: selectedCustomerId,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { task?: Task }
      if (data.task) {
        setTasks([data.task, ...tasks])
        setNewTask({
          title: "",
          description: "",
          status: "pending",
          priority: "medium",
          due_date: "",
          assigned_to: "",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add task:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: Task["status"]) => {
    try {
      const response = await fetch(`/admin/crm/tasks/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json() as { task?: Task }
      if (data.task) {
        setTasks(tasks.map((task) => (task.id === taskId ? data.task! : task)))
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await fetch(`/admin/crm/tasks/${taskId}`, {
        method: "DELETE",
      })
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Customer Tasks</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Add Task"}
        </Button>
      </div>

      {!customerId && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <Label className="mb-2">Select Customer by Email</Label>
          <div className="relative">
            <Input
              value={customerEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomerEmail(e.target.value)
                searchCustomersByEmail(e.target.value)
              }}
              placeholder="Search customer by email..."
              className="pr-10"
            />
            {customerEmail && (
              <button
                onClick={handleClearCustomer}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
            )}
          </div>
          {showCustomerDropdown && customerSearchResults.length > 0 && (
            <div className="mt-2 border rounded-md bg-white max-h-60 overflow-y-auto">
              {customerSearchResults.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <Text className="font-medium">{customer.email}</Text>
                  {customer.first_name && (
                    <Text className="text-sm text-gray-500">
                      {customer.first_name} {customer.last_name || ""}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          )}
          {searchingCustomers && (
            <Text className="text-sm text-gray-500 mt-2">Searching...</Text>
          )}
          {selectedCustomer && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
              <Text className="text-sm">
                Selected: {selectedCustomer.email}
                {selectedCustomer.first_name && ` (${selectedCustomer.first_name} ${selectedCustomer.last_name || ""})`}
              </Text>
              <Button variant="transparent" size="small" onClick={handleClearCustomer}>
                <X />
              </Button>
            </div>
          )}
        </div>
      )}
      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            {!selectedCustomerId && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <Text className="text-sm text-yellow-800">
                  Please select a customer by email above to add tasks.
                </Text>
              </div>
            )}
            <div>
              <Label>Title *</Label>
              <Input
                value={newTask.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                disabled={!selectedCustomerId}
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={newTask.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description..."
                className="w-full min-h-[80px] p-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="pending">Pending</Select.Item>
                    <Select.Item value="in_progress">In Progress</Select.Item>
                    <Select.Item value="completed">Completed</Select.Item>
                    <Select.Item value="cancelled">Cancelled</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="low">Low</Select.Item>
                    <Select.Item value="medium">Medium</Select.Item>
                    <Select.Item value="high">High</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date</Label>
                <Input
                  type="datetime-local"
                  value={newTask.due_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input
                  value={newTask.assigned_to}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  placeholder="Assignee"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTask} disabled={submitting}>
                {submitting ? "Adding..." : "Add Task"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {tasks.length === 0 ? (
        <Text>No tasks found</Text>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg relative">
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X />
              </button>
              <div className="flex justify-between items-start pr-8">
                <div>
                  <Heading level="h3">{task.title}</Heading>
                  {task.description && (
                    <Text className="mt-2">{task.description}</Text>
                  )}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleUpdateTaskStatus(task.id, value as Task["status"])}
                  >
                    <Select.Trigger className="w-[120px]">
                      <Badge color={statusColors[task.status]}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="pending">Pending</Select.Item>
                      <Select.Item value="in_progress">In Progress</Select.Item>
                      <Select.Item value="completed">Completed</Select.Item>
                      <Select.Item value="cancelled">Cancelled</Select.Item>
                    </Select.Content>
                  </Select>
                  <Badge color={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              {task.due_date && (
                <Text className="text-sm text-gray-500 mt-2">
                  Due: {new Date(task.due_date).toLocaleString()}
                </Text>
              )}
              {task.assigned_to && (
                <Text className="text-sm text-gray-500">
                  Assigned to: {task.assigned_to}
                </Text>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
