import { useEffect, useCallback } from "react"
import { useCookingContext } from "../contexts/CookingContext"

export function useTimer() {
  const { currentStepIndex, timers, getTimer, setStepTimer } = useCookingContext()

  const timer = getTimer(currentStepIndex)

  // Tick all running timers every second
  useEffect(() => {
    const runningEntries = Object.entries(timers).filter(
      ([, t]) => t.running && t.remaining > 0,
    )
    if (runningEntries.length === 0) return

    const interval = setInterval(() => {
      for (const [key, t] of Object.entries(timers)) {
        if (t.running && t.remaining > 0) {
          setStepTimer(Number(key), {
            ...t,
            remaining: t.remaining - 1,
            running: t.remaining - 1 > 0,
          })
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timers, setStepTimer])

  const start = useCallback(
    (seconds: number) => {
      setStepTimer(currentStepIndex, { running: true, remaining: seconds, total: seconds })
    },
    [currentStepIndex, setStepTimer],
  )

  const pause = useCallback(() => {
    setStepTimer(currentStepIndex, { ...timer, running: false })
  }, [currentStepIndex, timer, setStepTimer])

  const resume = useCallback(() => {
    if (timer.remaining > 0) {
      setStepTimer(currentStepIndex, { ...timer, running: true })
    }
  }, [currentStepIndex, timer, setStepTimer])

  const reset = useCallback(() => {
    setStepTimer(currentStepIndex, { running: false, remaining: 0, total: 0 })
  }, [currentStepIndex, setStepTimer])

  return {
    remaining: timer.remaining,
    total: timer.total,
    running: timer.running,
    start,
    pause,
    resume,
    reset,
  }
}
