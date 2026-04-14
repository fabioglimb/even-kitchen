import { useCallback } from 'react'
import { useRecipeContext } from '../contexts/RecipeContext'
import { t as translate } from '../utils/i18n'

export function useTranslation() {
  const { settings } = useRecipeContext()
  const lang = settings.language

  const t = useCallback(
    (key: string) => translate(key, lang),
    [lang],
  )

  return { t, lang }
}
