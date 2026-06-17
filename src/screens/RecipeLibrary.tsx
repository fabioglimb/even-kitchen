import { useState } from "react"
import { useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useRecipes } from "../hooks/useRecipes"
import { useRecipeIO } from "../hooks/useRecipeIO"
import { RecipeCard } from "../components/shared/RecipeCard"
import { CategoryFilter, Button, BottomSheet, Toast, useDrawerHeader } from "even-toolkit/web"
import { IcEditAdd, IcEditImport, IcShare, IcMore } from "even-toolkit/web/icons/svg-icons"
import { AIImportTab } from "../components/shared/AIImportTab"
import { useTranslation } from "../hooks/useTranslation"

export function RecipeLibrary() {
  const navigate = useNavigate()
  const { categories, categoryFilter, setCategoryFilter, settings, deleteRecipe, favoriteIds, toggleFavorite } = useRecipeContext()
  const recipes = useRecipes(categoryFilter)
  const [activeTab, setActiveTab] = useState<"library" | "ai-import">("library")
  const [moreOpen, setMoreOpen] = useState(false)
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
          onClick={() => setMoreOpen(true)}
          aria-label={t('library.more')}
        >
          <IcMore width={16} height={16} />
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
      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)}>
        <div className="py-2 flex flex-col">
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 text-[15px] tracking-[-0.15px] font-normal text-text cursor-pointer bg-transparent border-0 text-left"
            onClick={() => {
              exportRecipes()
                .then(() => setMoreOpen(false))
                .catch(() => {});
            }}
          >
            <IcShare width={18} height={18} />
            {t('settings.exportBtn')}
          </button>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 text-[15px] tracking-[-0.15px] font-normal text-text cursor-pointer bg-transparent border-0 text-left"
            onClick={() => { triggerImport(); setMoreOpen(false); }}
          >
            <IcEditImport width={18} height={18} />
            {t('settings.importBtn')}
          </button>
        </div>
      </BottomSheet>
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
        <CategoryFilter categories={categories} selected={categoryFilter} onSelect={setCategoryFilter} />
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
