import { NextRequest, NextResponse } from "next/server";
import { ALL_RESTAURANTS } from "@/data/restaurantsData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cuisine = searchParams.get("cuisine");
  const rating = searchParams.get("rating");
  const pincode = searchParams.get("pincode");
  const search = searchParams.get("search");

  let filtered = [...ALL_RESTAURANTS];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q))
    );
  }

  if (cuisine && cuisine !== "all") {
    filtered = filtered.filter((r) =>
      r.cuisine.some((c) => c.toLowerCase() === cuisine.toLowerCase())
    );
  }

  if (rating) {
    const minRating = parseFloat(rating);
    if (!isNaN(minRating)) {
      filtered = filtered.filter((r) => r.rating >= minRating);
    }
  }

  // Check delivery coverage if pincode is passed
  const results = filtered.map((r) => ({
    ...r,
    deliversToUser: pincode ? r.pincodesServed.includes(pincode) : true,
  }));

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}
