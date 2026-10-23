"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LocationHierarchy, SavedAddress } from "@/types";
import { CRAVE_DELIVERY_HUBS, verifyPincodeCoverage } from "@/data/indiaLocations";

interface LocationContextType {
  currentLocation: LocationHierarchy;
  savedAddresses: SavedAddress[];
  isLocationModalOpen: boolean;
  isDeliveryAvailable: boolean;
  setLocationModalOpen: (open: boolean) => void;
  setCurrentLocation: (loc: LocationHierarchy) => void;
  saveNewAddress: (addr: Omit<SavedAddress, "id">) => void;
  deleteAddress: (id: string) => void;
  selectSavedAddress: (addr: SavedAddress) => void;
}

const DEFAULT_LOCATION: LocationHierarchy = {
  state: "Maharashtra",
  district: "Mumbai Suburban",
  city: "Mumbai",
  locality: "Bandra West (Pali Hill & Carter Rd)",
  pincode: "400050",
  addressLine: "Hill Road, Bandra West"
};

const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-home",
    tag: "Home",
    recipientName: "Ritish Sharma",
    phone: "+91 98201 44521",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    city: "Mumbai",
    locality: "Bandra West (Pali Hill & Carter Rd)",
    pincode: "400050",
    addressLine: "Flat 402, Pali Palm Heights, Bandra West",
    isDefault: true
  },
  {
    id: "addr-work",
    tag: "Work",
    recipientName: "Ritish Sharma",
    phone: "+91 98201 44521",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    locality: "Indiranagar 100ft Road",
    pincode: "560038",
    addressLine: "Building 12, 100 Feet Road, Indiranagar",
    isDefault: false
  }
];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocationState] = useState<LocationHierarchy>(DEFAULT_LOCATION);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(INITIAL_SAVED_ADDRESSES);
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("crave_selected_location");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentLocationState(parsed);
        const { covered } = verifyPincodeCoverage(parsed.pincode);
        setIsDeliveryAvailable(covered);
      }
      const storedAddrs = localStorage.getItem("crave_saved_addresses");
      if (storedAddrs) {
        setSavedAddresses(JSON.parse(storedAddrs));
      }
    } catch {
      // fallback to default
    }
  }, []);

  const setCurrentLocation = (loc: LocationHierarchy) => {
    setCurrentLocationState(loc);
    const { covered } = verifyPincodeCoverage(loc.pincode);
    setIsDeliveryAvailable(covered);
    try {
      localStorage.setItem("crave_selected_location", JSON.stringify(loc));
    } catch {}
  };

  const saveNewAddress = (addr: Omit<SavedAddress, "id">) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: "addr-" + Date.now()
    };
    const updated = [newAddr, ...savedAddresses];
    setSavedAddresses(updated);
    try {
      localStorage.setItem("crave_saved_addresses", JSON.stringify(updated));
    } catch {}
    setCurrentLocation(newAddr);
  };

  const deleteAddress = (id: string) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    try {
      localStorage.setItem("crave_saved_addresses", JSON.stringify(updated));
    } catch {}
  };

  const selectSavedAddress = (addr: SavedAddress) => {
    setCurrentLocation(addr);
    setLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        savedAddresses,
        isLocationModalOpen,
        isDeliveryAvailable,
        setLocationModalOpen,
        setCurrentLocation,
        saveNewAddress,
        deleteAddress,
        selectSavedAddress
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
