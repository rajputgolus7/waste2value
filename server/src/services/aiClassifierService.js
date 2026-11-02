// Industrial AI Waste Classification Engine
// Simulates high-confidence computer vision & heuristic material recognition

const AI_MATERIAL_CATALOG = [
  {
    key: 'rice_husk',
    name: 'Paddy Rice Husk (Agro By-Product)',
    category: 'Biomass & Agro By-products',
    categoryId: 1,
    confidence: 94.8,
    estimatedValue: '₹4,200 – ₹5,000 / Tonne',
    co2Factor: 1.8,
    suggestedBuyers: ['Biomass Power Plants', 'Biofuel Manufacturers', 'Paper Mills', 'Silicon Ash Extractors'],
    circularProducts: ['Bio-pellets', 'Refractory Bricks', 'Precipitated Silica', 'Bio-gas'],
    recommendedGrade: 'Grade A (Moisture < 10%)',
    processingNeeds: 'Dry storage, magnetic separation for foreign particles'
  },
  {
    key: 'pet_plastic',
    name: 'PET Plastic Bottle Scrap (Clear Flakes)',
    category: 'Plastics & Polymers Scrap',
    categoryId: 2,
    confidence: 96.2,
    estimatedValue: '₹60 – ₹70 / KG',
    co2Factor: 2.5,
    suggestedBuyers: ['Polyester Staple Fiber Manufacturers', 'Thermoforming Packaging', 'Strapping Band Producers'],
    circularProducts: ['Recycled Polyester (rPET) Yarn', 'Fleece Jackets', 'Non-food Packaging Trays'],
    recommendedGrade: 'Grade A (Hot washed, PVC < 50ppm)',
    processingNeeds: 'Optical sorting, hot detergent wash, granulator flake size 10-12mm'
  },
  {
    key: 'cardboard',
    name: 'Corrugated Cardboard Waste (OCC 95/5)',
    category: 'Paper, Pulp & Corrugated Packaging',
    categoryId: 7,
    confidence: 93.5,
    estimatedValue: '₹12 – ₹16 / KG',
    co2Factor: 1.4,
    suggestedBuyers: ['Paper Mills', 'Kraft Paper Manufacturers', 'Duplex Board Plants'],
    circularProducts: ['Recycled Fluting Paper', 'Packaging Cartons', 'Egg Trays', 'Pulp Molded Cushions'],
    recommendedGrade: 'Grade A (Baled, moisture < 12%)',
    processingNeeds: 'Baling, hydrapulper screening, de-inking'
  },
  {
    key: 'fly_ash',
    name: 'Dry Fly Ash (Class F / Grade 1)',
    category: 'Fly Ash & Construction Waste',
    categoryId: 5,
    confidence: 95.1,
    estimatedValue: '₹1,000 – ₹1,350 / Tonne',
    co2Factor: 0.9,
    suggestedBuyers: ['Portland Pozzolana Cement Plants', 'Ready-Mix Concrete (RMC)', 'Autoclaved Aerated Concrete (AAC) Blocks'],
    circularProducts: ['Green Cement', 'Eco-friendly Bricks', 'Geopolymer Concrete'],
    recommendedGrade: 'Grade 1 (Fineness > 320 m²/kg, LOI < 5%)',
    processingNeeds: 'Pneumatic tanker handling, moisture-proof silo storage'
  },
  {
    key: 'cotton_textile',
    name: '100% Cotton Yarn Waste & Comber Noils',
    category: 'Textile Fibers & Garment Waste',
    categoryId: 4,
    confidence: 91.7,
    estimatedValue: '₹38 – ₹45 / KG',
    co2Factor: 1.6,
    suggestedBuyers: ['Open-End Rotor Spinning Mills', 'Surgical Cotton Units', 'Automotive Insulation Felts'],
    circularProducts: ['Coarse Recycled Yarn', 'Absorbent Cotton', 'Acoustic Sound Insulation Mats'],
    recommendedGrade: 'Grade A (Virgin cotton offcuts, zero synthetic blend)',
    processingNeeds: 'Rag-tearing, garnetting, blending'
  },
  {
    key: 'used_oil',
    name: 'Used Industrial Hydraulic & Lubricating Oil',
    category: 'Industrial Oils & Spent Chemicals',
    categoryId: 6,
    confidence: 94.4,
    estimatedValue: '₹26 – ₹32 / Litre',
    co2Factor: 2.1,
    suggestedBuyers: ['Re-refining Lubricant Plants', 'Furnace Fuel Blend Units', 'Asphalt Plants'],
    circularProducts: ['Group II Base Oil', 'Industrial Fuel Oil', 'Grease Formulations'],
    recommendedGrade: 'Industrial Reusable (Water content < 2%)',
    processingNeeds: 'Vacuum distillation, clay filtration, centrifuge sludge removal'
  },
  {
    key: 'foundry_sand',
    name: 'Spent Foundry Green Sand (Silica)',
    category: 'Metal Scrap & Foundry Slag',
    categoryId: 3,
    confidence: 90.3,
    estimatedValue: '₹550 – ₹750 / Tonne',
    co2Factor: 0.7,
    suggestedBuyers: ['Asphalt Paver Mixers', 'Sub-base Road Contractors', 'Red Clay Brick Kilns'],
    circularProducts: ['Structural Embankments', 'Interlocking Paver Blocks', 'Flowable Fill'],
    recommendedGrade: 'Industrial Reusable (Non-hazardous, TCLP compliant)',
    processingNeeds: 'Thermal reclamation, sieve sizing'
  },
  {
    key: 'bagasse',
    name: 'Sugarcane Bagasse (Depithed Fiber)',
    category: 'Biomass & Agro By-products',
    categoryId: 1,
    confidence: 95.8,
    estimatedValue: '₹2,600 – ₹3,100 / Tonne',
    co2Factor: 1.9,
    suggestedBuyers: ['Cogen Power Plants', 'Particle Board Manufacturers', 'Biodegradable Tableware Units'],
    circularProducts: ['Bagasse Pulp Paper', 'Molded Fiber Plates', 'Bio-ethanol', 'MDF Boards'],
    recommendedGrade: 'Grade B (Moisture ~48% or solar-dried)',
    processingNeeds: 'Depithing, baling, dry storage'
  }
];

/**
 * Classifies an image and returns material taxonomy, confidence, and circular metrics
 */
function classifyWaste(filename = '', description = '') {
  const query = `${filename} ${description}`.toLowerCase();

  let matched = AI_MATERIAL_CATALOG[0];

  if (query.includes('pet') || query.includes('plastic') || query.includes('bottle') || query.includes('polymer')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'pet_plastic');
  } else if (query.includes('cardboard') || query.includes('paper') || query.includes('carton') || query.includes('box')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'cardboard');
  } else if (query.includes('fly') || query.includes('ash') || query.includes('cement') || query.includes('thermal')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'fly_ash');
  } else if (query.includes('cotton') || query.includes('textile') || query.includes('fabric') || query.includes('yarn') || query.includes('denim')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'cotton_textile');
  } else if (query.includes('oil') || query.includes('lubricant') || query.includes('hydraulic') || query.includes('chemical')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'used_oil');
  } else if (query.includes('foundry') || query.includes('sand') || query.includes('metal') || query.includes('slag')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'foundry_sand');
  } else if (query.includes('bagasse') || query.includes('cane') || query.includes('sugar')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'bagasse');
  } else if (query.includes('husk') || query.includes('rice') || query.includes('paddy') || query.includes('agro')) {
    matched = AI_MATERIAL_CATALOG.find(m => m.key === 'rice_husk');
  }

  // Slight variance to simulate realistic live vision AI analysis
  const variance = (Math.random() * 2.5 - 1.25);
  const finalConfidence = Math.min(98.9, Math.max(88.0, Number((matched.confidence + variance).toFixed(1))));

  return {
    ...matched,
    confidence: finalConfidence,
    aiModel: 'WasteVision-v2.4 (Simulated Deep Computer Vision)',
    analysisTimestamp: new Date().toISOString(),
    isSimulatedAI: true
  };
}

module.exports = {
  AI_MATERIAL_CATALOG,
  classifyWaste
};
