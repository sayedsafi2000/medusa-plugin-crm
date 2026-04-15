import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { RefreshCw, Trash } from "lucide-react"
import { useEffect, useState } from "react"

type ErrorLog = {
  id: string
  source: string
  error_code: string | null
  error_message: string
  stack_trace: string | null
  reference_type: string | null
  reference_id: string | null
  retry_count: number
  max_retries: number
  status: "pending" | "retrying" | "resolved" | "failed"
  created_at: string
}

const statusColors = {
  pending: "orange",
  retrying: "blue",
  resolved: "green",
  failed: "red",
} as const

const sourceColors: Record<string, "blue" | "orange" | "purple" | "green" | "red" | "grey"> = {
  api: "blue",
  workflow: "purple",
  automation: "orange",
  campaign: "green",
  notification: "blue",
  job: "orange",
  export: "grey",
  subscriber: "red",
  other: "grey",
}

export const ErrorLogsList = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const fetchErrors = async (newOffset = 0) => {
    try {
      const response = await fetch(`/admin/crm/error-logs?limit=${limit}&offset=${newOffset}`)
      const data = await response.json() as { error_logs?: ErrorLog[]; count?: number }
      setErrors(data.error_logs || [])
      setCount(data.count || 0)
      setOffset(newOffset)
    } catch (error) {
      console.error("Failed to fetch error logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchErrors() }, [])

  const handleRetry = async (id: string) => {
    try {
      await fetch(`/admin/crm/error-logs/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "retrying" }),
      })
      fetchErrors(offset)
    } catch (error) {
      console.error("Failed to update error log:", error)
    }
  }

  const handleResolve = async (id: string) => {
    try {
      await fetch(`/admin/crm/error-logs/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved", resolved_at: new Date().toISOString() }),
      })
      fetchErrors(offset)
    } catch (error) {
      console.error("Failed to resolve error log:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/admin/crm/error-logs/${id}`, { method: "DELETE" })
      fetchErrors(offset)
    } catch (error) {
      console.error("Failed to delete error log:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Error Logs</Heading>
        <Badge color="red">{count} total</Badge>
      </div>

      {errors.length === 0 ? (
        <Text>No errors logged</Text>
      ) : (
        <div className="space-y-3">
          {errors.map((err) => (
            <div key={err.id} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge color={sourceColors[err.source] || "grey"} size="small">{err.source}</Badge>
                <Badge color={statusColors[err.status]} size="small">{err.status}</Badge>
                {err.error_code && <Badge size="small">{err.error_code}</Badge>}
              </div>
              <Text className="text-sm font-medium">{err.error_message}</Text>
              {err.reference_type && err.reference_id && (
                <Text className="text-xs text-gray-500 mt-1">
                  Ref: {err.reference_type}/{err.reference_id}
                </Text>
              )}
              {err.retry_count > 0 && (
                <Text className="text-xs text-gray-500">
                  Retries: {err.retry_count}/{err.max_retries}
                </Text>
              )}
              <div className="flex justify-between items-center mt-2">
                <Text className="text-xs text-gray-400">
                  {new Date(err.created_at).toLocaleString()}
                </Text>
                <div className="flex gap-1">
                  {err.status === "pending" || err.status === "retrying" ? (
                    <>
                      <Button variant="transparent" size="small" onClick={() => handleRetry(err.id)}>
                        <RefreshCw size={14} /> Retry
                      </Button>
                      <Button variant="transparent" size="small" onClick={() => handleResolve(err.id)}>
                        Resolve
                      </Button>
                    </>
                  ) : null}
                  <Button variant="transparent" size="small" onClick={() => handleDelete(err.id)}>
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {count > limit && (
        <div className="flex justify-between items-center mt-4">
          <Button variant="secondary" size="small" disabled={offset === 0} onClick={() => fetchErrors(offset - limit)}>
            Previous
          </Button>
          <Text className="text-sm text-gray-500">{offset + 1}-{Math.min(offset + limit, count)} of {count}</Text>
          <Button variant="secondary" size="small" disabled={offset + limit >= count} onClick={() => fetchErrors(offset + limit)}>
            Next
          </Button>
        </div>
      )}
    </Container>
  )
}
