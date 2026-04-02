import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./styles/app.css"
import { hydrateFromSDK } from "even-toolkit/storage"
import { ALL_STORAGE_KEYS } from "./data/persistence"

hydrateFromSDK(ALL_STORAGE_KEYS).finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
