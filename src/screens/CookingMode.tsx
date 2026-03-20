import { useParams, useNavigate } from "react-router"
import { useRecipeContext } from "../contexts/RecipeContext"
import { useCookingContext } from "../contexts/CookingContext"
import { useTimer } from "../hooks/useTimer"
import { useCookingProgress } from "../hooks/useCookingProgress"
import { Button, Progress, TimerRing, StepIndicator, NavHeader, EmptyState, AppShell } from "even-toolkit/web"
import { IcChevronBack } from "even-toolkit/web/icons/svg-icons"

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
      <EmptyState title="Recipe not found" />
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
    <AppShell
      header={
        <>
          <NavHeader title={recipe.title} left={<Button variant="ghost" size="icon" onClick={() => navigate(`/recipe/${recipe.id}`)}><IcChevronBack width={20} height={20} /></Button>} />
          <div className="px-3 mt-3 pb-2">
            <Progress value={progress} />
          </div>
        </>
      }
      footer={
        <div className="px-4 py-4">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      }
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <span className="text-[11px] tracking-[-0.11px] font-normal text-text-dim mb-2">
          Step {currentStep} of {totalSteps}
        </span>

        <h2 className="text-[20px] tracking-[-0.6px] font-normal text-center mb-4">{step.title}</h2>

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
                <Button size="sm" variant="default" onClick={timer.reset}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
