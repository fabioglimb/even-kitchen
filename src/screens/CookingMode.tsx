import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { useTimer } from "../hooks/useTimer"
import { useCookingProgress } from "../hooks/useCookingProgress"
import { Button } from "../components/ui/Button"
import { Progress } from "../components/ui/Progress"
import { TimerRing } from "../components/shared/TimerRing"
import { StepNavigation } from "../components/shared/StepNavigation"

export function CookingMode() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { recipes } = useRecipeContext()
  const recipe = recipes.find((r) => r.id === id) ?? null
  const { currentStepIndex, setCurrentStepIndex } = useCookingContext()
  const timer = useTimer()
  const { progress, isLastStep, currentStep, totalSteps } = useCookingProgress(recipe)

  if (!recipe) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-text-muted">Recipe not found.</p>
      </div>
    )
  }

  const step = recipe.steps[currentStepIndex]

  // Timer display: show step duration when not started, actual remaining when active
  const timerNotStarted = timer.total === 0 && timer.remaining === 0
  const displayRemaining = timerNotStarted ? (step.timerSeconds ?? 0) : timer.remaining
  const displayTotal = timerNotStarted ? (step.timerSeconds ?? 0) : (timer.total || step.timerSeconds || 0)

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      navigate(`/recipe/${recipe.id}/complete`)
    } else {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleTimerToggle = () => {
    if (!step.timerSeconds) return
    if (timer.running) {
      timer.pause()
    } else if (timer.remaining > 0) {
      timer.resume()
    } else {
      timer.start(step.timerSeconds)
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ "--recipe-accent": recipe.accentColor } as React.CSSProperties}
    >
      {/* Top bar */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(`/recipe/${recipe.id}`)}
          className="text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          &larr; Exit
        </button>
        <span className="text-sm font-medium text-text-muted">{recipe.title}</span>
        <div className="w-12" />
      </header>

      {/* Progress bar */}
      <div className="px-4">
        <Progress value={progress} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <span
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: recipe.accentColor }}
        >
          Step {currentStep} of {totalSteps}
        </span>

        <h2 className="text-2xl font-bold text-center mb-4">{step.title}</h2>

        <p className="text-text-muted text-center leading-relaxed mb-8">
          {step.instructions}
        </p>

        {/* Timer */}
        {step.timerSeconds && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <TimerRing
              remaining={displayRemaining}
              total={displayTotal}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleTimerToggle}
              >
                {timer.running ? "Pause" : (timer.remaining > 0 && timer.total > 0) ? "Resume" : "Start Timer"}
              </Button>
              {timer.total > 0 && timer.remaining > 0 && timer.remaining < timer.total && (
                <Button size="sm" variant="outline" onClick={timer.reset}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="px-4 pb-6 max-w-lg mx-auto w-full">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrev={handlePrev}
          onNext={handleNext}
          isLastStep={isLastStep}
        />
      </div>
    </div>
  )
}
