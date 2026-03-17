import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
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

  const inputClass =
    "w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30"

  return (
    <div className="min-h-dvh pb-8">
      <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Language */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            {t('settings.language')}
          </h3>
          <p className="text-sm text-text-muted">
            Sets the app language and the language AI returns recipes in.
          </p>
          <select
            className={inputClass}
            value={language}
            onChange={(e) => {
              const newLang = e.target.value as AppLanguage
              setLanguage(newLang)
              setSettings({ ...settings, language: newLang })
            }}
          >
            {APP_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Card>

        {/* AI Provider */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            {t('settings.aiProvider')}
          </h3>

          <div>
            <label className="text-xs text-text-muted mb-1 block">Provider</label>
            <div className="flex gap-2">
              {AI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    provider === p.id
                      ? "bg-accent text-white"
                      : "bg-surface-light text-text-muted hover:text-text"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted mb-1 block">Model</label>
            <select
              className={inputClass}
              value={model}
              onChange={(e) => {
                const newModel = e.target.value
                setModel(newModel)
                setSettings({ ...settings, aiModel: newModel })
              }}
            >
              {providerConfig.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-text-muted mb-1 block">
              {providerConfig.name} API Key
            </label>
            <div className="flex gap-2">
              <input
                className={`${inputClass} flex-1`}
                type={showKey ? "text" : "password"}
                placeholder={provider === 'openai' ? 'sk-...' : provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
                value={currentKey}
                onChange={(e) => setCurrentKey(e.target.value)}
              />
              <Button size="sm" variant="ghost" onClick={() => setShowKey(!showKey)}>
                {showKey ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Your key is stored only on this device and sent directly to {providerConfig.name}. We never see or store your key on any server.
            </p>
          </div>

          {hasChanges && (
            <Button size="sm" onClick={handleSave}>
              {t('settings.save')}
            </Button>
          )}
        </Card>

        {/* Stats */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Your Kitchen
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{recipes.length}</p>
              <p className="text-xs text-text-muted mt-1">Recipes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{categories.length - 1}</p>
              <p className="text-xs text-text-muted mt-1">Categories</p>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Data Management
          </h3>

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
              <p className="text-xs text-text-muted mt-2">{importStatus}</p>
            )}
          </div>

          <div className="pt-2 border-t border-border">
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

        {/* About */}
        <Card className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">About</h3>
          <p className="text-sm text-text-muted">
            Even Kitchen v1.0 -- A guided cooking companion for your recipes.
          </p>
          <p className="text-xs text-text-muted">Data is stored locally in your browser.</p>
        </Card>
      </main>
    </div>
  )
}
