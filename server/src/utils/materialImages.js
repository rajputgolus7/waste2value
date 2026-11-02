/**
 * Deterministic Semantic Image Mapping for Waste2Market Materials (Server)
 */

const MATERIAL_IMAGE_MAP = {
  // 1. TEXTILE FIBERS & GARMENT WASTE
  cotton_yarn: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
  cotton_linters: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
  denim_scraps: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',

  // 2. INDUSTRIAL OILS & SPENT CHEMICALS
  hydraulic_oil: 'https://images.unsplash.com/photo-1618090584176-7132b9911661?auto=format&fit=crop&w=800&q=80',
  lube_oil: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  spent_chemicals: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
  phosphogypsum: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',

  // 3. BIOMASS & AGRO BY-PRODUCTS
  rice_husk: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  sugarcane_bagasse: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  spent_grain: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  sawdust_wood: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',

  // 4. FLY ASH & CONSTRUCTION WASTE
  fly_ash: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
  construction_rubble: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',

  // 5. METAL SCRAP & FOUNDRY SLAG
  aluminium_scrap: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  steel_scrap: 'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f8c?auto=format&fit=crop&w=800&q=80',
  foundry_sand: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  blast_furnace_slag: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',

  // 6. PLASTICS & POLYMERS SCRAP
  pet_flakes: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  hdpe_regrind: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
  rubber_crumb: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',

  // 7. PAPER, PULP & PACKAGING
  cardboard_occ: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  paper_cores: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',

  // 8. GLASS & CERAMIC CULLET
  glass_cullet: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
};

function getMaterialImageServer(title = '', categoryId = 1) {
  const text = title.toLowerCase();

  if (text.includes('cotton') || text.includes('textile') || text.includes('yarn') || text.includes('noils')) {
    return MATERIAL_IMAGE_MAP.cotton_yarn;
  }
  if (text.includes('denim')) return MATERIAL_IMAGE_MAP.denim_scraps;
  if (text.includes('oil') || text.includes('hydraulic') || text.includes('lubricant')) {
    return MATERIAL_IMAGE_MAP.hydraulic_oil;
  }
  if (text.includes('bagasse') || text.includes('sugarcane')) return MATERIAL_IMAGE_MAP.sugarcane_bagasse;
  if (text.includes('rice husk') || text.includes('paddy')) return MATERIAL_IMAGE_MAP.rice_husk;
  if (text.includes('fly ash') || text.includes('ash')) return MATERIAL_IMAGE_MAP.fly_ash;
  if (text.includes('aluminium') || text.includes('metal') || text.includes('steel') || text.includes('swarf')) {
    return MATERIAL_IMAGE_MAP.aluminium_scrap;
  }
  if (text.includes('glass') || text.includes('cullet')) return MATERIAL_IMAGE_MAP.glass_cullet;
  if (text.includes('pet') || text.includes('plastic') || text.includes('hdpe')) return MATERIAL_IMAGE_MAP.pet_flakes;
  if (text.includes('rubber') || text.includes('tire')) return MATERIAL_IMAGE_MAP.rubber_crumb;
  if (text.includes('cardboard') || text.includes('paper') || text.includes('corrugated')) return MATERIAL_IMAGE_MAP.cardboard_occ;
  if (text.includes('brick') || text.includes('concrete') || text.includes('construction')) return MATERIAL_IMAGE_MAP.construction_rubble;

  switch (Number(categoryId)) {
    case 1: return MATERIAL_IMAGE_MAP.rice_husk;
    case 2: return MATERIAL_IMAGE_MAP.pet_flakes;
    case 3: return MATERIAL_IMAGE_MAP.aluminium_scrap;
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
