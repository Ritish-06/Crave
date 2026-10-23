"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building2,
  Home as HomeIcon,
  Briefcase,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { useLocation } from "@/context/LocationContext";
import {
  INDIA_STATES_AND_UTS,
  CRAVE_DELIVERY_HUBS,
  getDistrictsForState,
  searchLocations,
  verifyPincodeCoverage
} from "@/data/indiaLocations";
import { SavedAddress } from "@/types";

export function IndiaLocationModal() {
  const {
    isLocationModalOpen,
    setLocationModalOpen,
    currentLocation,
    setCurrentLocation,
    savedAddresses,
    saveNewAddress,
    selectSavedAddress
  } = useLocation();

  const [activeTab, setActiveTab] = useState<"search" | "hierarchy" | "saved">("search");
  const [searchQuery, setSearchQuery] = useState("");

  // Dependent Hierarchy Selectors
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Mumbai Suburban");
  const [manualCity, setManualCity] = useState("Mumbai");
  const [manualLocality, setManualLocality] = useState("Bandra West");
  const [manualPincode, setManualPincode] = useState("400050");
  const [addressLine, setAddressLine] = useState("");
  const [newTag, setNewTag] = useState<"Home" | "Work" | "Other">("Home");

  // Get districts for current selected state
  const availableDistricts = useMemo(() => {
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  // Handle search results
  const searchResults = useMemo(() => {
    return searchLocations(searchQuery);
  }, [searchQuery]);

  // When state changes, reset child district
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = getDistrictsForState(newState);
    const firstDistrict = districts[0] || "";
    setSelectedDistrict(firstDistrict);
    
    // Check if there is a hub for this state
    const hub = CRAVE_DELIVERY_HUBS.find(h => h.state.toLowerCase() === newState.toLowerCase());
    if (hub) {
      setManualCity(hub.city);
      setManualLocality(hub.localities[0]?.name || "");
      setManualPincode(hub.localities[0]?.pincode || "");
    } else {
      setManualCity(firstDistrict);
      setManualLocality(firstDistrict);
      setManualPincode("");
    }
  };

  // When district changes
  const handleDistrictChange = (newDist: string) => {
    setSelectedDistrict(newDist);
    const hub = CRAVE_DELIVERY_HUBS.find(
      h => h.state.toLowerCase() === selectedState.toLowerCase() && h.district.toLowerCase() === newDist.toLowerCase()
    );
    if (hub) {
      setManualCity(hub.city);
      setManualLocality(hub.localities[0]?.name || "");
      setManualPincode(hub.localities[0]?.pincode || "");
    } else {
      setManualCity(newDist);
      setManualLocality(newDist);
    }
  };

  const handleApplyHierarchy = () => {
    setCurrentLocation({
      state: selectedState,
      district: selectedDistrict,
      city: manualCity || selectedDistrict,
      locality: manualLocality || selectedDistrict,
      pincode: manualPincode,
      addressLine: addressLine.trim() || undefined
    });
    setLocationModalOpen(false);
  };

  const handleSaveAndApply = () => {
    saveNewAddress({
      state: selectedState,
      district: selectedDistrict,
      city: manualCity || selectedDistrict,
      locality: manualLocality || selectedDistrict,
      pincode: manualPincode,
      addressLine: addressLine.trim() || `${manualLocality}, ${manualCity}`,
      tag: newTag,
      recipientName: "Customer",
      phone: "+91 98765 43210",
      isDefault: false
    });
    setLocationModalOpen(false);
  };

  if (!isLocationModalOpen) return null;

  const currentCoverage = verifyPincodeCoverage(manualPincode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBE5DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FFF1EE] text-[#FF4D2D]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1715]">Select Delivery Location</h2>
              <p className="text-xs text-[#766E65]">
                Covering all 28 Indian States & 8 Union Territories
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="p-2 rounded-xl text-[#9E948C] hover:text-[#1A1715] hover:bg-[#F3EFEA] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#EBE5DF] bg-[#F4EFEA] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("search")}
            className={`pb-3 px-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "search"
                ? "border-[#FF4D2D] text-[#FF4D2D]"
                : "border-transparent text-[#766E65] hover:text-[#1A1715]"
            }`}
          >
            Instant Search & PIN
          </button>
          <button
            onClick={() => setActiveTab("hierarchy")}
            className={`pb-3 px-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "hierarchy"
                ? "border-[#FF4D2D] text-[#FF4D2D]"
                : "border-transparent text-[#766E65] hover:text-[#1A1715]"
            }`}
          >
            Browse by State & District
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 px-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "saved"
                ? "border-[#FF4D2D] text-[#FF4D2D]"
                : "border-transparent text-[#766E65] hover:text-[#1A1715]"
            }`}
          >
            Saved Addresses ({savedAddresses.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: Instant Search */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E948C]" />
                <input
                  type="text"
                  placeholder="Search locality, PIN code (e.g. 400050, 560038), city or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-[#E5DDD4] text-[#1A1715] placeholder-[#9E948C] text-sm focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D] transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#9E948C] hover:text-[#1A1715]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {searchQuery.trim().length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#766E65]">Search Results</p>
                  {searchResults.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-white border border-[#EBE5DF]">
                      <AlertCircle className="w-8 h-8 text-[#9E948C] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-[#1A1715]">No locations found</p>
                      <p className="text-xs text-[#766E65] mt-1">
                        Try searching by state, district, or 6-digit PIN code.
                      </p>
                    </div>
                  ) : (
                    searchResults.map((res, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setCurrentLocation({
                            state: res.state,
                            district: res.district,
                            city: res.city,
                            locality: res.locality,
                            pincode: res.pincode
                          });
                          setLocationModalOpen(false);
                        }}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#FFF5F2] border border-[#EBE5DF] hover:border-[#FFD9D1] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${res.hasDelivery ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#F3EFEA] text-[#9E948C]"}`}>
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#1A1715] group-hover:text-[#FF4D2D]">
                                {res.title}
                              </span>
                              {res.hasDelivery ? (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ECFDF5] text-[#16A34A] rounded-md">
                                  Delivery Available
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[10px] font-medium bg-[#F3EFEA] text-[#766E65] rounded-md">
                                  Catalog Only
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#766E65] mt-0.5">{res.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#9E948C] group-hover:text-[#FF4D2D] transition-transform group-hover:translate-x-0.5" />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#766E65]">Popular CRAVE Delivery Hubs</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CRAVE_DELIVERY_HUBS.map((hub) => (
                      <div
                        key={hub.city}
                        onClick={() => {
                          const primaryLoc = hub.localities[0];
                          setCurrentLocation({
                            state: hub.state,
                            district: hub.district,
                            city: hub.city,
                            locality: primaryLoc.name,
                            pincode: primaryLoc.pincode
                          });
                          setLocationModalOpen(false);
                        }}
                        className="p-3 rounded-2xl bg-white hover:bg-[#FFF5F2] border border-[#EBE5DF] hover:border-[#FFD9D1] cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#FFF1EE] text-[#FF4D2D]">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1A1715]">{hub.city}</p>
                            <p className="text-[11px] text-[#766E65] truncate max-w-[160px]">
                              {hub.localities[0]?.name}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded-md">
                          Live
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Hierarchy Selectors */}
          {activeTab === "hierarchy" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* State / UT */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1715] mb-1.5">
                    State / Union Territory (All 28 + 8)
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-sm text-[#1A1715] focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]"
                  >
                    <optgroup label="28 States">
                      {INDIA_STATES_AND_UTS.filter(s => !s.isUnionTerritory).map(s => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="8 Union Territories">
                      {INDIA_STATES_AND_UTS.filter(s => s.isUnionTerritory).map(s => (
                        <option key={s.name} value={s.name}>{s.name} (UT)</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-xs font-bold text-[#1A1715] mb-1.5">
                    District ({availableDistricts.length} recorded)
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-sm text-[#1A1715] focus:border-[#FF4D2D] focus:ring-1 focus:ring-[#FF4D2D]"
                  >
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City and PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1715] mb-1.5">City / Locality</label>
                  <input
                    type="text"
                    value={manualLocality}
                    onChange={(e) => setManualLocality(e.target.value)}
                    placeholder="e.g. Indiranagar, Bandra West"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-sm text-[#1A1715]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1715] mb-1.5">PIN Code (6 digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={manualPincode}
                    onChange={(e) => setManualPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 400050"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-sm text-[#1A1715]"
                  />
                </div>
              </div>

              {/* Delivery Coverage Badge */}
              <div className={`p-3.5 rounded-2xl flex items-start gap-3 ${currentCoverage.covered ? "bg-[#ECFDF5] border border-[#A7F3D0]" : "bg-[#FFF8F1] border border-[#FDE68A]"}`}>
                {currentCoverage.covered ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[#065F46]">Delivery Available in this PIN code</p>
                      <p className="text-[#047857] mt-0.5">
                        Served by CRAVE {currentCoverage.hub?.city} artisanal kitchens. Fast delivery under 30 minutes!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[#92400E]">Delivery currently unserviceable at this exact PIN</p>
                      <p className="text-[#B45309] mt-0.5">
                        You can still explore menus and 3D Studio customization. Full delivery coverage is expanding soon.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Address Line and Save */}
              <div className="space-y-3 pt-2 border-t border-[#EBE5DF]">
                <div>
                  <label className="block text-xs font-bold text-[#1A1715] mb-1.5">
                    Street Address / Flat / Floor (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="e.g. Flat 301, Silver Sands Apartments, 12th Road"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-sm text-[#1A1715]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#766E65]">Address Tag:</span>
                  {(["Home", "Work", "Other"] as const).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewTag(tag)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        newTag === tag ? "bg-[#1A1715] text-white" : "bg-[#F3EFEA] text-[#766E65]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleApplyHierarchy}
                  className="flex-1 py-3 rounded-2xl bg-[#1A1715] text-white font-bold text-sm hover:bg-black transition-colors"
                >
                  Set as Active Location
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndApply}
                  className="flex-1 py-3 rounded-2xl bg-[#FF4D2D] text-white font-bold text-sm hover:bg-[#E03A1A] transition-colors"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === "saved" && (
            <div className="space-y-3">
              {savedAddresses.map((addr) => {
                const isSelected =
                  currentLocation.pincode === addr.pincode &&
                  currentLocation.locality === addr.locality;
                return (
                  <div
                    key={addr.id}
                    onClick={() => selectSavedAddress(addr)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? "bg-[#FFF5F2] border-[#FF4D2D] ring-1 ring-[#FF4D2D]"
                        : "bg-white border-[#EBE5DF] hover:border-[#D5CDC4]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#F3EFEA] text-[#1A1715] shrink-0">
                        {addr.tag === "Home" ? (
                          <HomeIcon className="w-4 h-4" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1A1715]">{addr.tag}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-[#FF4D2D] bg-[#FFF1EE] px-1.5 py-0.5 rounded-sm">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1A1715] font-medium mt-1">{addr.addressLine}</p>
                        <p className="text-xs text-[#766E65]">
                          {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[11px] text-[#9E948C] mt-1">Contact: {addr.phone}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF4D2D] shrink-0" />
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setActiveTab("hierarchy")}
                className="w-full py-3 rounded-2xl border border-dashed border-[#D5CDC4] text-[#766E65] hover:text-[#1A1715] hover:border-[#1A1715] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add New Delivery Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
