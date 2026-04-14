import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { storageGet, storageSet } from "../data/bridge-storage"

export interface TimerState {
  running: boolean
  remaining: number
  total: number
}

interface CookingState {
  currentStepIndex: number
  timers: Record<number, TimerState>
}

interface CookingContextValue {
  currentStepIndex: number
  setCurrentStepIndex: (index: number) => void
  timers: Record<number, TimerState>
  getTimer: (stepIndex: number) => TimerState
  setStepTimer: (stepIndex: number, timer: TimerState) => void
  resetAllTimers: () => void
}

const STORAGE_KEY = 'even-kitchen:cooking'
const DEFAULT_TIMER: TimerState = { running: false, remaining: 0, total: 0 }

const CookingContext = createContext<CookingContextValue | null>(null)

export function CookingProvider({ children }: { children: ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [timers, setTimers] = useState<Record<number, TimerState>>({})
  const [loaded, setLoaded] = useState(false)

  // Load cooking state async on mount
  useEffect(() => {
    storageGet<{ currentStepIndex?: number; timers?: Record<string, TimerState> } | null>(STORAGE_KEY, null).then((parsed) => {
      if (parsed) {
        // Pause any running timers on restore (since time has passed)
        const restoredTimers: Record<number, TimerState> = {}
        for (const [key, val] of Object.entries(parsed.timers ?? {})) {
          const t = val as TimerState
          restoredTimers[Number(key)] = { ...t, running: false }
        }
        setCurrentStepIndex(parsed.currentStepIndex ?? 0)
        setTimers(restoredTimers)
      }
      setLoaded(true)
    })
  }, [])

  // Persist on change (fire-and-forget)
  useEffect(() => {
    if (!loaded) return
    storageSet(STORAGE_KEY, { currentStepIndex, timers } as CookingState)
  }, [currentStepIndex, timers, loaded])

  const getTimer = useCallback(
    (stepIndex: number): TimerState => timers[stepIndex] ?? DEFAULT_TIMER,
    [timers],
  )

  const setStepTimer = useCallback(
    (stepIndex: number, timer: TimerState) => {
      setTimers((prev) => ({ ...prev, [stepIndex]: timer }))
    },
    [],
  )

  const resetAllTimers = useCallback(() => {
    setTimers({})
  }, [])

  return (
    <CookingContext.Provider
      value={{ currentStepIndex, setCurrentStepIndex, timers, getTimer, setStepTimer, resetAllTimers }}
    >
      {children}
    </CookingContext.Provider>
  )
}

export function useCookingContext() {
  const ctx = useContext(CookingContext)
  if (!ctx) throw new Error("useCookingContext must be used within CookingProvider")
  return ctx
}
