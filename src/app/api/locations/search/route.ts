import { NextRequest, NextResponse } from "next/server";
import {
  INDIA_STATES_AND_UTS,
  checkPincodeDelivery,
  CRAVE_DELIVERY_HUBS,
} from "@/data/indiaLocations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode");
  const query = searchParams.get("query");
  const state = searchParams.get("state");

  // 1. Direct PIN code verification
  if (pincode) {
    const coverage = checkPincodeDelivery(pincode);
    return NextResponse.json({
      success: true,
      pincode,
      ...coverage,
    });
  }

  // 2. State-specific districts
  if (state) {
    const foundState = INDIA_STATES_AND_UTS.find(
      (s) => s.name.toLowerCase() === state.toLowerCase()
    );
    if (!foundState) {
      return NextResponse.json(
        { success: false, message: "State not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      state: foundState.name,
      districts: foundState.districts,
    });
  }

  // 3. Search states, districts, or hubs
  if (query) {
    const q = query.toLowerCase().trim();
    const matchedStates = INDIA_STATES_AND_UTS.filter((s) =>
      s.name.toLowerCase().includes(q)
    ).map((s) => ({ type: "state", name: s.name, districtsCount: s.districts.length }));

    const matchedDistricts: { state: string; district: string }[] = [];
    INDIA_STATES_AND_UTS.forEach((s) => {
      s.districts.forEach((d) => {
        if (d.toLowerCase().includes(q) && matchedDistricts.length < 15) {
          matchedDistricts.push({ state: s.name, district: d });
        }
      });
    });

    const matchedHubs = CRAVE_DELIVERY_HUBS.filter(
      (h) => h.city.toLowerCase().includes(q) || h.state.toLowerCase().includes(q)
    );

    return NextResponse.json({
      success: true,
      results: {
        states: matchedStates,
        districts: matchedDistricts,
        hubs: matchedHubs,
      },
    });
  }

  // Default: return all 36 States & UTs and major Delivery Hubs
  return NextResponse.json({
    success: true,
    totalStatesAndUTs: INDIA_STATES_AND_UTS.length,
    states: INDIA_STATES_AND_UTS.map((s) => ({
      name: s.name,
      isUnionTerritory: s.isUnionTerritory,
      districtsCount: s.districts.length,
    })),
    deliveryHubs: CRAVE_DELIVERY_HUBS,
  });
}
