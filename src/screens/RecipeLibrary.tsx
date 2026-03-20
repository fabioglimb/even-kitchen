import { useState } from "react"
import { useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useRecipes } from "../hooks/useRecipes"
import { RecipeCard } from "../components/shared/RecipeCard"
import { CategoryFilter, Button, AppShell } from "even-toolkit/web"
import { AIImportTab } from "../components/shared/AIImportTab"
import { useTranslation } from "../hooks/useTranslation"

export function RecipeLibrary() {
  const navigate = useNavigate()
  const { categories, categoryFilter, setCategoryFilter, settings } = useRecipeContext()
  const recipes = useRecipes(categoryFilter)
  const [activeTab, setActiveTab] = useState<"library" | "ai-import">("library")

  const activeKey = settings.aiProvider === 'openai' ? settings.openaiApiKey
    : settings.aiProvider === 'anthropic' ? settings.anthropicApiKey
    : settings.deepseekApiKey
  const { t } = useTranslation()
  const showAITab = activeKey.length > 0

  return (
    <AppShell
      header={
        <div className="px-3">
          <header className="mt-4 mb-3 flex items-center justify-between">
            <h1 className="text-[24px] tracking-[-0.72px] font-normal">EvenKitchen</h1>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => navigate("/recipe/new")}>
                + New
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate("/settings")}
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Button>
            </div>
          </header>

          {showAITab && (
            <div className="flex gap-1 mb-3 bg-surface rounded-[6px] p-1">
              <button
                onClick={() => setActiveTab("library")}
                className={`flex-1 rounded-[4px] px-4 py-2 text-[13px] tracking-[-0.13px] font-normal transition-colors cursor-pointer ${
                  activeTab === "library"
                    ? "bg-surface-light text-text"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {t('library.tab.library')}
              </button>
              <button
                onClick={() => setActiveTab("ai-import")}
                className={`flex-1 rounded-[4px] px-4 py-2 text-[13px] tracking-[-0.13px] font-normal transition-colors cursor-pointer ${
                  activeTab === "ai-import"
                    ? "bg-surface-light text-text"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {t('library.tab.aiImport')}
              </button>
            </div>
          )}

          {activeTab === "library" && (
            <CategoryFilter categories={categories} selected={categoryFilter} onSelect={setCategoryFilter} />
          )}
        </div>
      }
    >
      <div className="px-3 pb-8">
        {activeTab === "library" ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {recipes.length === 0 && (
              <p className="text-center text-text-muted mt-12">
                {t('library.noRecipes')}
              </p>
            )}
          </>
        ) : (
          <AIImportTab />
        )}
      </div>
    </AppShell>
  )
}
