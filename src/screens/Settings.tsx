import { useState, useRef } from "react"
import { useRecipeContext } from "../contexts/RecipeContext"
import { Button, Input, Select, SegmentedControl, Card, useDrawerHeader } from "even-toolkit/web"
import { downloadJson, validateImportedRecipes } from "../utils/export"
import { AI_PROVIDERS, APP_LANGUAGES, type AIProvider, type AppLanguage } from "../types/recipe"
import { useTranslation } from "../hooks/useTranslation"

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <span className="text-[15px] tracking-[-0.15px] text-text font-normal">{label}</span>
        {description && <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1.5 mt-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

export function Settings() {
  const { recipes, settings, setSettings, importRecipes, resetToDefaults } =
    useRecipeContext()

  const { t } = useTranslation()
  const [provider, setProvider] = useState<AIProvider>(settings.aiProvider)
  const [model, setModel] = useState(settings.aiModel)
  const [showKey, setShowKey] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const providerConfig = AI_PROVIDERS.find((p) => p.id === provider)!

  const currentKey = provider === 'openai' ? settings.openaiApiKey : provider === 'anthropic' ? settings.anthropicApiKey : settings.deepseekApiKey

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider)
    const config = AI_PROVIDERS.find((p) => p.id === newProvider)!
    const newModel = config.models[0].id
    setModel(newModel)
    setSettings({ ...settings, aiProvider: newProvider, aiModel: newModel })
  }

  const handleKeyChange = (value: string) => {
    if (provider === 'openai') setSettings({ ...settings, openaiApiKey: value })
    else if (provider === 'anthropic') setSettings({ ...settings, anthropicApiKey: value })
    else setSettings({ ...settings, deepseekApiKey: value })
  }

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
          setImportStatus(t('settings.importedRecipes').replace('{count}', String(validated.length)))
        } else {
          setImportStatus(t('settings.invalidFormat'))
        }
      } catch {
        setImportStatus(t('settings.parseFailed'))
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

  useDrawerHeader({
    title: t('settings.title'),
    backTo: '/',
    right: <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>,
  })

  return (
    <div className="px-3 pt-4 pb-8">
      {/* AI Provider */}
      <SectionLabel>{t('settings.aiProvider')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.provider')}>
          <SegmentedControl
            size="small"
            options={AI_PROVIDERS.map((p) => ({ value: p.id, label: p.name }))}
            value={provider}
            onValueChange={(val) => handleProviderChange(val as AIProvider)}
          />
        </SettingRow>
        <SettingRow label={t('settings.model')}>
          <Select
            options={providerConfig.models.map((m) => ({ value: m.id, label: m.name }))}
            value={model}
            onValueChange={(val) => {
              setModel(val)
              setSettings({ ...settings, aiModel: val })
            }}
            className="w-[130px]"
          />
        </SettingRow>
        <div className="py-3 border-b border-border last:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[15px] tracking-[-0.15px] text-text font-normal">{providerConfig.name} {t('settings.apiKey')}</span>
              <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-0.5">
                {t('settings.storedLocally')} {providerConfig.name}
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setShowKey(!showKey)}>
              {showKey ? t('settings.hide') : t('settings.show')}
            </Button>
          </div>
          <Input
            type={showKey ? "text" : "password"}
            placeholder={provider === 'openai' ? 'sk-...' : provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
            value={currentKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="mt-2"
          />
        </div>
      </Card>

      {/* Language */}
      <SectionLabel>{t('settings.language')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.language')} description={t('settings.langDesc')}>
          <Select
            options={APP_LANGUAGES.map((l) => ({ value: l.id, label: l.name }))}
            value={settings.language}
            onValueChange={(val) => setSettings({ ...settings, language: val as AppLanguage })}
            className="w-[130px]"
          />
        </SettingRow>
      </Card>

      {/* Data */}
      <SectionLabel>{t('settings.data')}</SectionLabel>
      <Card className="mb-4">
        <SettingRow label={t('settings.exportRecipes')} description={`${recipes.length} ${t('settings.recipesInCollection')}`}>
          <Button size="sm" variant="secondary" onClick={handleExport}>
            {t('settings.exportBtn')}
          </Button>
        </SettingRow>
        <SettingRow label={t('settings.importRecipes')} description={importStatus ?? t('settings.importDesc')}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            {t('settings.importBtn')}
          </Button>
        </SettingRow>
        <SettingRow label={t('settings.resetDefaults')} description={t('settings.resetDesc')}>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                {t('settings.cancel')}
              </Button>
              <Button size="sm" variant="danger" onClick={handleReset}>
                {t('settings.confirm')}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="danger" onClick={handleReset}>
              {t('settings.resetBtn')}
            </Button>
          )}
        </SettingRow>
      </Card>

      {/* About */}
      <SectionLabel>{t('settings.about')}</SectionLabel>
      <Card>
        <SettingRow label={t('settings.aboutName')} description={t('settings.aboutDesc')}>
          <span className="text-[11px] tracking-[-0.11px] text-text-dim">v0.1.5</span>
        </SettingRow>
      </Card>
    </div>
  )
}
