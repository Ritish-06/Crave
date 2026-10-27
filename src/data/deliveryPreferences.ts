import { DeliveryPreferenceType } from "@/types";
import {
  Bell,
  DoorOpen,
  UserCheck,
  PhoneCall,
  MessageSquare,
  VolumeX,
} from "lucide-react";
import React from "react";

export interface DeliveryPreferenceConfig {
  id: DeliveryPreferenceType;
  emoji: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  isContactless?: boolean;
  contactlessNote?: string;
}

export const DELIVERY_PREFERENCES_CONFIG: DeliveryPreferenceConfig[] = [
  {
    id: "RING_BELL",
    emoji: "🔔",
    title: "Ring the Bell",
    description: "Ring the doorbell when arriving.",
    icon: Bell,
    tag: "Standard",
  },
  {
    id: "LEAVE_AT_DOORSTEP",
    emoji: "🚪",
    title: "Leave at Doorstep",
    description: "Leave the order at the specified doorstep and notify me.",
    icon: DoorOpen,
    tag: "Contactless",
    isContactless: true,
    contactlessNote:
      "Contactless Delivery: Your delivery partner will leave the order at your doorstep and notify you.",
  },
  {
    id: "HAND_TO_ME",
    emoji: "🙋",
    title: "Hand It to Me",
    description: "Hand the order directly to me.",
    icon: UserCheck,
    tag: "In-Person",
  },
  {
    id: "CALL_ON_ARRIVAL",
    emoji: "📞",
    title: "Call When Arrived",
    description: "Call me when reaching the delivery location.",
    icon: PhoneCall,
    tag: "Phone Alert",
  },
  {
    id: "TEXT_ON_ARRIVAL",
    emoji: "📱",
    title: "Text Me on Arrival",
    description: "Send a message when the delivery partner arrives.",
    icon: MessageSquare,
    tag: "SMS / WhatsApp",
  },
  {
    id: "NO_RING_OR_KNOCK",
    emoji: "🤫",
    title: "Don’t Ring or Knock",
    description: "Leave the order quietly at the doorstep.",
    icon: VolumeX,
    tag: "Silent / Quiet",
    isContactless: true,
    contactlessNote:
      "Silent Delivery: Your delivery partner will leave the parcel at the door without ringing or knocking.",
  },
];

export function getDeliveryPreferenceMeta(preferenceId?: string | null): DeliveryPreferenceConfig {
  const found = DELIVERY_PREFERENCES_CONFIG.find((p) => p.id === preferenceId);
  return (
    found || {
      id: "RING_BELL",
      emoji: "🔔",
      title: "Ring the Bell",
      description: "Ring the doorbell when arriving.",
      icon: Bell,
      tag: "Standard",
    }
  );
}
