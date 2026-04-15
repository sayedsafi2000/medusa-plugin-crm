import { Container, Heading, Text, Button, Input, Label, Select, Badge } from "@medusajs/ui"
import { Save, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"

type Setting = {
  key: string
  value: any
  category: string
  description: string | null
  is_secret: boolean
}

const categories = [
  { value: "api", label: "API Keys" },
  { value: "campaign", label: "Campaign Defaults" },
  { value: "automation", label: "Automation Defaults" },
  { value: "notification", label: "Notification Settings" },
  { value: "general", label: "General" },
]

const defaultSettings: Record<string, Partial<Setting>> = {
  "whatsapp_api_key": { category: "api", description: "WhatsApp Business API Key", is_secret: true },
  "email_api_key": { category: "api", description: "Email Service API Key", is_secret: true },
  "sms_api_key": { category: "api", description: "SMS Service API Key", is_secret: true },
  "default_campaign_type": { category: "campaign", description: "Default campaign channel", is_secret: false },
  "default_automation_status": { category: "automation", description: "Default automation status", is_secret: false },
  "high_value_threshold": { category: "notification", description: "Order amount threshold for high-value notifications", is_secret: false },
  "notification_email": { category: "notification", description: "Email for admin notifications", is_secret: false },
  "abandoned_cart_delay_hours": { category: "automation", description: "Hours before sending abandoned cart reminder", is_secret: false },
}

export const SettingsPanel = () => {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [rawSettings, setRawSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("api")
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/admin/crm/settings")
        const data = await response.json() as { raw?: Setting[] }
        setRawSettings(data.raw || [])
        const map: Record<string, any> = {}
        for (const s of data.raw || []) {
          map[s.key] = s.value
        }
        setSettings(map)
        setEditValues(
          Object.fromEntries(
            Object.entries(map).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
          )
        )
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async (key: string) => {
    setSaving({ ...saving, [key]: true })
    try {
      const meta = defaultSettings[key] || { category: "general", description: "", is_secret: false }
      const value = editValues[key]

      await fetch("/admin/crm/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: meta.is_secret ? value : tryParseJSON(value),
          category: meta.category || "general",
          description: meta.description || null,
          is_secret: meta.is_secret || false,
        }),
      })

      setSettings({ ...settings, [key]: value })
    } catch (error) {
      console.error("Failed to save setting:", error)
    } finally {
      setSaving({ ...saving, [key]: false })
    }
  }

  const tryParseJSON = (str: string): any => {
    try { return JSON.parse(str) } catch { return str }
  }

  if (loading) return <div>Loading...</div>

  const categorySettings = Object.entries(defaultSettings).filter(
    ([, meta]) => meta.category === activeCategory
  )

  return (
    <Container>
      <Heading level="h2" className="mb-4">CRM Settings</Heading>

      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "primary" : "secondary"}
            size="small"
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {categorySettings.map(([key, meta]) => {
          const isSecret = meta.is_secret || false
          const showSecret = showSecrets[key] || false
          const currentValue = editValues[key] || ""

          return (
            <div key={key} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Label className="font-medium">{key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
                {isSecret && <Badge color="orange" size="small">Secret</Badge>}
              </div>
              {meta.description && (
                <Text className="text-sm text-gray-500 mb-2">{meta.description}</Text>
              )}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={isSecret && !showSecret ? "password" : "text"}
                    value={currentValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditValues({ ...editValues, [key]: e.target.value })
                    }
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  />
                  {isSecret && (
                    <button
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowSecrets({ ...showSecrets, [key]: !showSecret })}
                    >
                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleSave(key)}
                  disabled={saving[key]}
                >
                  <Save size={16} /> {saving[key] ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )
        })}

        {categorySettings.length === 0 && (
          <Text className="text-gray-400">No settings in this category</Text>
        )}
      </div>
    </Container>
  )
}
