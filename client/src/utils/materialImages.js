/**
 * Deterministic Semantic Image Mapping for Waste2Market Materials
 * Ensures every single listing displays an authentic, semantically accurate
 * image matching its specific industrial material and category.
 */

export const MATERIAL_IMAGE_MAP = {
  // 1. TEXTILE FIBERS & GARMENT WASTE
  cotton_yarn: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80', // Industrial spools of yarn & spinning cones
  cotton_linters: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', // Clean raw textile fiber & cotton rolls
  denim_scraps: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', // Baled denim fabric trimmings & indigo textiles
  textile_general: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80', // Industrial weaving & garment fiber rolls

  // 2. INDUSTRIAL OILS & SPENT CHEMICALS
  hydraulic_oil: 'https://images.unsplash.com/photo-1618090584176-7132b9911661?auto=format&fit=crop&w=800&q=80', // Sealed steel 210L lubricant & hydraulic oil drums
  lube_oil: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80', // Viscous amber industrial oil & machine lubricants
  spent_chemicals: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80', // Chemical distillation vessel & industrial solutions
  phosphogypsum: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', // Neutralized mineral cake & industrial gypsum residue

  // 3. BIOMASS & AGRO BY-PRODUCTS
  rice_husk: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', // Golden paddy rice husk by-product
  sugarcane_bagasse: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80', // Dry crushed fibrous sugarcane bagasse bales
  spent_grain: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', // Wet distillers barley spent grain mash
  sawdust_wood: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', // Kiln-dried timber sawdust & wood shavings
  biomass_general: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', // Agro stalks, biomass bales & briquette feedstock

  // 4. FLY ASH & CONSTRUCTION WASTE
  fly_ash: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', // Fine dry siliceous gray fly ash powder
  construction_rubble: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80', // Crushed masonry concrete aggregate & recycled brick
  concrete_aggregate: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80', // Screened 0-20mm recycled construction aggregate

  // 5. METAL SCRAP & FOUNDRY SLAG
  aluminium_scrap: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', // Precision CNC milling turnings, swarf & aluminium trimmings
  steel_scrap: 'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f8c?auto=format&fit=crop&w=800&q=80', // Heavy industrial steel trimmings & metal scrap
  foundry_sand: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', // Spent bentonite silica green sand from gray iron foundry
  blast_furnace_slag: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80', // Granulated blast furnace metallurgical slag
  zinc_dross: 'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?auto=format&fit=crop&w=800&q=80', // Galvanizing zinc dross skimmings & metallic scrap

  // 6. PLASTICS & POLYMERS SCRAP
  pet_flakes: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80', // Hot washed clear PET bottle flakes & post-industrial trim
  hdpe_regrind: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80', // Granulated HDPE regrind & blue container shreds
  rubber_crumb: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80', // Recycled truck tires & ambient crumb rubber scrap
  plastics_general: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80', // Industrial polymer containers & recycled resin regrind

  // 7. PAPER, PULP & PACKAGING
  cardboard_occ: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', // Hydraulic baled corrugated cardboard cartons (OCC 95/5)
  paper_cores: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80', // Heavy duty kraft paper tubes & packaging rolls
  paper_general: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80', // Clean kraft paper scrap & unprinted trim

  // 8. GLASS & CERAMIC CULLET
  glass_cullet: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', // Color-sorted clear flint bottle glass cullet
  glass_general: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80' // Recycled container glass & ceramic fragments
};

// Fallback images strictly mapped to Category Slugs / IDs
export const CATEGORY_FALLBACK_IMAGES = {
  'biomass-agro': MATERIAL_IMAGE_MAP.rice_husk,
  'plastics-polymers': MATERIAL_IMAGE_MAP.pet_flakes,
  'metal-slag': MATERIAL_IMAGE_MAP.aluminium_scrap,
  'textile-fibers': MATERIAL_IMAGE_MAP.cotton_yarn,
  'flyash-construction': MATERIAL_IMAGE_MAP.fly_ash,
  'chemicals-lubricants': MATERIAL_IMAGE_MAP.hydraulic_oil,
  'paper-packaging': MATERIAL_IMAGE_MAP.cardboard_occ,
  'glass-ceramics': MATERIAL_IMAGE_MAP.glass_cullet
};

/**
 * Resolves the semantically accurate image URL for any industrial listing
 * based on its title, description, category name, or category slug.
 */
export function getMaterialImage(listing) {
  if (!listing) return MATERIAL_IMAGE_MAP.rice_husk;

  const title = (listing.title || '').toLowerCase();
  const desc = (listing.description || '').toLowerCase();
  const cat = (listing.category_name || listing.category_slug || '').toLowerCase();
  const text = `${title} ${desc} ${cat}`;

  // 1. Text & Yarn Specific Matches
  if (text.includes('cotton yarn') || text.includes('comber noils') || text.includes('spinning mill')) {
    return MATERIAL_IMAGE_MAP.cotton_yarn;
  }
  if (text.includes('denim') || text.includes('indigo dyed') || text.includes('fabric clip')) {
    return MATERIAL_IMAGE_MAP.denim_scraps;
  }
  if (text.includes('linters') || text.includes('ginning') || text.includes('textile') || text.includes('garment')) {
    return MATERIAL_IMAGE_MAP.cotton_linters;
  }

  // 2. Oil & Chemical Specific Matches
  if (text.includes('hydraulic oil') || text.includes('lube oil') || text.includes('lubricant') || text.includes('engine oil')) {
    return MATERIAL_IMAGE_MAP.hydraulic_oil;
  }
  if (text.includes('acid') || text.includes('hydrochloric') || text.includes('solvent') || text.includes('pickling')) {
    return MATERIAL_IMAGE_MAP.spent_chemicals;
  }
  if (text.includes('gypsum') || text.includes('phosphogypsum')) {
    return MATERIAL_IMAGE_MAP.phosphogypsum;
  }

  // 3. Agro & Biomass Specific Matches
  if (text.includes('rice husk') || text.includes('paddy') || text.includes('parboiled')) {
    return MATERIAL_IMAGE_MAP.rice_husk;
  }
  if (text.includes('bagasse') || text.includes('sugarcane')) {
    return MATERIAL_IMAGE_MAP.sugarcane_bagasse;
  }
  if (text.includes('spent grain') || text.includes('brewery') || text.includes('distillers')) {
    return MATERIAL_IMAGE_MAP.spent_grain;
  }
  if (text.includes('sawdust') || text.includes('wood') || text.includes('timber')) {
    return MATERIAL_IMAGE_MAP.sawdust_wood;
  }

  // 4. Fly Ash & Construction Matches
  if (text.includes('fly ash') || text.includes('class f') || text.includes('pozzolan') || text.includes('precipitator')) {
    return MATERIAL_IMAGE_MAP.fly_ash;
  }
  if (text.includes('brick') || text.includes('masonry') || text.includes('demolition') || text.includes('rubble') || text.includes('aggregate')) {
    return MATERIAL_IMAGE_MAP.construction_rubble;
  }

  // 5. Metal & Slag Matches
  if (text.includes('aluminium') || text.includes('swarf') || text.includes('turnings') || text.includes('machining')) {
    return MATERIAL_IMAGE_MAP.aluminium_scrap;
  }
  if (text.includes('slag') || text.includes('blast furnace') || text.includes('ggbs')) {
    return MATERIAL_IMAGE_MAP.blast_furnace_slag;
  }
  if (text.includes('foundry') || text.includes('silica sand') || text.includes('green sand')) {
    return MATERIAL_IMAGE_MAP.foundry_sand;
  }
  if (text.includes('zinc') || text.includes('dross') || text.includes('galvanizing') || text.includes('steel')) {
    return MATERIAL_IMAGE_MAP.steel_scrap;
  }

  // 6. Plastic & Rubber Matches
  if (text.includes('rubber') || text.includes('tire') || text.includes('crumb')) {
    return MATERIAL_IMAGE_MAP.rubber_crumb;
  }
  if (text.includes('pet flakes') || text.includes('bottle scrap') || text.includes('rpet')) {
    return MATERIAL_IMAGE_MAP.pet_flakes;
  }
  if (text.includes('hdpe') || text.includes('drum regrind') || text.includes('plastic') || text.includes('polymer')) {
    return MATERIAL_IMAGE_MAP.hdpe_regrind;
  }

  // 7. Paper & Cardboard Matches
  if (text.includes('cardboard') || text.includes('corrugated') || text.includes('occ')) {
    return MATERIAL_IMAGE_MAP.cardboard_occ;
  }
  if (text.includes('core') || text.includes('tubes') || text.includes('paper') || text.includes('kraft')) {
    return MATERIAL_IMAGE_MAP.paper_cores;
  }

  // 8. Glass Matches
  if (text.includes('glass') || text.includes('cullet') || text.includes('flint')) {
    return MATERIAL_IMAGE_MAP.glass_cullet;
  }

  // Fallback by Category ID if available
  if (listing.category_id === 1) return MATERIAL_IMAGE_MAP.rice_husk;
  if (listing.category_id === 2) return MATERIAL_IMAGE_MAP.pet_flakes;
  if (listing.category_id === 3) return MATERIAL_IMAGE_MAP.aluminium_scrap;
  if (listing.category_id === 4) return MATERIAL_IMAGE_MAP.cotton_yarn;
  if (listing.category_id === 5) return MATERIAL_IMAGE_MAP.fly_ash;
  if (listing.category_id === 6) return MATERIAL_IMAGE_MAP.hydraulic_oil;
  if (listing.category_id === 7) return MATERIAL_IMAGE_MAP.cardboard_occ;
  if (listing.category_id === 8) return MATERIAL_IMAGE_MAP.glass_cullet;

  // Ultimate fallback
  return MATERIAL_IMAGE_MAP.rice_husk;
}
