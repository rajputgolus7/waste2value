/**
 * STRICT CENTRALIZED MATERIAL IMAGE SYSTEM FOR WASTE2MARKET
 *
 * CRITICAL RULES:
 * 1. Material name strictly determines the image.
 * 2. 100% deterministic mapping with ZERO random assignment.
 * 3. Never reuse images from unrelated categories (e.g. no ice cream, no handbags).
 * 4. Served from high-fidelity local SVG vector assets in /images/materials/
 *    guaranteeing 0ms instant loading, zero external network dependency, and offline reliability.
 */

export const MATERIAL_IMAGE_MAP = {
  // Agricultural & Biomass Materials
  sugarcane_bagasse: '/images/materials/sugarcane_bagasse.svg',
  rice_husk: '/images/materials/rice_husk.svg',
  spent_barley: '/images/materials/spent_barley.svg',
  wood_sawdust: '/images/materials/wood_sawdust.svg',

  // Textiles & Fibers
  cotton_yarn: '/images/materials/cotton_yarn.svg',
  cotton_linters: '/images/materials/cotton_linters.svg',
  denim_clips: '/images/materials/denim_clips.svg',

  // Oils & Chemical Products
  hydraulic_oil: '/images/materials/hydraulic_oil.svg',
  hydrochloric_acid: '/images/materials/hydrochloric_acid.svg',
  phosphogypsum: '/images/materials/phosphogypsum.svg',

  // Metallurgical, Foundry & Slag
  foundry_sand: '/images/materials/foundry_sand.svg',
  aluminium_scrap: '/images/materials/aluminium_scrap.svg',
  steel_scrap: '/images/materials/steel_scrap.svg',
  copper_scrap: '/images/materials/copper_scrap.svg',
  brass_scrap: '/images/materials/brass_scrap.svg',
  zinc_dross: '/images/materials/zinc_dross.svg',
  blast_furnace_slag: '/images/materials/blast_furnace_slag.svg',

  // Mineral & Construction
  fly_ash: '/images/materials/fly_ash.svg',
  construction_aggregate: '/images/materials/construction_aggregate.svg',

  // Polymers & Rubber
  pet_plastic: '/images/materials/pet_plastic.svg',
  hdpe_plastic: '/images/materials/hdpe_plastic.svg',
  rubber_crumb: '/images/materials/rubber_crumb.svg',

  // Paper & Packaging
  cardboard_occ: '/images/materials/cardboard_occ.svg',
  paper_cores: '/images/materials/paper_cores.svg',

  // Glass & Ceramics
  glass_cullet: '/images/materials/glass_cullet.svg'
};

/**
 * Resolves the semantically accurate image for ANY listing.
 * Strict keyword matching on normalized material name and title.
 */
export function getMaterialImage(listing) {
  if (!listing) return MATERIAL_IMAGE_MAP.rice_husk;

  // Extract text fields
  const title = (listing.title || listing.name || '').toLowerCase().trim();
  const desc = (listing.description || '').toLowerCase();
  const text = `${title} ${desc}`;

  // 1. SPECIFIC MATERIAL MATCHES (Highest Precedence)

  // Sugarcane Bagasse
  if (text.includes('bagasse') || text.includes('sugarcane')) {
    return MATERIAL_IMAGE_MAP.sugarcane_bagasse;
  }

  // Rice Husk
  if (text.includes('rice husk') || text.includes('paddy husk') || (text.includes('rice') && text.includes('husk'))) {
    return MATERIAL_IMAGE_MAP.rice_husk;
  }

  // Cotton Yarn & Comber Noils
  if (text.includes('cotton yarn') || text.includes('comber noils') || text.includes('ring waste') || (text.includes('yarn') && text.includes('waste'))) {
    return MATERIAL_IMAGE_MAP.cotton_yarn;
  }

  // Denim Fabric Clips
  if (text.includes('denim') || text.includes('indigo dyed')) {
    return MATERIAL_IMAGE_MAP.denim_clips;
  }

  // Cotton Linters / Ginning Micro-Trash
  if (text.includes('linters') || text.includes('ginning')) {
    return MATERIAL_IMAGE_MAP.cotton_linters;
  }

  // Used Hydraulic Oil / Industrial Lubricants
  if (text.includes('hydraulic oil') || text.includes('hydraulic fluid') || text.includes('lube oil') || text.includes('engine oil') || text.includes('lubricant')) {
    return MATERIAL_IMAGE_MAP.hydraulic_oil;
  }

  // Hydrochloric Acid / Pickling Chemicals
  if (text.includes('hydrochloric') || text.includes('pickling acid') || text.includes('acid')) {
    return MATERIAL_IMAGE_MAP.hydrochloric_acid;
  }

  // Phosphogypsum Cake
  if (text.includes('phosphogypsum') || text.includes('gypsum')) {
    return MATERIAL_IMAGE_MAP.phosphogypsum;
  }

  // Spent Foundry Silica Green Sand
  if (text.includes('foundry') || text.includes('green sand') || text.includes('silica sand') || text.includes('molding sand')) {
    return MATERIAL_IMAGE_MAP.foundry_sand;
  }

  // Aluminium Stamping Trimmings / Swarf
  if (text.includes('aluminium') || text.includes('aluminum') || (text.includes('swarf') && text.includes('cnc'))) {
    return MATERIAL_IMAGE_MAP.aluminium_scrap;
  }

  // Copper Scrap
  if (text.includes('copper')) {
    return MATERIAL_IMAGE_MAP.copper_scrap;
  }

  // Brass Scrap
  if (text.includes('brass')) {
    return MATERIAL_IMAGE_MAP.brass_scrap;
  }

  // Steel & Iron Scrap
  if (text.includes('steel') || text.includes('iron scrap') || text.includes('hms')) {
    return MATERIAL_IMAGE_MAP.steel_scrap;
  }

  // Zinc Dross & Galvanizing Skimmings
  if (text.includes('zinc') || text.includes('dross') || text.includes('galvanizing')) {
    return MATERIAL_IMAGE_MAP.zinc_dross;
  }

  // Granulated Blast Furnace Slag (GGBS)
  if (text.includes('slag') || text.includes('blast furnace') || text.includes('ggbs')) {
    return MATERIAL_IMAGE_MAP.blast_furnace_slag;
  }

  // Fly Ash (Class F / C)
  if (text.includes('fly ash') || text.includes('pozzolan') || (text.includes('ash') && text.includes('class'))) {
    return MATERIAL_IMAGE_MAP.fly_ash;
  }

  // Clear PET Flakes & Bottle Scrap
  if (text.includes('pet flakes') || text.includes('bottle scrap') || text.includes('rpet') || text.includes('pet')) {
    return MATERIAL_IMAGE_MAP.pet_plastic;
  }

  // HDPE Drum Regrind & Polymers
  if (text.includes('hdpe') || text.includes('drum regrind')) {
    return MATERIAL_IMAGE_MAP.hdpe_plastic;
  }

  // Cardboard Corrugated Offcuts (OCC)
  if (text.includes('cardboard') || text.includes('corrugated') || text.includes('occ')) {
    return MATERIAL_IMAGE_MAP.cardboard_occ;
  }

  // Paper Core Tubes
  if (text.includes('core tubes') || text.includes('paper core') || (text.includes('tubes') && text.includes('paper'))) {
    return MATERIAL_IMAGE_MAP.paper_cores;
  }

  // Glass Cullet
  if (text.includes('glass') || text.includes('cullet') || text.includes('soda-lime')) {
    return MATERIAL_IMAGE_MAP.glass_cullet;
  }

  // Vulcanized Rubber Tire Crumb
  if (text.includes('rubber') || text.includes('tire') || text.includes('crumb')) {
    return MATERIAL_IMAGE_MAP.rubber_crumb;
  }

  // Demolition Concrete & Brick Aggregate
  if (text.includes('brick') || text.includes('concrete') || text.includes('demolition') || text.includes('aggregate') || text.includes('masonry')) {
    return MATERIAL_IMAGE_MAP.construction_aggregate;
  }

  // Wood Sawdust Residue
  if (text.includes('sawdust') || text.includes('wood') || text.includes('timber') || text.includes('pine')) {
    return MATERIAL_IMAGE_MAP.wood_sawdust;
  }

  // Brewery Spent Grain
  if (text.includes('spent grain') || text.includes('brewery') || text.includes('barley')) {
    return MATERIAL_IMAGE_MAP.spent_barley;
  }

  // 2. BROAD CATEGORY LEVEL MATCHES
  if (text.includes('textile') || text.includes('garment') || text.includes('fabric')) {
    return MATERIAL_IMAGE_MAP.cotton_yarn;
  }
  if (text.includes('plastic') || text.includes('polymer')) {
    return MATERIAL_IMAGE_MAP.pet_plastic;
  }
  if (text.includes('metal') || text.includes('scrap')) {
    return MATERIAL_IMAGE_MAP.steel_scrap;
  }
  if (text.includes('paper')) {
    return MATERIAL_IMAGE_MAP.cardboard_occ;
  }
  if (text.includes('oil') || text.includes('chemical')) {
    return MATERIAL_IMAGE_MAP.hydraulic_oil;
  }
  if (text.includes('ash')) {
    return MATERIAL_IMAGE_MAP.fly_ash;
  }

  // 3. NUMERIC CATEGORY ID FALLBACKS
  switch (Number(listing.category_id)) {
    case 1: return MATERIAL_IMAGE_MAP.rice_husk;
    case 2: return MATERIAL_IMAGE_MAP.pet_plastic;
    case 3: return MATERIAL_IMAGE_MAP.steel_scrap;
    case 4: return MATERIAL_IMAGE_MAP.cotton_yarn;
    case 5: return MATERIAL_IMAGE_MAP.fly_ash;
    case 6: return MATERIAL_IMAGE_MAP.hydraulic_oil;
    case 7: return MATERIAL_IMAGE_MAP.cardboard_occ;
    case 8: return MATERIAL_IMAGE_MAP.glass_cullet;
    default: return MATERIAL_IMAGE_MAP.rice_husk;
  }
}
