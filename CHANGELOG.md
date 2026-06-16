# Changelog

## 1.0.0 — Cucina Italiana & Market Mode

Released: 2026-06-16

### Added

- **Recipe Collections**: group recipes into themed collections; ships with a built-in "Cucina Italiana" collection (Pizza Margherita, Ragu alla Napoletana, Spaghetti alle Vongole, Tiramisu + Cacio e Pepe)
- **Servings Scaler**: adjust servings on any recipe and watch all ingredient quantities recalculate live
- **Smart Shopping List (Market Mode)**: add ingredients from any recipe (with scaled quantities) to a hands-free shopping list, navigable on both web and G2 glasses with tap-to-check-off
- **Glass: Shopping screen**: scroll through your shopping list on the G2, tap to check/uncheck items
- **Collection filter**: filter the recipe library by collection on the home screen
- Shopping List added to the side drawer navigation

### Changed

- version bumped to 1.0.0

### Notes

- existing recipe data, imports, and local storage remain fully compatible
- shopping list data persists in localStorage / bridge storage

---

## 0.1.7

Released: 2026-04-03

No breaking changes.

### Changed

- aligned the app with `even-toolkit` 1.6.3 for shared bridge-only storage behavior
- recipe and settings mutations now persist immediately instead of waiting for a later effect flush

### Notes

- recipe libraries, imports, and cooking state remain compatible with previous 0.1.x releases

## 0.1.6

Released: 2026-04-02

No breaking changes.

### Changed

- aligned the app with `even-toolkit` 1.6.2 for the current shared web header/layout fixes
- GitHub releases are now part of the maintained release flow alongside the local changelog

### Notes

- recipe data, imports, and local storage remain compatible with previous 0.1.x releases


## 0.1.5

Released: 2026-04-02

No breaking changes.

### Added

- broad multi-language coverage across recipe library, cooking flow, completion screens, recipe forms, and settings
- clearer grouped recipe editing sections for recipe details, appearance, ingredients, and steps

### Changed

- settings is reorganized around language, AI provider, API keys, and data management
- recipe cards, library copy, detail actions, and AI import flows now use the shared translated copy surface

### Notes

- existing local recipes and imported JSON collections remain compatible with this release
