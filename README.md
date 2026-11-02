# Waste2Market: B2B Industrial Waste-to-Value Economy Marketplace

> **"One industry's waste can be another industry's raw material."**

Waste2Market is a centralized, production-quality B2B circular economy platform connecting industries that **generate** industrial by-products with industries and processors that **procure, reuse, and reprocess** those materials.

This is **NOT** a residential garbage collection app. It is an **industry-to-industry circular economy marketplace** engineered for Indian manufacturing corridors (Punjab, Haryana, Delhi NCR, Rajasthan, Gujarat, Maharashtra, UP).

---

## ⚡ 1-Minute Quick Start (Zero Config Setup)

Waste2Market runs on Node v26 using the native high-performance relational database engine (`node:sqlite`). **No MySQL server configuration or root privileges required.**

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Seed Database** (Populates 12 enterprise companies, 22 industrial listings, and demo transactions):
   ```bash
   npm run server:seed
   ```

3. **Start Full Platform** (Both Express API on port 5000 and React/Vite on port 5173):
   ```bash
   npm run dev
   ```

4. Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🎭 One-Click Demo Personas (For Judges & Evaluators)

A persistent **Demo Persona Switcher** sits at the top of every page. You can switch personas with a single click without typing passwords:

| Persona | Company | Role | Demo Email | Password |
|---|---|---|---|---|
| **1. Seller Demo** | Punjab Rice Industries (Ludhiana) | Waste Generator | `seller@waste2market.com` | `password123` |
| **2. Buyer Demo** | Green Biomass Energy Ltd (Rajpura) | Feedstock Buyer | `buyer@waste2market.com` | `password123` |
| **3. Admin Demo** | Waste2Market Operations | Compliance Admin | `admin@waste2market.com` | `admin123` |

---

## 🏆 Complete Hackathon Demo Scenario (Scripted Flow)

Here is the exact step-by-step walkthrough to present to hackathon judges:

### Step 1: The Waste Generator (Seller Persona)
1. In the top bar, click **"1. Seller (Punjab Rice)"**.
2. Notice your profile: *Punjab Rice Industries (Ludhiana, Punjab)*.
3. Click **"+ List Waste Material"** in the top navigation.
4. Walk through the **6-Step Wizard**:
   - **Step 1**: Select *Biomass & Agro By-products*.
   - **Step 2**: Enter title (e.g. *Basmati Parboiled Rice Husk*), Grade A.
   - **Step 3**: Volume: 10 Tonnes @ ₹4,500/T (Total lot valuation: ₹45,000).
   - **Step 4**: Location: *Punjab, Ludhiana*.
   - **Step 5**: Select high-res rice husk sample photo.
   - **Step 6**: Live preview card with instant carbon calculation $\rightarrow$ Click **"Publish to Marketplace"**.
5. The listing is published with unique reference code (e.g., `W2M-2026-XXXX`).

### Step 2: The Smart Waste Matching Engine
1. Click **"Smart Matching"** in the navigation bar.
2. Select your newly published lot or the pre-seeded *Paddy Rice Husk* lot.
3. Observe the real-time algorithm evaluation:
   - **Top Match**: *Green Biomass Energy Ltd* $\rightarrow$ **94% Compatibility**
   - **Checklist explanation**:
     - `✓ Material compatible: Paddy Rice Husk matches biomass boiler feedstock`
     - `✓ Quantity compatible: 10 Tonnes is inside buyer's 8–15T procurement window`
     - `✓ Within preferred distance: 85 km from Ludhiana to Rajpura`
     - `✓ Price acceptable: Asking ₹4,500/t <= Buyer's ₹5,000/t ceiling budget`
     - `✓ Required quality available: Grade A feedstock`
     - `✓ Immediate dispatch: Ready for factory gate pickup`
   - **Freight & Logistics**: Distance 85 km, Estimated freight ₹4,500.

### Step 3: The Buyer Makes a Purchase Offer
1. In the top bar, click **"2. Buyer (Green Biomass)"**.
2. Go to **Marketplace** $\rightarrow$ Search *"Rice Husk"* or filter by *Biomass*.
3. Click on the listing $\rightarrow$ Click **"Make an Offer"**.
4. Offer parameters: 10 Tonnes at ₹4,400/T, *Buyer Pickup*, and submit offer.

### Step 4: Seller Accepts & Milestone Tracking
1. Switch back to **"1. Seller (Punjab Rice)"**.
2. Navigate to **"Deals & Offers"** (`/deals`).
3. View the incoming offer under the Offers tab $\rightarrow$ Click **"Accept Offer & Create Deal"**.
4. Deal contract is established (`DEAL-W2M-XXXX`).
5. Open the **Deal Milestone Tracker**:
   - Status moves from `ACCEPTED` $\rightarrow$ Click **"Confirm Logistics Dispatch"** (`LOGISTICS_ARRANGED`).
   - Click **"Mark as In Processing"** (`PROCESSING`).
   - Click **"Complete Transaction & Divert Waste"** (`COMPLETED`).
6. The celebratory confetti effect triggers, 10,000 kg waste is diverted, and ₹44,000 economic value is logged!

### Step 5: Enterprise Analytics & Circular ESG
1. Navigate to **"Dashboard"** $\rightarrow$ Observe dynamic KPI cards updating (Total Sold +10T, Revenue +₹44,000, Diverted +10,000 kg, CO₂ offset +18,000 kg).
2. Go to **"Circular Impact"** (`/impact`) $\rightarrow$ Observe macro platform metrics: 12,450+ KG diverted, ₹8.4+ Lakh economic value, and tree planting equivalents.
3. Test the **"Value Calculator"** (`/calculator`) with custom disposal vs selling numbers.
4. Test the **"AI Scanner"** (`/ai-scanner`) with sample scrap images.
5. Switch to **"3. Admin (Ops & Compliance)"** $\rightarrow$ Go to `/admin` $\rightarrow$ Audit company credentials and moderate listings.

---

## 📦 System Architecture & Technology Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide React + Recharts
- **Backend**: Node.js + Express REST API
- **Relational Database**: Native `node:sqlite` (SQLite 3.54 relational engine with foreign keys, transactions, and WAL mode).
- **MySQL Compatibility**: Standalone MySQL / MariaDB DDL schema exported in `server/src/db/schema.mysql.sql`.
- **Matching Algorithm**: Deterministic 6-factor multi-criteria decision engine.

```
/home/golusingh/Downloads/T2B/
├── client/                    # React 18 Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Footer, DemoBanner, StatusBadge, MatchScoreCard, DealTimeline, MakeOfferModal
│   │   ├── context/           # AuthContext with 1-click persona switching
│   │   ├── pages/             # 13 Complete interactive pages
│   │   └── services/api.js    # Axios REST client
│   └── package.json
├── server/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/       # Auth, Listings, Matching, Offers, Deals, Calculator, Impact, Admin
│   │   ├── db/                # Schema, connection, seed data
│   │   ├── services/          # 6-Factor Matching Engine, Distance Service, AI Classifier
│   │   └── index.js           # API Entrypoint (Port 5000)
│   └── package.json
└── package.json               # Root orchestration scripts
```

---

## 🌟 Key Features Implemented

1. **B2B Waste Marketplace**: Search, category filters, location filters, price sliders, quality grade filters, unit filters, and sorting.
2. **Smart Waste Matching Engine**: Real 6-factor algorithm calculating match % with checkmark breakdown.
3. **6-Step Listing Creation Wizard**: Category $\rightarrow$ Details $\rightarrow$ Economics $\rightarrow$ Location $\rightarrow$ Sample Photography $\rightarrow$ Live Preview & Publish.
4. **B2B Offer & Deal Negotiation**: Make Offer, Accept, Reject, Counter-Offer, and visual milestone tracker (`Offer Sent` $\rightarrow$ `Negotiation` $\rightarrow$ `Accepted` $\rightarrow$ `Processing` $\rightarrow$ `Completed`).
5. **Dynamic Waste Value Calculator**: Disposal loss vs gross revenue vs freight $\rightarrow$ Net economic recovery & CO₂ abatement.
6. **Company Operations Dashboard**: 7 KPI cards, Recharts donut & area charts, live listings & active deals.
7. **Business Profile & Simulated Verification**: Verified business badges (`✓ Verified Business`), materials taxonomy, and transaction history.
8. **Macro Circular Economy Impact Dashboard**: Aggregate waste diverted, CO₂ avoided, trees equivalent, and sector breakdown.
9. **AI Waste Classifier (Advanced Feature 1)**: Computer vision scrap classifier with confidence score, market pricing, and suggested buyer verticals.
10. **Industrial Corridor Logistics & Map Matching (Advanced Feature 2)**: Road freight distance, transit diesel calculation, and corridor routes.
11. **Admin Control Suite**: Verify facilities, moderate listings, and inspect all network transactions.
