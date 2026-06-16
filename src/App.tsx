import { BrowserRouter, Routes, Route } from "react-router"
import { RecipeProvider } from "./contexts/RecipeContext"
import { CookingProvider } from "./contexts/CookingContext"
import { ShoppingProvider } from "./contexts/ShoppingContext"
import { RecipeLibrary } from "./screens/RecipeLibrary"
import { RecipeDetail } from "./screens/RecipeDetail"
import { RecipeForm } from "./screens/RecipeForm"
import { CookingMode } from "./screens/CookingMode"
import { Completion } from "./screens/Completion"
import { Settings } from "./screens/Settings"
import { ShoppingList } from "./screens/ShoppingList"
import { KitchenGlasses } from "./glass/KitchenGlasses"
import { Shell } from "./layouts/shell"

export function App() {
  return (
    <RecipeProvider>
      <CookingProvider>
        <ShoppingProvider>
          <BrowserRouter>
            <KitchenGlasses />
            <Routes>
              <Route element={<Shell />}>
                <Route path="/" element={<RecipeLibrary />} />
                <Route path="/recipe/new" element={<RecipeForm />} />
                <Route path="/recipe/:id/edit" element={<RecipeForm />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/recipe/:id/cook" element={<CookingMode />} />
                <Route path="/recipe/:id/complete" element={<Completion />} />
                <Route path="/shopping" element={<ShoppingList />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ShoppingProvider>
      </CookingProvider>
    </RecipeProvider>
  )
}
