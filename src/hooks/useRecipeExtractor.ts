import { useState, useCallback } from "react"
import { useRecipeContext } from "../contexts/RecipeContext"
import { generateId } from "../utils/format"
import { getLanguageFullName } from "../utils/i18n"
import type { Recipe, AIProvider } from "../types/recipe"

interface ExtractorState {
  loading: boolean
  error: string | null
  extractedRecipe: Recipe | null
}

const RECIPE_SCHEMA_PROMPT = `You are a recipe extraction assistant. Given a URL, fetch and extract the recipe information FAITHFULLY from the page content.

CRITICAL RULES:
- Extract EVERY step exactly as written on the page. Do NOT summarize, merge, or skip steps.
- Keep the original step-by-step breakdown. If the recipe has 12 steps, return 12 steps.
- Preserve the original instructions text as closely as possible — do not rephrase or shorten.
- Extract ALL ingredients with their exact amounts and units as listed.
- If the page specifies prep time, cook time, servings — use those exact values.
- For the step title, use a short summary (3-5 words) of what happens in that step.
- Only include timerSeconds for steps that explicitly mention a specific wait/cook duration.

Return JSON matching this exact schema:
{
  "title": "string",
  "subtitle": "string (short description from the page or a brief tagline)",
  "category": "string (e.g. Pasta, Breakfast, Seafood, Dessert, Salad, Soup, etc.)",
  "prepTime": number (minutes),
  "cookTime": number (minutes),
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard",
  "heroEmoji": "string (single food emoji that best represents this dish)",
  "accentColor": "string (hex color that matches the dish's vibe)",
  "ingredients": [{ "name": "string", "amount": "string", "unit": "string" }],
  "steps": [{ "title": "string (short 3-5 word title)", "instructions": "string (full original instructions for this step)", "timerSeconds": number | null }]
}

Return ONLY the JSON object, no other text.

IMPORTANT: All text fields (title, subtitle, ingredient names, step titles, step instructions) MUST be in {LANGUAGE}. Translate if the source is in a different language, but keep the faithful step-by-step structure.`

function getApiKey(provider: AIProvider, settings: { openaiApiKey: string; anthropicApiKey: string; deepseekApiKey: string }): string {
  switch (provider) {
    case 'openai': return settings.openaiApiKey
    case 'anthropic': return settings.anthropicApiKey
    case 'deepseek': return settings.deepseekApiKey
  }
}

function getPrompt(language: string): string {
  return RECIPE_SCHEMA_PROMPT.replace('{LANGUAGE}', language)
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  url: string,
  language: string,
): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: getPrompt(language) },
        { role: "user", content: `Extract the recipe from this URL: ${url}` },
      ],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function callAnthropic(
  apiKey: string,
  model: string,
  url: string,
  language: string,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: getPrompt(language),
      messages: [
        { role: "user", content: `Extract the recipe from this URL: ${url}` },
      ],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text ?? ''
}

async function extractWithProvider(
  provider: AIProvider,
  apiKey: string,
  model: string,
  url: string,
  language: string,
): Promise<string> {
  switch (provider) {
    case 'openai':
      return callOpenAICompatible("https://api.openai.com/v1", apiKey, model, url, language)
    case 'deepseek':
      return callOpenAICompatible("https://api.deepseek.com", apiKey, model, url, language)
    case 'anthropic':
      return callAnthropic(apiKey, model, url, language)
  }
}

export function useRecipeExtractor() {
  const { settings } = useRecipeContext()
  const [state, setState] = useState<ExtractorState>({
    loading: false,
    error: null,
    extractedRecipe: null,
  })

  const extractFromUrl = useCallback(
    async (url: string) => {
      const apiKey = getApiKey(settings.aiProvider, settings)
      if (!apiKey) {
        setState({ loading: false, error: `${settings.aiProvider} API key not set`, extractedRecipe: null })
        return
      }

      setState({ loading: true, error: null, extractedRecipe: null })

      try {
        const language = getLanguageFullName(settings.language)
        const content = await extractWithProvider(settings.aiProvider, apiKey, settings.aiModel, url, language)
        if (!content) throw new Error("No response from AI")

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = content.trim()
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch) jsonStr = jsonMatch[1].trim()

        const parsed = JSON.parse(jsonStr)
        const recipe: Recipe = {
          id: generateId(),
          title: parsed.title || "Untitled Recipe",
          subtitle: parsed.subtitle || "",
          category: parsed.category || "Uncategorized",
          prepTime: parsed.prepTime || 0,
          cookTime: parsed.cookTime || 0,
          servings: parsed.servings || 2,
          difficulty: parsed.difficulty || "Medium",
          heroEmoji: parsed.heroEmoji || "\uD83C\uDF5D",
          accentColor: parsed.accentColor || "#e6b44c",
          ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
          steps: Array.isArray(parsed.steps)
            ? parsed.steps.map((s: Record<string, unknown>) => ({
                title: s.title || "",
                instructions: s.instructions || "",
                ...(s.timerSeconds ? { timerSeconds: Number(s.timerSeconds) } : {}),
              }))
            : [],
        }

        setState({ loading: false, error: null, extractedRecipe: recipe })
      } catch (err) {
        setState({
          loading: false,
          error: err instanceof Error ? err.message : "Failed to extract recipe",
          extractedRecipe: null,
        })
      }
    },
    [settings],
  )

  const reset = useCallback(() => {
    setState({ loading: false, error: null, extractedRecipe: null })
  }, [])

  return { ...state, extractFromUrl, reset }
}
