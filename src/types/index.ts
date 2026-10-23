export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'egg';

export interface LocationHierarchy {
  state: string;
  district: string;
  city: string;
  locality: string;
  pincode: string;
  addressLine?: string;
}

export interface SavedAddress extends LocationHierarchy {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  recipientName: string;
  phone: string;
  isDefault?: boolean;
}

export interface MenuItemOptionGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect: number;
  options: {
    id: string;
    name: string;
    price: number;
    default?: boolean;
    calories?: number;
    meshKey?: string;
  }[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  dietary: DietaryType;
  cuisine: string;
  category: string;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  isPopular?: boolean;
  isTrending?: boolean;
  isChefSpecial?: boolean;
  isCustomizable?: boolean;
  studioEnabled?: boolean;
  calories?: number;
  allergens?: string[];
  spiceLevel?: 1 | 2 | 3;
  optionGroups?: MenuItemOptionGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  cuisine: string[];
  rating: number;
  ratingCount: number;
  priceForTwo: number;
  prepTimeMinutes: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  coverImage: string;
  logoImage: string;
  address: string;
  city: string;
  state: string;
  pincodesServed: string[];
  isOpen: boolean;
  safetyRating: number;
  featuredDishes: string[];
  offers: string[];
}

export interface BurgerCustomizationState {
  bun: 'brioche' | 'sesame' | 'charcoal' | 'gluten-free';
  pattyCount: 1 | 2 | 3;
  pattyType: 'wagyu' | 'crispy-chicken' | 'plant-protein' | 'paneer-steak';
  cheese: 'cheddar' | 'swiss-gouda' | 'smoked-provolone' | 'none';
  veggies: {
    lettuce: boolean;
    tomato: boolean;
    onion: boolean;
    pickles: boolean;
    jalapenos: boolean;
  };
  sauces: {
    truffleMayo: boolean;
    chipotleBbq: boolean;
    craveSpecial: boolean;
    ghostPepper: boolean;
  };
  extras: {
    caramelizedOnions: boolean;
    friedEgg: boolean;
    crispyShallots: boolean;
  };
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customization?: BurgerCustomizationState;
  customizationSummary?: string[];
  unitPrice: number; // validated base + add-ons
  totalPrice: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  restaurantId: string;
  restaurantName: string;
  deliveryAddress: SavedAddress;
  paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
  paymentStatus: 'paid' | 'pending' | 'failed';
  estimatedDeliveryTime: string;
  riderName?: string;
  riderPhone?: string;
  riderLat?: number;
  riderLng?: number;
}
