import { useState } from "react"
import { useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useRecipes } from "../hooks/useRecipes"
import { useRecipeIO } from "../hooks/useRecipeIO"
import { RecipeCard } from "../components/shared/RecipeCard"
import { CategoryFilter, Button, Toast, useDrawerHeader } from "even-toolkit/web"
import { IcEditAdd, IcEditImport, IcShare } from "even-toolkit/web/icons/svg-icons"
import { AIImportTab } from "../components/shared/AIImportTab"
import { useTranslation } from "../hooks/useTranslation"

export function RecipeLibrary() {
  const navigate = useNavigate()
  const { categories, categoryFilter, setCategoryFilter, collections, collectionFilter, setCollectionFilter, settings, deleteRecipe, favoriteIds, toggleFavorite } = useRecipeContext()
  const recipes = useRecipes(categoryFilter, collectionFilter)
  const [activeTab, setActiveTab] = useState<"library" | "ai-import">("library")
  const {
    fileInputRef,
    statusMessage,
    statusKind,
    exportRecipes,
    triggerImport,
    handleImportFile,
  } = useRecipeIO()

  const activeKey = settings.aiProvider === 'openai' ? settings.openaiApiKey
    : settings.aiProvider === 'anthropic' ? settings.anthropicApiKey
    : settings.deepseekApiKey
  const { t } = useTranslation()
  const showAITab = activeKey.length > 0

  useDrawerHeader({
    title: t('app.title'),
    right: (
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          onClick={exportRecipes}
          aria-label={t('settings.exportBtn')}
        >
          <IcShare width={16} height={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={triggerImport}
          aria-label={t('settings.importBtn')}
        >
          <IcEditImport width={16} height={16} />
        </Button>
        <Button size="sm" onClick={() => navigate("/recipe/new")} aria-label={t('form.newRecipe')}>
          <IcEditAdd width={16} height={16} />
        </Button>
      </div>
    ),
  })

  return (
    <div className="px-3 pt-2 pb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFile}
        className="hidden"
      />
      {statusMessage && (
        <div className="mb-3">
          <Toast
            message={statusMessage}
            variant={statusKind === "info" ? "info" : "warning"}
          />
        </div>
      )}
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
        <>
          {/* Collection filter */}
          {collections.length > 0 && (
            <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
              <button
                onClick={() => setCollectionFilter('All')}
                className={`shrink-0 rounded-[6px] px-3 py-1.5 text-[13px] tracking-[-0.13px] font-normal transition-colors cursor-pointer ${
                  collectionFilter === 'All'
                    ? 'bg-text text-surface'
                    : 'bg-surface text-text-dim'
                }`}
              >
                {t('collection.all')}
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setCollectionFilter(col.id)}
                  className={`shrink-0 rounded-[6px] px-3 py-1.5 text-[13px] tracking-[-0.13px] font-normal transition-colors cursor-pointer ${
                    collectionFilter === col.id
                      ? 'bg-text text-surface'
                      : 'bg-surface text-text-dim'
                  }`}
                >
                  {col.emoji} {col.name}
                </button>
              ))}
            </div>
          )}
          <CategoryFilter categories={categories} selected={categoryFilter} onSelect={setCategoryFilter} />
        </>
      )}

      {activeTab === "library" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} isFavorite={favoriteIds.includes(recipe.id)} onToggleFavorite={() => toggleFavorite(recipe.id)} onDelete={() => deleteRecipe(recipe.id)} />
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
