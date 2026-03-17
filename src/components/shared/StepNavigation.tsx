import { Button } from "../ui/Button"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrev: () => void
  onNext: () => void
  isLastStep: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isLastStep,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 1}
      >
        Previous
      </Button>

      <span className="text-sm text-text-muted tabular-nums">
        Step {currentStep} of {totalSteps}
      </span>

      <Button onClick={onNext}>
        {isLastStep ? "Finish" : "Next Step"}
      </Button>
    </div>
  )
}
