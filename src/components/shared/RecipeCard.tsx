import { useNavigate } from "react-router"
import { useRef, useState, useCallback } from "react"
import { Card, Badge } from "even-toolkit/web"
import { IcTrash } from "even-toolkit/web/icons/svg-icons"
import { formatMinutes } from "../../utils/format"
import { useTranslation } from "../../hooks/useTranslation"
import type { Recipe } from "../../types/recipe"
import type { TouchEvent as ReactTouchEvent } from "react"

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'
const DELETE_WIDTH = 72
const SWIPE_THRESHOLD = 40

interface RecipeCardProps {
  recipe: Recipe
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onDelete?: () => void
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onDelete }: RecipeCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [offset, setOffset] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const currentOffset = useRef(0)
  const dir = useRef<'none' | 'h' | 'v'>('none')

  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    if (!onDelete) return
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    currentOffset.current = offset
    dir.current = 'none'
    setSwiping(true)
  }, [onDelete, offset])

  const onTouchMove = useCallback((e: ReactTouchEvent) => {
    if (!swiping) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current
    if (dir.current === 'none') {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        dir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
      }
      return
    }
    if (dir.current === 'v') return
    setOffset(Math.min(0, Math.max(-DELETE_WIDTH, currentOffset.current + dx)))
  }, [swiping])

  const onTouchEnd = useCallback(() => {
    if (!swiping) return
    setSwiping(false)
    if (dir.current === 'v') return
    setOffset(offset < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0)
  }, [swiping, offset])

  return (
    <div className="relative overflow-hidden rounded-[6px]">
      {/* Delete action behind */}
      {onDelete && offset < 0 && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-negative text-text-highlight cursor-pointer rounded-r-[6px]"
          style={{ width: DELETE_WIDTH }}
        >
          <IcTrash width={20} height={20} />
        </button>
      )}
      {/* Card */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 200ms ease',
        }}
      >
        <Card
          padding="none"
          variant="elevated"
          className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform overflow-hidden"
          onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
          <div className="flex flex-col h-full">
            <div className="relative h-32 flex items-center justify-center text-6xl bg-surface-light">
              <span style={{ fontFamily: EMOJI_FONT }}>
                {recipe.heroEmoji || '🍣'}
              </span>
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                  className="absolute top-2 right-2 text-[20px] leading-none cursor-pointer"
                >
                  {isFavorite ? '★' : '☆'}
                </button>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <h3 className="text-[17px] tracking-[-0.17px] font-normal leading-tight">{recipe.title}</h3>
              <p className="text-[13px] tracking-[-0.13px] text-text-muted leading-snug">{recipe.subtitle}</p>
              <div className="flex items-center gap-2 mt-auto pt-2">
                <Badge>{formatMinutes(recipe.prepTime + recipe.cookTime)}</Badge>
                <Badge>{recipe.difficulty}</Badge>
                <Badge>{recipe.servings} {t('card.serv')}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
