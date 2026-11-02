/**
 * STRICT CENTRALIZED MATERIAL IMAGE SYSTEM (SERVER)
 */

const MATERIAL_IMAGE_MAP = {
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

function getMaterialImageServer(title = '', categoryId = 1, desc = '') {
  const text = `${title} ${desc}`.toLowerCase().trim();

  // 1. SPECIFIC MATERIAL MATCHES
  if (text.includes('bagasse') || text.includes('sugarcane')) return MATERIAL_IMAGE_MAP.sugarcane_bagasse;
  if (text.includes('rice husk') || text.includes('paddy husk') || (text.includes('rice') && text.includes('husk'))) return MATERIAL_IMAGE_MAP.rice_husk;
  if (text.includes('cotton yarn') || text.includes('comber noils') || text.includes('ring waste') || (text.includes('yarn') && text.includes('waste'))) return MATERIAL_IMAGE_MAP.cotton_yarn;
  if (text.includes('denim') || text.includes('indigo dyed')) return MATERIAL_IMAGE_MAP.denim_clips;
  if (text.includes('linters') || text.includes('ginning')) return MATERIAL_IMAGE_MAP.cotton_linters;
  if (text.includes('hydraulic oil') || text.includes('hydraulic fluid') || text.includes('lube oil') || text.includes('engine oil') || text.includes('lubricant')) return MATERIAL_IMAGE_MAP.hydraulic_oil;
  if (text.includes('hydrochloric') || text.includes('pickling acid') || text.includes('acid')) return MATERIAL_IMAGE_MAP.hydrochloric_acid;
  if (text.includes('phosphogypsum') || text.includes('gypsum')) return MATERIAL_IMAGE_MAP.phosphogypsum;
  if (text.includes('foundry') || text.includes('green sand') || text.includes('silica sand') || text.includes('molding sand')) return MATERIAL_IMAGE_MAP.foundry_sand;
  if (text.includes('aluminium') || text.includes('aluminum') || (text.includes('swarf') && text.includes('cnc'))) return MATERIAL_IMAGE_MAP.aluminium_scrap;
  if (text.includes('copper')) return MATERIAL_IMAGE_MAP.copper_scrap;
  if (text.includes('brass')) return MATERIAL_IMAGE_MAP.brass_scrap;
  if (text.includes('steel') || text.includes('iron scrap') || text.includes('hms')) return MATERIAL_IMAGE_MAP.steel_scrap;
  if (text.includes('zinc') || text.includes('dross') || text.includes('galvanizing')) return MATERIAL_IMAGE_MAP.zinc_dross;
  if (text.includes('slag') || text.includes('blast furnace') || text.includes('ggbs')) return MATERIAL_IMAGE_MAP.blast_furnace_slag;
  if (text.includes('fly ash') || text.includes('pozzolan') || (text.includes('ash') && text.includes('class'))) return MATERIAL_IMAGE_MAP.fly_ash;
  if (text.includes('pet flakes') || text.includes('bottle scrap') || text.includes('rpet') || text.includes('pet')) return MATERIAL_IMAGE_MAP.pet_plastic;
  if (text.includes('hdpe') || text.includes('drum regrind')) return MATERIAL_IMAGE_MAP.hdpe_plastic;
  if (text.includes('cardboard') || text.includes('corrugated') || text.includes('occ')) return MATERIAL_IMAGE_MAP.cardboard_occ;
  if (text.includes('core tubes') || text.includes('paper core') || (text.includes('tubes') && text.includes('paper'))) return MATERIAL_IMAGE_MAP.paper_cores;
  if (text.includes('glass') || text.includes('cullet') || text.includes('soda-lime')) return MATERIAL_IMAGE_MAP.glass_cullet;
  if (text.includes('rubber') || text.includes('tire') || text.includes('crumb')) return MATERIAL_IMAGE_MAP.rubber_crumb;
  if (text.includes('brick') || text.includes('concrete') || text.includes('demolition') || text.includes('aggregate') || text.includes('masonry')) return MATERIAL_IMAGE_MAP.construction_aggregate;
  if (text.includes('sawdust') || text.includes('wood') || text.includes('timber') || text.includes('pine')) return MATERIAL_IMAGE_MAP.wood_sawdust;
  if (text.includes('spent grain') || text.includes('brewery') || text.includes('barley')) return MATERIAL_IMAGE_MAP.spent_barley;

  // 2. BROAD CATEGORY LEVEL MATCHES
  if (text.includes('textile') || text.includes('garment') || text.includes('fabric')) return MATERIAL_IMAGE_MAP.cotton_yarn;
  if (text.includes('plastic') || text.includes('polymer')) return MATERIAL_IMAGE_MAP.pet_plastic;
  if (text.includes('metal') || text.includes('scrap')) return MATERIAL_IMAGE_MAP.steel_scrap;
  if (text.includes('paper')) return MATERIAL_IMAGE_MAP.cardboard_occ;
  if (text.includes('oil') || text.includes('chemical')) return MATERIAL_IMAGE_MAP.hydraulic_oil;
  if (text.includes('ash')) return MATERIAL_IMAGE_MAP.fly_ash;

  switch (Number(categoryId)) {
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

module.exports = {
  MATERIAL_IMAGE_MAP,
  getMaterialImageServer
};
