import { BrowserRouter, Routes, Route } from "react-router"
import { RecipeProvider } from "./contexts/RecipeContext"
import { CookingProvider } from "./contexts/CookingContext"
import { RecipeLibrary } from "./screens/RecipeLibrary"
import { RecipeDetail } from "./screens/RecipeDetail"
import { RecipeForm } from "./screens/RecipeForm"
import { CookingMode } from "./screens/CookingMode"
import { Completion } from "./screens/Completion"
import { Settings } from "./screens/Settings"
import { KitchenGlasses } from "./glass/KitchenGlasses"

export function App() {
  return (
    <RecipeProvider>
      <CookingProvider>
        <BrowserRouter>
          <KitchenGlasses />
          <Routes>
            <Route path="/" element={<RecipeLibrary />} />
            <Route path="/recipe/new" element={<RecipeForm />} />
            <Route path="/recipe/:id/edit" element={<RecipeForm />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/:id/cook" element={<CookingMode />} />
            <Route path="/recipe/:id/complete" element={<Completion />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </CookingProvider>
    </RecipeProvider>
  )
}
