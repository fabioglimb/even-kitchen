import { useMemo } from "react"
import { useCookingContext } from "../contexts/CookingContext"
import type { Recipe } from "../types/recipe"

export function useCookingProgress(recipe: Recipe | null) {
  const { currentStepIndex } = useCookingContext()

  return useMemo(() => {
    if (!recipe) {
      return { progress: 0, stepCount: 0, isLastStep: false, currentStep: 1, totalSteps: 0 }
    }

    const totalSteps = recipe.steps.length
    const currentStep = currentStepIndex + 1
    const progress = (currentStep / totalSteps) * 100
    const isLastStep = currentStepIndex === totalSteps - 1

    return { progress, stepCount: totalSteps, isLastStep, currentStep, totalSteps }
  }, [recipe, currentStepIndex])
}
