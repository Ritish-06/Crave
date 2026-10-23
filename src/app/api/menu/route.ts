import { NextRequest, NextResponse } from "next/server";
import { ALL_MENU_ITEMS } from "@/data/menuData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");
  const category = searchParams.get("category");
  const dietary = searchParams.get("dietary");
  const studioOnly = searchParams.get("studioOnly");
  const search = searchParams.get("search");
  const maxPrice = searchParams.get("maxPrice");

  let filtered = [...ALL_MENU_ITEMS];

  if (restaurantId) {
    filtered = filtered.filter((item) => item.restaurantId === restaurantId);
  }

  if (category && category !== "all") {
    filtered = filtered.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (dietary && dietary !== "all") {
    filtered = filtered.filter((item) => item.dietary === dietary);
  }

  if (studioOnly === "true") {
    filtered = filtered.filter((item) => item.studioEnabled);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q) ||
        item.restaurantName.toLowerCase().includes(q)
    );
  }

  if (maxPrice) {
    const priceLimit = parseFloat(maxPrice);
    if (!isNaN(priceLimit)) {
      filtered = filtered.filter((item) => item.price <= priceLimit);
    }
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered,
  });
}
