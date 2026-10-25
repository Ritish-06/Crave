# 🍔 CRAVE — "Every Bite, An Experience."

> **India's Premier Luxury AI-Powered Culinary Discovery & Food Delivery Platform**

CRAVE is a full-stack, modular monolith food platform engineered with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Three.js WebGL**. It features procedural 3D ingredient customization, India-wide administrative location discovery, collaborative group ordering, live kitchen dispatch, and cinematic scroll storytelling.

---

## 🌟 Key Platform Capabilities

### 1. 🎨 Procedural 3D Dish Studio & AR QuickLook (`/studio`)
- **Interactive WebGL Engine**: Direct Three.js PBR procedural shaders rendering customizable brioche buns, smashed wagyu patties, melted cheeses, farm-fresh veggies, and gourmet sauces.
- **Dynamic Bun Toasting Controls**: 4-level procedural toast engine (*Soft Warm, Artisan Golden, Caramelized Butter, Charred Rustic*) generating realistic toast rings and grill marks on bun cuts.
- **Realistic Patty Textures & Doneness**: Multi-craft patty selection (*Japanese Wagyu, Crispy Buttermilk Chicken, Plant-Protein, Paneer Cottage Steak*) with procedural bump maps, searing crust lines, and doneness options (*Medium Rare, Medium Well, Crispy Smashed*).
- **Live 3D Sauce Drizzle Layer**: Real-time glossy 3D ribbons and dripping beads over patties (*Crave Black Truffle Aioli, Smoked Chipotle BBQ Glaze, Fiery Bhut Jolokia Glaze, Crave Secret Sauce*).
- **Four Cinematic Camera Presets**: One-click smooth camera interpolation for *Hero View*, *Isometric 3/4*, *Top-Down Stack*, and *Macro Patty Zoom*.
- **Augmented Reality (AR) Preview Modal**: Branded scannable AR QR code for 1:1 life-size placement on mobile (iOS AR QuickLook & Android WebXR) plus an interactive **Desktop AR Tabletop Simulator** with ambient lighting controls (Warm Dining 3200K, Daylight 5500K, Night Lounge).
- **Exploded vs. Assembled Views**: Inspect every layer vertically with interactive layer jumpers or assemble into a finished smash burger.
- **Cinematic Parabolic Flight**: Adding dishes animates a flying projectile across the screen directly into the navigation cart.

### 2. 🎬 Cinematic Explore Experience (`/explore`)
- **Scroll-Driven Horizontal Food Gallery**: Pinned editorial gallery using **GSAP ScrollTrigger** transitioning horizontal cards on vertical scroll.
- **Signature 3D Burger Assembly Reveal**: Interactive Three.js burger that assembles dynamically as the user scrolls into view.
- **Mood-to-Meal Discovery**: Emotional craving cards (*Comfort Food, Spicy Cravings, Fresh & Light, Cheesy Goodness, Sweet Escape, Quick Hunger Fix*) with instant live food filtering.
- **Interactive Food Cards**: Hover zoom, card elevation, persistent favorites, quick-view modal, and authoritative pricing.

### 3. 🇮🇳 India-Wide Location Engine
- **Full Administrative Hierarchy**: Indexes all **28 States and 8 Union Territories** across 780+ official districts.
- **Metro Hub Coverage**: Verified delivery logistics across Mumbai, Bengaluru, Delhi NCR, Gurugram, Hyderabad, and Pune with instant 6-digit PIN code lookup.

### 4. 👥 Collaborative Group Order Room (`/group-order`)
- **Multi-Participant Split Room**: Shareable session codes (`CRAVE-TEAM-942`) allowing friends to order together from the same kitchen.
- **Smart Bill Calculator**: Real-time switching between **"Split Equally"** and **"Pay by Item"** (itemized breakdown including proportional 5% GST and packaging fee).

### 5. 👨‍🍳 Kitchen Partner KDS & 86-Item Manager (`/kitchen`)
- **Real-Time Kanban Dispatch**: Live order pipeline (*Incoming &rarr; Cooking KDS &rarr; Ready for Pickup &rarr; Dispatched*).
- **Instant 86-Item Inventory Manager**: Real-time toggle to mark ingredients or dishes unavailable to prevent order cancellations.
- **Simulated Chimes & Metrics**: Audio alert simulation for incoming orders and kitchen load pacing.

### 6. 🛡️ SuperAdmin & India Logistics Operations (`/admin`)
- **Platform Telemetry**: Real-time monitoring of Gross Merchandise Value (GMV), active courier fleet, and delivery SLAs.
- **Hub Controls**: Weather emergency toggles and active PIN coverage clusters.
- **Compliance & Infrastructure**: FSSAI food safety verification audits and edge API health monitors.

### 7. 🛵 Authoritative Billing & Live Delivery Tracker (`/checkout` & `/live-tracker`)
- **Authoritative Indian Taxation**: Server-side re-calculation of 5% GST under food delivery norms, flat ₹25 tamper-proof packaging fee, and free delivery above ₹499.
- **Coupons**: Supported codes (`CRAVEFIRST` for 20% off, `SUPER100` for flat ₹100 off).
- **Delivery Radar**: Simulated courier route radar, courier contact details, and order lifecycle milestones.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.4.3 (App Router with Turbopack) |
| **UI Library** | React 19.3.0 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **3D Graphics** | Three.js (Procedural PBR Meshes & Lighting) |
| **Animations** | GSAP 3 & ScrollTrigger, Canvas Confetti |
| **Icons** | Lucide React |
| **Database Schema** | Prisma ORM with PostgreSQL normalized relational schema |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Ritish-06/CRAVE.git
cd CRAVE

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to experience CRAVE.

### Production Build

```bash
npm run build
npm run start
```

---

## 📄 License
© 2026 CRAVE Technologies Pvt. Ltd. All rights reserved.
