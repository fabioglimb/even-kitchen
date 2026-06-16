import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { useParams, useNavigate } from "react-router";
import { useRecipeContext } from "../contexts/RecipeContext";
import { BottomActionBar, Button, Card, Input, MultiSelect, Select, Textarea, Toast, useDrawerHeader } from "even-toolkit/web";
import { IcEditAdd, IcTrash, IcFeatCamera, IcStatusGrabber } from "even-toolkit/web/icons/svg-icons";
import { generateId } from "../utils/format";
import { fileToThumbnailDataUrl } from "../utils/image";
import type { Recipe, Ingredient, Step } from "../types/recipe";
import { useTranslation } from "../hooks/useTranslation";

const FOOD_EMOJIS = [
  "\uD83C\uDF5D", "\uD83C\uDF55", "\uD83C\uDF54", "\uD83C\uDF2E", "\uD83C\uDF63",
  "\uD83C\uDF5B", "\uD83E\uDD5A", "\uD83E\uDD69", "\uD83C\uDF5C", "\uD83C\uDF72",
  "\uD83C\uDF70", "\uD83C\uDF6A", "\uD83E\uDD57", "\uD83C\uDF73", "\uD83C\uDF71",
  "\uD83C\uDF6B", "\uD83C\uDF53", "\uD83E\uDD50", "\uD83C\uDF5E", "\uD83E\uDDC1",
];

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

const COLOR_PRESETS = [
  "#e6b44c", "#f0c040", "#e07a5f", "#8b5e3c",
  "#6b9e78", "#5a7dba", "#9b6bb0", "#d4697a",
];

const DELETE_WIDTH = 72;
const SWIPE_THRESHOLD = 40;
const DIRECTION_LOCK_PX = 10;

const emptyIngredient = (): Ingredient => ({ name: "", amount: "", unit: "" });
const emptyStep = (): Step => ({ title: "", instructions: "" });

function parseNonNegativeInt(value: string, fallback = 0): number {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.round(parsed));
}

function parsePositiveInt(value: string, fallback = 1): number {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.round(parsed));
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 mb-1.5 flex items-center gap-2">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal uppercase">{children}</span>
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-3 py-3 border-b border-border last:border-b-0">
      <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] tracking-[-0.11px] text-text-dim font-normal">{children}</span>;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement
    && Boolean(target.closest('input, button, select, textarea, option, [role="button"], [data-no-swipe]'));
}

function SwipeDeleteCard({
  children,
  onDelete,
}: {
  children: ReactNode;
  onDelete?: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffset = useRef(0);
  const direction = useRef<'none' | 'horizontal' | 'vertical'>('none');

  const onTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!onDelete || isInteractiveTarget(e.target)) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentOffset.current = offset;
    direction.current = 'none';
    setSwiping(true);
  }, [offset, onDelete]);

  const onTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (!swiping || !onDelete) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (direction.current === 'none') {
      if (Math.abs(dx) > DIRECTION_LOCK_PX || Math.abs(dy) > DIRECTION_LOCK_PX) {
        direction.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
      return;
    }

    if (direction.current === 'vertical') return;
    setOffset(Math.min(0, Math.max(-DELETE_WIDTH, currentOffset.current + dx)));
  }, [onDelete, swiping]);

  const onTouchEnd = useCallback(() => {
    if (!swiping) return;
    setSwiping(false);
    if (direction.current === 'vertical') return;
    setOffset(offset < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0);
  }, [offset, swiping]);

  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    onDelete();
    setOffset(0);
    direction.current = 'none';
  }, [onDelete]);

  return (
    <div className="relative overflow-hidden">
      {onDelete && offset < 0 && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-negative text-text-highlight cursor-pointer"
          style={{ width: DELETE_WIDTH }}
        >
          <IcTrash width={18} height={18} />
        </button>
      )}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: swiping ? 'none' : 'transform 200ms ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes, collections, addRecipe, updateRecipe, addRecipeToCollection, removeRecipeFromCollection, getRecipeCollectionIds } = useRecipeContext();
  const { t } = useTranslation();
  const isEdit = Boolean(id);
  const existing = isEdit ? recipes.find((r) => r.id === id) : null;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [prepTimeInput, setPrepTimeInput] = useState("0");
  const [cookTimeInput, setCookTimeInput] = useState("0");
  const [servingsInput, setServingsInput] = useState("2");
  const [difficulty, setDifficulty] = useState("Easy");
  const [heroEmoji, setHeroEmoji] = useState("\uD83C\uDF5D");
  const [accentColor, setAccentColor] = useState("#e6b44c");
  const [ingredients, setIngredients] = useState<Ingredient[]>([emptyIngredient()]);
  const [steps, setSteps] = useState<Step[]>([emptyStep()]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  const [titleError, setTitleError] = useState(false);
  const [ingredientsError, setIngredientsError] = useState(false);
  const [stepsError, setStepsError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepDragRef = useRef<{ index: number; startClientY: number } | null>(null);
  const [stepDraggingIndex, setStepDraggingIndex] = useState<number | null>(null);
  const [stepDragOffset, setStepDragOffset] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSubtitle(existing.subtitle);
      setCategory(existing.category);
      setPrepTimeInput(String(existing.prepTime));
      setCookTimeInput(String(existing.cookTime));
      setServingsInput(String(existing.servings));
      setDifficulty(existing.difficulty);
      setHeroEmoji(existing.heroEmoji);
      setAccentColor(existing.accentColor);
      setIngredients(existing.ingredients.length > 0 ? existing.ingredients : [emptyIngredient()]);
      setSteps(existing.steps.length > 0 ? existing.steps : [emptyStep()]);
      setImages(existing.images ?? []);
      setSelectedCollectionIds(getRecipeCollectionIds(existing.id));
      return;
    }

    if (isEdit) navigate("/");
  }, [existing, isEdit, navigate]);

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  };

  const updateStep = (index: number, field: keyof Step, value: string | number | undefined) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const moveStep = useCallback((from: number, to: number) => {
    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const handleStepDragMove = useCallback((clientY: number) => {
    if (!stepDragRef.current) return;
    const { index, startClientY } = stepDragRef.current;
    const delta = clientY - startClientY;
    const refs = stepRefs.current;
    const dragged = refs[index];
    if (!dragged) return;
    const draggedRect = dragged.getBoundingClientRect();
    const draggedMidY = draggedRect.top + draggedRect.height / 2;

    if (index > 0) {
      const above = refs[index - 1];
      if (above) {
        const aboveRect = above.getBoundingClientRect();
        if (draggedMidY < aboveRect.top + aboveRect.height / 2) {
          const newStart = startClientY - aboveRect.height;
          stepDragRef.current = { index: index - 1, startClientY: newStart };
          setStepDraggingIndex(index - 1);
          setStepDragOffset(clientY - newStart);
          moveStep(index, index - 1);
          return;
        }
      }
    }
    if (index < steps.length - 1) {
      const below = refs[index + 1];
      if (below) {
        const belowRect = below.getBoundingClientRect();
        if (draggedMidY > belowRect.top + belowRect.height / 2) {
          const newStart = startClientY + belowRect.height;
          stepDragRef.current = { index: index + 1, startClientY: newStart };
          setStepDraggingIndex(index + 1);
          setStepDragOffset(clientY - newStart);
          moveStep(index, index + 1);
          return;
        }
      }
    }
    setStepDragOffset(delta);
  }, [moveStep, steps.length]);

  const handleStepDragEnd = useCallback(() => {
    stepDragRef.current = null;
    setStepDraggingIndex(null);
    setStepDragOffset(0);
  }, []);

  const onStepHandleTouchStart = useCallback((e: ReactTouchEvent, index: number) => {
    stepDragRef.current = { index, startClientY: e.touches[0].clientY };
    setStepDraggingIndex(index);
    setStepDragOffset(0);
  }, []);

  const onStepHandleTouchMove = useCallback((e: ReactTouchEvent) => {
    handleStepDragMove(e.touches[0].clientY);
  }, [handleStepDragMove]);

  useEffect(() => {
    if (stepDraggingIndex === null) return;
    const onMouseMove = (e: MouseEvent) => handleStepDragMove(e.clientY);
    const onMouseUp = () => handleStepDragEnd();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [stepDraggingIndex, handleStepDragMove, handleStepDragEnd]);

  const handleSave = () => {
    const titleInvalid = !title.trim();
    const ingredientsInvalid = !ingredients.some((i) => i.name.trim());
    const stepsInvalid = !steps.some((s) => s.instructions.trim());

    setTitleError(titleInvalid);
    setIngredientsError(ingredientsInvalid);
    setStepsError(stepsInvalid);

    if (titleInvalid) {
      setToast(t('form.errTitleRequired'));
      return;
    }
    if (ingredientsInvalid) {
      setToast(t('form.errIngredient'));
      return;
    }
    if (stepsInvalid) {
      setToast(t('form.errStep'));
      return;
    }

    const recipe: Recipe = {
      id: isEdit && existing ? existing.id : generateId(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      category: category.trim() || t('form.uncategorized'),
      prepTime: parseNonNegativeInt(prepTimeInput, 0),
      cookTime: parseNonNegativeInt(cookTimeInput, 0),
      servings: parsePositiveInt(servingsInput, 1),
      difficulty,
      heroEmoji,
      accentColor,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.title.trim() || s.instructions.trim()),
      ...(images.length > 0 ? { images } : {}),
    };

    if (isEdit) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
    }

    const previousCollectionIds = isEdit && existing ? getRecipeCollectionIds(existing.id) : [];
    const toAdd = selectedCollectionIds.filter((cid) => !previousCollectionIds.includes(cid));
    const toRemove = previousCollectionIds.filter((cid) => !selectedCollectionIds.includes(cid));
    for (const cid of toAdd) addRecipeToCollection(recipe.id, cid);
    for (const cid of toRemove) removeRecipeFromCollection(recipe.id, cid);

    navigate(`/recipe/${recipe.id}`);
  };

  useDrawerHeader({
    title: isEdit ? t('form.editRecipe') : t('form.newRecipe'),
    backTo: isEdit && id ? `/recipe/${id}` : '/',
  });

  return (
    <main className="px-3 pt-4 pb-0">
      <SectionLabel>{t('form.recipe')}</SectionLabel>
      <Card className="mb-4" padding="none">
        <FieldRow label={t('form.name')}>
          <Input
            placeholder={t('form.recipeName')}
            value={title}
            error={titleError}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError(false);
            }}
          />
        </FieldRow>
        <FieldRow label={t('form.description')}>
          <Input
            placeholder={t('form.descriptionPlaceholder')}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </FieldRow>
        <div className="grid grid-cols-2 gap-2 border-b border-border px-3 py-3">
          <div>
            <FieldLabel>{t('form.category')}</FieldLabel>
            <Input
              className="mt-1"
              placeholder={t('form.categoryPlaceholder')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>{t('form.difficulty')}</FieldLabel>
            <div className="mt-1">
              <Select
                options={[
                  { value: "Easy", label: t('form.easy') },
                  { value: "Medium", label: t('form.medium') },
                  { value: "Hard", label: t('form.hard') },
                ]}
                value={difficulty}
                onValueChange={setDifficulty}
              />
            </div>
          </div>
        </div>
        {collections.length > 0 && (
          <FieldRow label={t('form.cookbook')}>
            <MultiSelect
              options={collections.map((c) => ({ value: c.id, label: `${c.emoji} ${c.name}` }))}
              values={selectedCollectionIds}
              onValuesChange={(values) => setSelectedCollectionIds(values)}
              placeholder={t('form.selectCookbooks')}
            />
          </FieldRow>
        )}
        <div className="grid grid-cols-3 gap-2 px-3 py-3">
          <div>
            <FieldLabel>{t('form.prepMin')}</FieldLabel>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={prepTimeInput}
              onChange={(e) => setPrepTimeInput(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>{t('form.cookMin')}</FieldLabel>
            <Input
              className="mt-1"
              type="number"
              min={0}
              value={cookTimeInput}
              onChange={(e) => setCookTimeInput(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>{t('form.servings')}</FieldLabel>
            <Input
              className="mt-1"
              type="number"
              min={1}
              value={servingsInput}
              onChange={(e) => setServingsInput(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <SectionLabel>{t('form.appearance')}</SectionLabel>
      <Card className="mb-4" padding="none">
        <FieldRow label={t('form.emoji')}>
          <div className="flex flex-wrap gap-2" data-no-swipe>
            {FOOD_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setHeroEmoji(emoji)}
                style={{ fontFamily: EMOJI_FONT }}
                className={`w-10 h-10 rounded-[6px] text-[20px] flex items-center justify-center cursor-pointer transition-all ${
                  heroEmoji === emoji
                    ? "bg-accent/20 ring-2 ring-accent"
                    : "bg-surface hover:bg-surface-light"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </FieldRow>
        <FieldRow label={t('form.accentColor')}>
          <div className="flex flex-wrap gap-2" data-no-swipe>
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setAccentColor(color)}
                className={`w-10 h-10 rounded-[6px] cursor-pointer transition-all ${
                  accentColor === color ? "ring-2 ring-surface scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </FieldRow>
      </Card>

      <SectionLabel>{t('form.photos')}</SectionLabel>
      <Card className="mb-4" padding="none">
        <div className="px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {images.map((src, imgIdx) => (
              <div key={imgIdx} className="relative">
                <img src={src} alt="" className="w-12 h-12 object-cover rounded-[4px]" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, k) => k !== imgIdx))}
                  aria-label={t('form.removePhoto')}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-negative text-text-highlight flex items-center justify-center cursor-pointer"
                >
                  <IcTrash width={12} height={12} />
                </button>
              </div>
            ))}
            <label className="inline-flex items-center gap-2 px-3 h-9 rounded-[6px] bg-surface-light text-text text-[13px] tracking-[-0.13px] cursor-pointer hover:bg-surface-lighter">
              <IcFeatCamera width={16} height={16} />
              {images.length > 0 ? t('form.addAnotherPhoto') : t('form.addPhoto')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const dataUrl = await fileToThumbnailDataUrl(file);
                    setImages((prev) => [...prev, dataUrl]);
                  } catch {
                    // Ignore unreadable images
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </Card>

      <SectionLabel>{t('form.ingredients')}</SectionLabel>
      <Card className="mb-4" padding="none">
        {ingredients.map((ing, i) => (
          <SwipeDeleteCard
            key={i}
            onDelete={ingredients.length > 1 ? () => setIngredients((prev) => prev.filter((_, idx) => idx !== i)) : undefined}
          >
            <div className="bg-surface px-3 py-3 border-b border-border last:border-b-0">
              <div className="grid grid-cols-[minmax(0,1.8fr)_88px_88px] gap-2">
                <div data-no-swipe>
                  <FieldLabel>{t('form.name')}</FieldLabel>
                  <Input
                    className="mt-1"
                    placeholder={t('form.name')}
                    value={ing.name}
                    error={ingredientsError}
                    onChange={(e) => {
                      updateIngredient(i, "name", e.target.value);
                      if (ingredientsError) setIngredientsError(false);
                    }}
                  />
                </div>
                <div data-no-swipe>
                  <FieldLabel>{t('form.qty')}</FieldLabel>
                  <Input
                    className="mt-1"
                    placeholder={t('form.qty')}
                    value={ing.amount}
                    onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                  />
                </div>
                <div data-no-swipe>
                  <FieldLabel>{t('form.unit')}</FieldLabel>
                  <Input
                    className="mt-1"
                    placeholder={t('form.unit')}
                    value={ing.unit}
                    onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </SwipeDeleteCard>
        ))}
        <div className="px-3 py-3">
          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-center gap-2 bg-text text-text-highlight hover:bg-text/90 hover:text-text-highlight"
            onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
          >
            <IcEditAdd width={16} height={16} />
            {t('form.addIngredient')}
          </Button>
        </div>
      </Card>

      <SectionLabel>{t('form.steps')}</SectionLabel>
      <Card className="mb-4" padding="none">
        {steps.map((step, i) => {
          const isDragging = stepDraggingIndex === i;
          return (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              style={isDragging ? {
                transform: `translateY(${stepDragOffset}px)`,
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                willChange: 'transform',
              } : undefined}
            >
              <SwipeDeleteCard
                onDelete={steps.length > 1 ? () => setSteps((prev) => prev.filter((_, idx) => idx !== i)) : undefined}
              >
                <div className="bg-surface px-3 py-3 border-b border-border last:border-b-0">
                  <div className="flex items-start gap-2">
                    <div
                      className="flex items-center justify-center touch-none p-1 mt-1 shrink-0 cursor-grab"
                      onTouchStart={(e) => onStepHandleTouchStart(e, i)}
                      onTouchMove={onStepHandleTouchMove}
                      onTouchEnd={handleStepDragEnd}
                      onTouchCancel={handleStepDragEnd}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        stepDragRef.current = { index: i, startClientY: e.clientY };
                        setStepDraggingIndex(i);
                        setStepDragOffset(0);
                      }}
                    >
                      <IcStatusGrabber width={16} height={16} className="text-text-dim" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2">
                        <div data-no-swipe>
                          <FieldLabel>{t('form.title')}</FieldLabel>
                          <Input
                            className="mt-1"
                            placeholder={t('form.stepTitle')}
                            value={step.title}
                            onChange={(e) => updateStep(i, "title", e.target.value)}
                          />
                        </div>
                        <div data-no-swipe>
                          <FieldLabel>{t('form.timerSeconds')}</FieldLabel>
                          <Input
                            className="mt-1"
                            type="number"
                            min={0}
                            placeholder="0"
                            value={step.timerSeconds ?? ""}
                            onChange={(e) => updateStep(i, "timerSeconds", e.target.value === "" ? undefined : Number(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <div className="mt-2" data-no-swipe>
                        <FieldLabel>{t('form.instructions')}</FieldLabel>
                        <Textarea
                          className="mt-1 min-h-[72px]"
                          placeholder={t('form.instructions')}
                          value={step.instructions}
                          error={stepsError}
                          onChange={(e) => {
                            updateStep(i, "instructions", e.target.value);
                            if (stepsError) setStepsError(false);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwipeDeleteCard>
            </div>
          );
        })}
        <div className="px-3 py-3">
          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-center gap-2 bg-text text-text-highlight hover:bg-text/90 hover:text-text-highlight"
            onClick={() => setSteps((prev) => [...prev, emptyStep()])}
          >
            <IcEditAdd width={16} height={16} />
            {t('form.addStep')}
          </Button>
        </div>
      </Card>

      <BottomActionBar className="-mx-3 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" variant="secondary" className="w-full" onClick={() => navigate(isEdit && id ? `/recipe/${id}` : "/")}>
            {t('form.cancel')}
          </Button>
          <Button size="lg" className="w-full" onClick={handleSave}>
            {isEdit ? t('form.saveChanges') : t('form.createRecipe')}
          </Button>
        </div>
      </BottomActionBar>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-3">
          <Toast message={toast} variant="error" />
        </div>
      )}
    </main>
  );
}
