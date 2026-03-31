import { useState } from "react"
import { useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useRecipes } from "../hooks/useRecipes"
import { RecipeCard } from "../components/shared/RecipeCard"
import { CategoryFilter, Button, useDrawerHeader } from "even-toolkit/web"
import { AIImportTab } from "../components/shared/AIImportTab"
import { useTranslation } from "../hooks/useTranslation"

export function RecipeLibrary() {
  const navigate = useNavigate()
  const { categories, categoryFilter, setCategoryFilter, settings, deleteRecipe } = useRecipeContext()
  const recipes = useRecipes(categoryFilter)
  const [activeTab, setActiveTab] = useState<"library" | "ai-import">("library")

  const activeKey = settings.aiProvider === 'openai' ? settings.openaiApiKey
    : settings.aiProvider === 'anthropic' ? settings.anthropicApiKey
    : settings.deepseekApiKey
  const { t } = useTranslation()
  const showAITab = activeKey.length > 0

  useDrawerHeader({
    title: 'ER Kitchen',
    right: (
      <Button size="sm" onClick={() => navigate("/recipe/new")}>+ New</Button>
    ),
  })

  return (
    <div className="px-3 pt-2 pb-8">
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

      {activeTab === "library" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onDelete={() => deleteRecipe(recipe.id)} />
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
  )
}
