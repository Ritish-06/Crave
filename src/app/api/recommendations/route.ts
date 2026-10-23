import { NextRequest, NextResponse } from "next/server";
import { ALL_MENU_ITEMS } from "@/data/menuData";
import { MenuItem } from "@/types";

interface RecommendationRequest {
  mood?: string;
  dietary?: string;
  spicePreference?: number; // 1, 2, or 3
  budget?: number;
  occasion?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { mood, dietary, spicePreference, budget, occasion } = body;

    let candidates = [...ALL_MENU_ITEMS];

    // Dietary filter
    if (dietary && dietary !== "all") {
      candidates = candidates.filter((item) => item.dietary === dietary);
    }

    // Budget filter
    if (budget) {
      candidates = candidates.filter((item) => item.price <= budget);
    }

    // Score candidates based on mood, spice, and rating
    const scored = candidates.map((item) => {
      let score = item.rating * 10;

      // Mood match
      if (mood) {
        const m = mood.toLowerCase();
        if (item.category.toLowerCase().includes(m)) score += 25;
        if (item.description.toLowerCase().includes(m)) score += 15;
      }

      // Occasion match
      if (occasion) {
        const occ = occasion.toLowerCase();
        if (occ.includes("late") && (item.category === "Gourmet Burgers" || item.category === "Artisanal Pizzas")) {
          score += 20;
        }
        if (occ.includes("date") && (item.isChefSpecial || item.category === "European & Pasta")) {
          score += 25;
        }
        if (occ.includes("comfort") && (item.cuisine === "Awadhi" || item.cuisine === "Indian")) {
          score += 20;
        }
      }

      // Spice level affinity
      if (spicePreference && item.spiceLevel) {
        const diff = Math.abs(spicePreference - item.spiceLevel);
        score += (3 - diff) * 8;
      }

      // 3D Studio bonus for interactive delight
      if (item.studioEnabled) score += 10;

      // Chef special / Trending bonus
      if (item.isChefSpecial) score += 8;
      if (item.isTrending) score += 6;

      // Tasting note generator
      let tastingNote = `Curated for your palate. Paired with aromatic hints and authentic ${item.cuisine} culinary craftsmanship.`;
      if (item.studioEnabled) {
        tastingNote = `Customizable in 3D Dish Studio! Features chef-grade brioche, layered melted cheeses, and our signature truffle emulsions.`;
      } else if (item.dietary === "veg") {
        tastingNote = `Pure vegetarian delicacy crafted with farm-sourced ingredients and delicate herbal balance.`;
      }

      return {
        item,
        score,
        tastingNote,
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    const topRecommendations = scored.slice(0, 6);

    return NextResponse.json({
      success: true,
      count: topRecommendations.length,
      recommendations: topRecommendations,
      sommelierMessage: `Based on your mood '${mood || "Eclectic"}' and preference for ${
        dietary ? dietary.toUpperCase() : "all cuisines"
      }, our CRAVE AI Sommelier has prepared an exquisite selection.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error calculating recommendations." },
      { status: 500 }
    );
  }
}
