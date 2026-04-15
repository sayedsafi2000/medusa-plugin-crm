import React, { useState } from "react"
import { Button, Select, Textarea, Text, Heading } from "@medusajs/ui"

export const BulkImportExportPanel: React.FC = () => {
  const [importType, setImportType] = useState("customer")
  const [importData, setImportData] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImport = async () => {
    if (!importData.trim()) {
      alert("Please paste JSON data")
      return
    }

    try {
      setLoading(true)
      const data = JSON.parse(importData)
      const response = await fetch("/admin/crm/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: importType,
          data: Array.isArray(data) ? data : [data],
        }),
      })

      const result = await response.json()
      setResult(result)
      setImportData("")
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/admin/crm/export?type=${importType}`)
      const csv = await response.text()

      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${importType}s_export_${Date.now()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert(`Export failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      <Heading level="h3" className="mb-4">
        Bulk Import/Export
      </Heading>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <Select
            value={importType}
            onChange={(e) => setImportType(e.target.value)}
          >
            <option value="customer">Customers</option>
            <option value="lead">Leads</option>
          </Select>
        </div>

        <div>
          <Heading level="h4" className="mb-2">Export Data</Heading>
          <Button 
            onClick={handleExport} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Exporting..." : "Download as CSV"}
          </Button>
        </div>

        <div>
          <Heading level="h4" className="mb-2">Import Data</Heading>
          <Text className="text-sm text-gray-600 mb-2">
            Paste JSON array of objects (one per line or as array)
          </Text>
          <Textarea
            placeholder={`[{"email": "user@example.com", "name": "John Doe"}, ...]`}
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            rows={6}
          />
          <Button
            onClick={handleImport}
            disabled={loading || !importData.trim()}
            className="w-full mt-2"
          >
            {loading ? "Importing..." : "Import Data"}
          </Button>
        </div>

        {result && (
          <div className={`p-3 rounded ${result.success > 0 ? "bg-green-50" : "bg-red-50"}`}>
            <Text className="font-semibold">{result.message}</Text>
            {result.errors && result.errors.length > 0 && (
              <div className="mt-2">
                <Text className="text-sm font-semibold">Errors:</Text>
                {result.errors.map((err: any, i: number) => (
                  <Text key={i} className="text-xs text-red-700">
                    Row {err.row}: {err.error}
                  </Text>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkImportExportPanel
