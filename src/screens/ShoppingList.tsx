import { useMemo, useState, useRef } from "react"
import { Button, Card, Input, EmptyState, useDrawerHeader } from "even-toolkit/web"
import { IcNavShopping, IcStatusCheckbox, IcStatusCheckmark, IcTrash, IcPlus } from "even-toolkit/web/icons/svg-icons"
import { useShoppingContext, getDisplayAmount, type RecipeScale } from "../contexts/ShoppingContext"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useTranslation } from "../hooks/useTranslation"
import type { ShoppingItem } from "../types/recipe"

function ShoppingItemRow({
  item,
  displayAmount,
  onToggle,
  onRemove,
}: {
  item: ShoppingItem
  displayAmount: string
  onToggle: () => void
  onRemove: () => void
}) {
  const amount = displayAmount && item.unit ? `${displayAmount} ${item.unit}` : displayAmount || item.unit

  return (
    <Card className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 w-6 h-6 flex items-center justify-center cursor-pointer text-text"
        aria-label={item.checked ? "Uncheck" : "Check"}
      >
        {item.checked ? (
          <IcStatusCheckmark width={20} height={20} className="text-positive" />
        ) : (
          <IcStatusCheckbox width={20} height={20} className="text-text-dim" />
        )}
      </button>

      <div className="flex-1 min-w-0" onClick={onToggle}>
        <p
          className={`text-[15px] tracking-[-0.15px] font-normal ${
            item.checked ? "line-through text-text-dim" : "text-text"
          }`}
        >
          {item.name}
        </p>
        {amount && (
          <p
            className={`text-[13px] tracking-[-0.13px] font-normal ${
              item.checked ? "line-through text-text-dim" : "text-text-dim"
            }`}
          >
            {amount}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 w-6 h-6 flex items-center justify-center cursor-pointer text-text-dim hover:text-negative transition-colors"
        aria-label="Remove"
      >
        <IcTrash width={16} height={16} />
      </button>
    </Card>
  )
}

interface RecipeGroup {
  recipeId: string | null
  title: string
  emoji: string
  unchecked: ShoppingItem[]
  checked: ShoppingItem[]
  scale: RecipeScale | null
}

function GroupHeader({
  group,
  onServingsChange,
  t,
}: {
  group: RecipeGroup
  onServingsChange?: (servings: number) => void
  t: (key: string) => string
}) {
  const total = group.unchecked.length + group.checked.length
  const done = group.checked.length
  const allDone = done === total
  const scale = group.scale

  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[15px] tracking-[-0.15px]">{group.emoji}</span>
      <span className={`text-[13px] tracking-[-0.13px] font-normal ${allDone ? "text-text-dim line-through" : "text-text"}`}>
        {group.title}
      </span>
      <span className="text-[11px] tracking-[-0.11px] font-normal text-text-dim">
        {done}/{total}
      </span>
      <div className="flex-1 h-[1px] bg-border" />
      {scale && onServingsChange && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onServingsChange(scale.currentServings - 1)}
            disabled={scale.currentServings <= 1}
            className="w-6 h-6 flex items-center justify-center rounded-[4px] bg-surface text-text text-[13px] tracking-[-0.13px] font-normal disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label="Decrease servings"
          >
            −
          </button>
          <span className="text-[11px] tracking-[-0.11px] font-normal text-text-dim min-w-[20px] text-center">
            {scale.currentServings}×
          </span>
          <button
            type="button"
            onClick={() => onServingsChange(scale.currentServings + 1)}
            className="w-6 h-6 flex items-center justify-center rounded-[4px] bg-surface text-text text-[13px] tracking-[-0.13px] font-normal cursor-pointer"
            aria-label="Increase servings"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

function AddItemForm({ onAdd }: { onAdd: (name: string, amount?: string, unit?: string) => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [unit, setUnit] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd(name, amount || undefined, unit || undefined)
    setName("")
    setAmount("")
    setUnit("")
    nameRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Card className="mb-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <Input
            ref={nameRef}
            type="text"
            placeholder={t("shopping.itemName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[60px] shrink-0">
          <Input
            type="text"
            placeholder={t("shopping.qty")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-[60px] shrink-0">
          <Input
            type="text"
            placeholder={t("shopping.unit")}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleSubmit}
          disabled={!name.trim()}
          aria-label={t("shopping.addItem")}
        >
          <IcPlus width={16} height={16} />
        </Button>
      </div>
    </Card>
  )
}

export function ShoppingList() {
  const { items, recipeScales, checkedCount, totalCount, addItem, setRecipeScale, toggleItem, removeItem, clearAll, clearChecked } =
    useShoppingContext()
  const { recipes } = useRecipeContext()
  const { t } = useTranslation()

  useDrawerHeader({
    title: t("shopping.title"),
    backTo: "/",
  })

  const recipeMap = useMemo(() => {
    const map = new Map<string, { title: string; emoji: string }>()
    for (const r of recipes) {
      map.set(r.id, { title: r.title, emoji: r.heroEmoji })
    }
    return map
  }, [recipes])

  const groups = useMemo(() => {
    const groupMap = new Map<string, RecipeGroup>()

    for (const item of items) {
      const key = item.recipeId ?? "__other__"

      if (!groupMap.has(key)) {
        const recipe = item.recipeId ? recipeMap.get(item.recipeId) : null
        const scale = item.recipeId ? recipeScales[item.recipeId] ?? null : null
        groupMap.set(key, {
          recipeId: item.recipeId ?? null,
          title: recipe?.title ?? t("shopping.otherItems"),
          emoji: recipe?.emoji ?? "🛒",
          unchecked: [],
          checked: [],
          scale,
        })
      }

      const group = groupMap.get(key)!
      if (item.checked) group.checked.push(item)
      else group.unchecked.push(item)
    }

    // Sort groups: groups with unchecked items first, fully-checked groups last
    const sorted = Array.from(groupMap.values()).sort((a, b) => {
      const aDone = a.unchecked.length === 0 ? 1 : 0
      const bDone = b.unchecked.length === 0 ? 1 : 0
      if (aDone !== bDone) return aDone - bDone
      return 0
    })

    return sorted
  }, [items, recipeMap, recipeScales, t])

  const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  const progressLabel = t("shopping.progress")
    .replace("{checked}", String(checkedCount))
    .replace("{total}", String(totalCount))

  if (totalCount === 0) {
    return (
      <div className="px-3 pt-2 pb-8">
        <EmptyState
          icon={<IcNavShopping width={32} height={32} />}
          title={t("shopping.empty")}
        />
        <AddItemForm onAdd={addItem} />
      </div>
    )
  }

  return (
    <div className="px-3 pt-2 pb-8">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] tracking-[-0.13px] font-normal text-text-dim">
            {progressLabel}
          </span>
          <span className="text-[11px] tracking-[-0.11px] font-normal text-text-dim">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-1.5 bg-surface rounded-[6px] overflow-hidden">
          <div
            className="h-full bg-positive rounded-[6px] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add item */}
      <AddItemForm onAdd={addItem} />

      {/* Grouped items */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.recipeId ?? "__other__"}>
            <GroupHeader
              group={group}
              onServingsChange={group.recipeId ? (s) => setRecipeScale(group.recipeId!, s) : undefined}
              t={t}
            />
            <div className="space-y-1.5">
              {group.unchecked.map((item) => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  displayAmount={getDisplayAmount(item, recipeScales)}
                  onToggle={() => toggleItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
              {group.checked.map((item) => (
                <ShoppingItemRow
                  key={item.id}
                  item={item}
                  displayAmount={getDisplayAmount(item, recipeScales)}
                  onToggle={() => toggleItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        {checkedCount > 0 && (
          <Button variant="danger" className="flex-1" onClick={clearChecked}>
            {t("shopping.clearChecked")}
          </Button>
        )}
        <Button variant="danger" className="flex-1" onClick={clearAll}>
          {t("shopping.clearAll")}
        </Button>
      </div>
    </div>
  )
}
