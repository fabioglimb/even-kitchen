import { useState } from "react"
import { Button, Card, Input, ConfirmDialog, EmptyState, SwipeToDelete } from "even-toolkit/web"
import { useDrawerHeader } from "even-toolkit/web"
import { IcEditAdd, IcEditEdit } from "even-toolkit/web/icons/svg-icons"
import { useRecipeContext } from "../contexts/RecipeContext"
import { generateId } from "../utils/format"
import { useTranslation } from "../hooks/useTranslation"
import type { Collection } from "../types/recipe"

const COLLECTION_EMOJIS = [
  "🇮🇹", "🇯🇵", "🇲🇽", "🇫🇷", "🇮🇳", "🇹🇭", "🇨🇳", "🇬🇷",
  "🍝", "🍣", "🌮", "🥗", "🍰", "🍞", "🥩", "🐟",
  "🏠", "⭐", "❤️", "🔥",
]

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

export function Cookbooks() {
  const { collections, recipes, addCollection, updateCollection, deleteCollection } = useRecipeContext()
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmoji, setEditEmoji] = useState("🍝")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmoji, setNewEmoji] = useState("🍝")

  useDrawerHeader({
    title: t('cookbooks.title'),
    right: (
      <Button size="sm" onClick={() => setShowNew(true)} aria-label={t('cookbooks.new')}>
        <IcEditAdd width={16} height={16} />
      </Button>
    ),
  })

  const handleCreate = () => {
    if (!newName.trim()) return
    const collection: Collection = {
      id: generateId(),
      name: newName.trim(),
      emoji: newEmoji,
      recipeIds: [],
    }
    addCollection(collection)
    setNewName("")
    setNewEmoji("🍝")
    setShowNew(false)
  }

  const handleStartEdit = (col: Collection) => {
    setEditingId(col.id)
    setEditName(col.name)
    setEditEmoji(col.emoji)
  }

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return
    const col = collections.find((c) => c.id === editingId)
    if (!col) return
    updateCollection({ ...col, name: editName.trim(), emoji: editEmoji })
    setEditingId(null)
  }

  const handleDelete = () => {
    if (!confirmDeleteId) return
    deleteCollection(confirmDeleteId)
    setConfirmDeleteId(null)
  }

  return (
    <div className="px-3 pt-4 pb-8">
      {showNew && (
        <Card className="mb-4 p-3 space-y-3">
          <Input
            placeholder={t('cookbooks.namePlaceholder')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <div className="flex flex-wrap gap-2">
            {COLLECTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setNewEmoji(emoji)}
                style={{ fontFamily: EMOJI_FONT }}
                className={`w-9 h-9 rounded-[6px] text-[17px] flex items-center justify-center cursor-pointer transition-all ${
                  newEmoji === emoji
                    ? "bg-accent/20 ring-2 ring-accent"
                    : "bg-surface-light hover:bg-surface"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => { setShowNew(false); setNewName(""); }}>
              {t('form.cancel')}
            </Button>
            <Button variant="highlight" className="flex-1" onClick={handleCreate}>
              {t('cookbooks.create')}
            </Button>
          </div>
        </Card>
      )}

      {collections.length === 0 && !showNew && (
        <EmptyState title={t('cookbooks.empty')} />
      )}

      <div className="space-y-3">
        {collections.map((col) => {
          const recipeCount = col.recipeIds.filter((rid) => recipes.some((r) => r.id === rid)).length

          if (editingId === col.id) {
            return (
              <Card key={col.id} className="p-3 space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
                <div className="flex flex-wrap gap-2">
                  {COLLECTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditEmoji(emoji)}
                      style={{ fontFamily: EMOJI_FONT }}
                      className={`w-9 h-9 rounded-[6px] text-[17px] flex items-center justify-center cursor-pointer transition-all ${
                        editEmoji === emoji
                          ? "bg-accent/20 ring-2 ring-accent"
                          : "bg-surface-light hover:bg-surface"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setEditingId(null)}>
                    {t('form.cancel')}
                  </Button>
                  <Button variant="highlight" className="flex-1" onClick={handleSaveEdit}>
                    {t('form.saveChanges')}
                  </Button>
                </div>
              </Card>
            )
          }

          return (
            <SwipeToDelete key={col.id} onDelete={() => setConfirmDeleteId(col.id)}>
              <Card className="flex items-center gap-3 p-3">
                <span className="text-[24px]" style={{ fontFamily: EMOJI_FONT }}>{col.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] tracking-[-0.15px] font-normal">{col.name}</p>
                  <p className="text-[13px] tracking-[-0.13px] text-text-dim">
                    {recipeCount} {t('cookbooks.recipeCount')}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleStartEdit(col)}>
                  <IcEditEdit width={16} height={16} />
                </Button>
              </Card>
            </SwipeToDelete>
          )
        })}
      </div>

      <ConfirmDialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title={t('cookbooks.delete')}
        description={t('cookbooks.confirmDelete')}
        confirmLabel={t('cookbooks.delete')}
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  )
}
