/**
 * Food Identity & Saved Bites — shared client-side preference storage.
 *
 * Every option here maps to a real field on MenuItem, so anything the user sets
 * can actually be applied by /recommendations. No sensitive data is stored.
 */
import { MENU_ITEMS } from "@/data/menuData";
import { MenuItem } from "@/types";

export const FOOD_IDENTITY_KEY = "crave_user_food_identity";
export const SAVED_DISHES_KEY = "crave_saved_dishes";

/** Cuisines that actually exist on the menu. */
export const MENU_CUISINES: string[] = Array.from(new Set(MENU_ITEMS.map((m) => m.cuisine)));

export type DietPreference = "any" | "vegetarian" | "vegan";
export type SpiceTolerance = 1 | 2 | 3;

export interface FoodIdentity {
  cuisines: string[];
  /** Maximum price per dish in ₹; null means no cap. */
  maxDishPrice: number | null;
  diet: DietPreference;
  spiceTolerance: SpiceTolerance;
  updatedAt: string;
}

export const BUDGET_BRACKETS: { label: string; range: string; maxDishPrice: number | null }[] = [
  { label: "Pocket friendly", range: "Up to ₹250", maxDishPrice: 250 },
  { label: "Everyday", range: "Up to ₹500", maxDishPrice: 500 },
  { label: "No limit", range: "Any price", maxDishPrice: null }
];

export const SPICE_LEVELS: { level: SpiceTolerance; label: string }[] = [
  { level: 1, label: "Mild" },
  { level: 2, label: "Medium" },
  { level: 3, label: "Hot" }
];

export const DIET_OPTIONS: { id: DietPreference; label: string }[] = [
  { id: "any", label: "No restriction" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" }
];

export function loadFoodIdentity(): FoodIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FOOD_IDENTITY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FoodIdentity>;
    // Ignore data saved by the earlier, incompatible format.
    if (!Array.isArray(parsed.cuisines) || parsed.spiceTolerance === undefined || parsed.diet === undefined) {
      return null;
    }
    return {
      cuisines: parsed.cuisines.filter((c) => MENU_CUISINES.includes(c)),
      maxDishPrice: parsed.maxDishPrice ?? null,
      diet: parsed.diet,
      spiceTolerance: parsed.spiceTolerance,
      updatedAt: parsed.updatedAt ?? new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export function saveFoodIdentity(identity: FoodIdentity): void {
  try {
    localStorage.setItem(FOOD_IDENTITY_KEY, JSON.stringify(identity));
  } catch {
    /* storage unavailable (private mode / quota) — preferences stay in memory */
  }
}

export function matchesDiet(item: MenuItem, diet: DietPreference): boolean {
  if (diet === "vegan") return item.dietary === "vegan";
  if (diet === "vegetarian") return item.dietary === "veg" || item.dietary === "vegan";
  return true;
}

export function loadSavedDishIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_DISHES_KEY);
    const ids: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(ids)) return [];
    // Drop IDs that don't exist on the menu (e.g. stale data).
    return ids.filter((id): id is string => typeof id === "string" && MENU_ITEMS.some((m) => m.id === id));
  } catch {
    return [];
  }
}

export function saveSavedDishIds(ids: string[]): void {
  try {
    localStorage.setItem(SAVED_DISHES_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}
