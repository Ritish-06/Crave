"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Bookmark,
  Plus,
  Trash2,
  X,
  Check,
  Star,
  ArrowRight,
  FolderPlus
} from "lucide-react";
import { Restaurant } from "@/types";

interface PersonalCollectionsModalProps {
  restaurants: Restaurant[];
  isOpen: boolean;
  onClose: () => void;
  onViewMenu: (restaurant: Restaurant) => void;
}

export interface Collection {
  id: string;
  name: string;
  restaurantIds: string[];
}

export function PersonalCollectionsModal({
  restaurants,
  isOpen,
  onClose,
  onViewMenu,
}: PersonalCollectionsModalProps) {
  const [collections, setCollections] = useState<Collection[]>([
    { id: "col-1", name: "Weekend Favorites", restaurantIds: ["rst-1", "rst-2"] },
    { id: "col-2", name: "Date Night Cravings", restaurantIds: ["rst-2", "rst-6"] },
    { id: "col-3", name: "Family Dum Feasts", restaurantIds: ["rst-3"] },
  ]);

  const [activeCollectionId, setActiveCollectionId] = useState<string>("col-1");
  const [newCollectionName, setNewCollectionName] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("crave_restaurant_collections");
      if (saved) {
        setCollections(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveCollections = (updated: Collection[]) => {
    setCollections(updated);
    try {
      localStorage.setItem("crave_restaurant_collections", JSON.stringify(updated));
    } catch {}
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      restaurantIds: [],
    };
    const updated = [...collections, newCol];
    saveCollections(updated);
    setActiveCollectionId(newCol.id);
    setNewCollectionName("");
  };

  const handleRemoveFromCollection = (collectionId: string, restaurantId: string) => {
    const updated = collections.map((col) => {
      if (col.id !== collectionId) return col;
      return {
        ...col,
        restaurantIds: col.restaurantIds.filter((id) => id !== restaurantId),
      };
    });
    saveCollections(updated);
  };

  if (!isOpen) return null;

  const activeCollection = collections.find((c) => c.id === activeCollectionId) || collections[0];
  const savedRestaurants = restaurants.filter((r) =>
    activeCollection?.restaurantIds.includes(r.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE5DF] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-[#140E0A] text-white flex items-center justify-between border-b border-[#2A1F18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4D2D] text-white flex items-center justify-center shadow-lg shadow-[#FF4D2D]/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4D2D] bg-[#1C1511] px-2 py-0.5 rounded border border-[#2A1F18]">
                Personal Lists
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Curated Food Collections
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1C1511] hover:bg-[#2A1F18] text-[#A3988E] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Collection Tab Selector & New Collection Creator */}
          <div className="p-4 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#766E65]">
                Your Saved Lists
              </span>

              {/* Add Collection Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New collection title..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
                  className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5DDD4] rounded-xl focus:outline-none focus:border-[#FF4D2D] w-40"
                />
                <button
                  onClick={handleCreateCollection}
                  className="px-3 py-1.5 rounded-xl bg-[#1A1715] hover:bg-[#2A2420] text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create</span>
                </button>
              </div>
            </div>

            {/* Collection Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {collections.map((col) => {
                const isSelected = col.id === activeCollectionId;
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveCollectionId(col.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? "bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-xs"
                        : "bg-[#FAF8F5] text-[#554C43] border-[#EBE5DF] hover:bg-[#F3EFEA]"
                    }`}
                  >
                    <span>{col.name}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#EBE5DF] text-[#766E65]"
                      }`}
                    >
                      {col.restaurantIds.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Restaurants in this Collection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1A1715]">
              Kitchens in &quot;{activeCollection?.name}&quot; ({savedRestaurants.length})
            </h3>

            {savedRestaurants.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-dashed border-[#EBE5DF] text-[#766E65] space-y-2">
                <Bookmark className="w-8 h-8 text-[#9E948C] mx-auto" />
                <p className="text-xs">No restaurants saved in this collection yet.</p>
                <p className="text-[11px] text-[#9E948C]">
                  Click the heart icon on any restaurant card to bookmark it here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedRestaurants.map((rst) => (
                  <div
                    key={rst.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#EBE5DF] shadow-xs flex items-center justify-between gap-4 hover:border-[#FF4D2D]/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#1C1511] shrink-0">
                        <Image src={rst.coverImage} alt={rst.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1715]">{rst.name}</h4>
                        <p className="text-xs text-[#766E65]">{rst.city} • {rst.cuisine.slice(0, 2).join(", ")}</p>
                        <div className="flex items-center gap-2 text-[11px] text-[#9E948C] pt-0.5">
                          <span className="text-[#FF4D2D] font-bold">★ {rst.rating}</span>
                          <span>•</span>
                          <span>₹{rst.priceForTwo} for 2</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onViewMenu(rst);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#1A1715] hover:bg-[#FF4D2D] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Menu
                      </button>
                      <button
                        onClick={() => handleRemoveFromCollection(activeCollection.id, rst.id)}
                        className="p-2 rounded-xl text-[#9E948C] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove from collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EBE5DF] flex items-center justify-between">
          <span className="text-xs text-[#766E65]">
            Saved to local storage on your device
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DDD4] hover:bg-[#EBE5DF] text-xs font-bold text-[#1A1715] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
