"use client";

import React, { useState } from "react";
import { X, MapPin, Home, Briefcase, Navigation, Check, Loader2 } from "lucide-react";
import { SavedAddress } from "@/types";
import { verifyPincodeCoverage } from "@/data/indiaLocations";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<SavedAddress, "id">) => void;
  defaultName?: string;
  defaultPhone?: string;
}

export function AddAddressModal({
  isOpen,
  onClose,
  onSave,
  defaultName = "Ritish Sharma",
  defaultPhone = "+91 98201 44521"
}: AddAddressModalProps) {
  const [recipientName, setRecipientName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [flatNo, setFlatNo] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("400050");
  const [tag, setTag] = useState<"Home" | "Work" | "Other">("Home");
  const [landmark, setLandmark] = useState("");
  const [coverageWarning, setCoverageWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePincodeChange = (val: string) => {
    setPincode(val);
    if (val.trim().length === 6) {
      const { covered, hub, locality: l } = verifyPincodeCoverage(val.trim());
      if (hub) {
        if (hub.state) setState(hub.state);
        if (hub.city) setCity(hub.city);
      }
      if (l) setLocality(l);
      if (!covered) {
        setCoverageWarning("Delivery to this PIN code might experience extended courier transit times.");
      } else {
        setCoverageWarning(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo.trim() || !locality.trim() || !pincode.trim()) return;

    const fullAddress = `${flatNo.trim()}, ${locality.trim()}${landmark ? ` (Near ${landmark.trim()})` : ""}`;
    onSave({
      tag,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      state: state.trim(),
      district: city.trim(),
      city: city.trim(),
      locality: locality.trim(),
      pincode: pincode.trim(),
      addressLine: fullAddress,
      isDefault: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-[#FAF8F5] p-6 sm:p-8 text-left shadow-2xl transition-all border border-[#EBE5DF] animate-in zoom-in-95">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 rounded-xl text-[#9E948C] hover:text-[#1A1715] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-[#FFF1EE] text-[#FF4D2D]">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-[#1A1715] font-sans">
                Add Delivery Address
              </h2>
            </div>
            <p className="text-xs text-[#766E65]">
              Accurate address details ensure rapid parcel dispatch and precision courier navigation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Tag Selection */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1.5">
                Address Tag
              </label>
              <div className="flex gap-2">
                {(["Home", "Work", "Other"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      tag === t
                        ? "bg-[#1A1715] text-white border-[#1A1715] shadow-xs"
                        : "bg-white text-[#766E65] border-[#E5DDD4] hover:bg-[#F3EFEA]"
                    }`}
                  >
                    {t === "Home" && <Home className="w-3.5 h-3.5" />}
                    {t === "Work" && <Briefcase className="w-3.5 h-3.5" />}
                    {t === "Other" && <Navigation className="w-3.5 h-3.5" />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Ritish Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 44521"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D]"
                />
              </div>
            </div>

            {/* Flat / Door No / Building */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                Flat / House / Floor / Building Name
              </label>
              <input
                type="text"
                required
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                placeholder="e.g. Flat 604, Tower B, Palm Grove Apts"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D]"
              />
            </div>

            {/* Locality & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  Locality / Street
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Pali Hill, Bandra West"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] focus:outline-hidden focus:border-[#FF4D2D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  6-Digit PIN Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="e.g. 400050"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715] font-mono font-bold focus:outline-hidden focus:border-[#FF4D2D]"
                />
              </div>
            </div>

            {coverageWarning && (
              <p className="text-[11px] text-[#D97706] font-medium bg-[#FFFBEB] p-2 rounded-xl border border-[#FDE68A]">
                ⚠️ {coverageWarning}
              </p>
            )}

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715]"
                />
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-[11px] font-bold text-[#1A1715] uppercase tracking-wider mb-1">
                Landmark / Delivery Direction <span className="text-[#9E948C] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Behind Olive Bar & Kitchen"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DDD4] text-xs text-[#1A1715]"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#F3EFEA] hover:bg-[#EBE5DF] text-[#1A1715] font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#FF4D2D] hover:bg-[#E03A1A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Address & Deliver Here</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
