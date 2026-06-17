import { useEffect, useRef, useState } from "react";
import { useRecipeContext } from "../contexts/RecipeContext";
import { downloadJson, validateImportedRecipes } from "../utils/export";
import { useTranslation } from "./useTranslation";

const STATUS_TIMEOUT_MS = 3500;

export function useRecipeIO() {
  const { recipes, importRecipes } = useRecipeContext();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusKind, setStatusKind] = useState<"info" | "warning" | "error">("info");

  // Auto-clear status after a few seconds.
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), STATUS_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  const exportRecipes = () =>
    downloadJson(recipes, `even-kitchen-recipes-${Date.now()}.json`);

  const triggerImport = () => fileInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const validated = validateImportedRecipes(data);
        if (validated) {
          importRecipes(validated);
          setStatusKind("info");
          setStatusMessage(
            t("settings.importedRecipes").replace("{count}", String(validated.length)),
          );
        } else {
          setStatusKind("error");
          setStatusMessage(t("settings.invalidFormat"));
        }
      } catch {
        setStatusKind("error");
        setStatusMessage(t("settings.parseFailed"));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    statusMessage,
    statusKind,
    exportRecipes,
    triggerImport,
    handleImportFile,
    recipeCount: recipes.length,
  };
}
