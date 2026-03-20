import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { NavHeader, Button, Input, Select, SettingsGroup, SegmentedControl, StatGrid, Divider, Card, AppShell } from "even-toolkit/web"
import { downloadJson, validateImportedRecipes } from "../utils/export"
import { AI_PROVIDERS, APP_LANGUAGES, type AIProvider, type AppLanguage } from "../types/recipe"
import { useTranslation } from "../hooks/useTranslation"

export function Settings() {
  const navigate = useNavigate()
  const { recipes, categories, settings, setSettings, importRecipes, resetToDefaults } =
    useRecipeContext()

  const { t } = useTranslation()
  const [language, setLanguage] = useState<AppLanguage>(settings.language)
  const [provider, setProvider] = useState<AIProvider>(settings.aiProvider)
  const [model, setModel] = useState(settings.aiModel)
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey)
  const [anthropicKey, setAnthropicKey] = useState(settings.anthropicApiKey)
  const [deepseekKey, setDeepseekKey] = useState(settings.deepseekApiKey)
  const [showKey, setShowKey] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const providerConfig = AI_PROVIDERS.find((p) => p.id === provider)!

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider)
    const config = AI_PROVIDERS.find((p) => p.id === newProvider)!
    const newModel = config.models[0].id
    setModel(newModel)
    setSettings({ ...settings, aiProvider: newProvider, aiModel: newModel })
  }

  const currentKey = provider === 'openai' ? openaiKey : provider === 'anthropic' ? anthropicKey : deepseekKey
  const setCurrentKey = (value: string) => {
    if (provider === 'openai') setOpenaiKey(value)
    else if (provider === 'anthropic') setAnthropicKey(value)
    else setDeepseekKey(value)
  }

  const handleSave = () => {
    setSettings({
      language,
      aiProvider: provider,
      aiModel: model,
      openaiApiKey: openaiKey,
      anthropicApiKey: anthropicKey,
      deepseekApiKey: deepseekKey,
    })
  }

  const hasChanges =
    language !== settings.language ||
    provider !== settings.aiProvider ||
    model !== settings.aiModel ||
    openaiKey !== settings.openaiApiKey ||
    anthropicKey !== settings.anthropicApiKey ||
    deepseekKey !== settings.deepseekApiKey

  const handleExport = () => {
    downloadJson(recipes, `even-kitchen-recipes-${Date.now()}.json`)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        const validated = validateImportedRecipes(data)
        if (validated) {
          importRecipes(validated)
          setImportStatus(`Imported ${validated.length} recipe(s)`)
        } else {
          setImportStatus("Invalid recipe file format")
        }
      } catch {
        setImportStatus("Failed to parse JSON file")
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    resetToDefaults()
    setConfirmReset(false)
  }

  return (
    <AppShell
      header={
        <NavHeader
          title="Settings"
          left={
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </Button>
          }
        />
      }
    >
      <main className="px-3 pt-4 pb-8 space-y-4">
        {/* Language */}
        <SettingsGroup label={t('settings.language')}>
          <Card className="p-5 space-y-3">
            <p className="text-[13px] tracking-[-0.13px] text-text-muted">
              Sets the app language and the language AI returns recipes in.
            </p>
            <Select
              options={APP_LANGUAGES.map(l => ({ value: l.id, label: l.name }))}
              value={language}
              onValueChange={(val) => {
                const newLang = val as AppLanguage
                setLanguage(newLang)
                setSettings({ ...settings, language: newLang })
              }}
            />
          </Card>
        </SettingsGroup>

        {/* AI Provider */}
        <SettingsGroup label={t('settings.aiProvider')}>
          <Card className="p-5 space-y-4">
            <div>
              <label className="text-[11px] tracking-[-0.11px] text-text-muted mb-1 block">Provider</label>
              <SegmentedControl
                options={AI_PROVIDERS.map(p => ({ value: p.id, label: p.name }))}
                value={provider}
                onValueChange={(val) => handleProviderChange(val as typeof provider)}
                size="small"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-[-0.11px] text-text-muted mb-1 block">Model</label>
              <Select
                options={providerConfig.models.map(m => ({ value: m.id, label: m.name }))}
                value={model}
                onValueChange={(val) => {
                  const newModel = val
                  setModel(newModel)
                  setSettings({ ...settings, aiModel: newModel })
                }}
              />
            </div>

            <div>
              <label className="text-[11px] tracking-[-0.11px] text-text-muted mb-1 block">
                {providerConfig.name} API Key
              </label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  type={showKey ? "text" : "password"}
                  placeholder={provider === 'openai' ? 'sk-...' : provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
                  value={currentKey}
                  onChange={(e) => setCurrentKey(e.target.value)}
                />
                <Button size="sm" variant="ghost" onClick={() => setShowKey(!showKey)}>
                  {showKey ? "Hide" : "Show"}
                </Button>
              </div>
              <p className="text-[11px] tracking-[-0.11px] text-text-muted mt-2">
                Your key is stored only on this device and sent directly to {providerConfig.name}. We never see or store your key on any server.
              </p>
            </div>

            {hasChanges && (
              <Button size="sm" onClick={handleSave}>
                {t('settings.save')}
              </Button>
            )}
          </Card>
        </SettingsGroup>

        {/* Stats */}
        <SettingsGroup label="Your Kitchen">
          <StatGrid
            stats={[
              { label: "Recipes", value: recipes.length },
              { label: "Categories", value: categories.length - 1 },
            ]}
            columns={2}
          />
        </SettingsGroup>

        {/* Data Management */}
        <SettingsGroup label="Data Management">
          <Card className="p-5 space-y-4">
            <Button variant="secondary" className="w-full" onClick={handleExport}>
              Export All Recipes (JSON)
            </Button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Import Recipes (JSON)
              </Button>
              {importStatus && (
                <p className="text-[11px] tracking-[-0.11px] text-text-muted mt-2">{importStatus}</p>
              )}
            </div>

            <Divider />

            <div>
              <Button
                variant={confirmReset ? "danger" : "secondary"}
                className="w-full"
                onClick={handleReset}
              >
                {confirmReset ? "Confirm Reset -- Tap Again" : "Reset to Defaults"}
              </Button>
              {confirmReset && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setConfirmReset(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Card>
        </SettingsGroup>

        {/* About */}
        <SettingsGroup label="About">
          <Card className="p-5 space-y-2">
            <p className="text-[13px] tracking-[-0.13px] text-text-muted">
              Even Kitchen v1.0 -- A guided cooking companion for your recipes.
            </p>
            <p className="text-[11px] tracking-[-0.11px] text-text-muted">Data is stored locally in your browser.</p>
          </Card>
        </SettingsGroup>
      </main>
    </AppShell>
  )
}
