import { cn } from "../../utils/cn"

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
            selected === cat
              ? "bg-accent text-white"
              : "bg-surface-lighter text-text-muted hover:text-text"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
