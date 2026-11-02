const bcrypt = require('bcryptjs');
const { db, run, exec, get, query } = require('./index');

function seedDatabase() {
  console.log('🌱 Starting Waste2Market database seeding...');

  // Clear existing data in correct foreign key order
  exec(`
    DELETE FROM notifications;
    DELETE FROM reviews;
    DELETE FROM impact_logs;
    DELETE FROM deals;
    DELETE FROM offers;
    DELETE FROM buyer_requirements;
    DELETE FROM listings;
    DELETE FROM users;
    DELETE FROM companies;
    DELETE FROM categories;
    DELETE FROM sqlite_sequence;
  `);

  console.log('✓ Cleared previous database records');

  // 1. Categories
  const categories = [
    {
      name: 'Biomass & Agro By-products',
      slug: 'biomass-agro',
      icon: 'Leaf',
      co2_factor_per_kg: 1.8,
      avg_market_price_inr: 4500,
      description: 'Rice husk, sugarcane bagasse, crop stalks, sawdust, and organic industrial by-products.'
    },
    {
      name: 'Plastics & Polymers Scrap',
      slug: 'plastics-polymers',
      icon: 'Recycle',
      co2_factor_per_kg: 2.5,
      avg_market_price_inr: 65000,
      description: 'PET flakes, HDPE drum regrind, LDPE film rolls, PP automotive bumpers, and engineered polymer scrap.'
    },
    {
      name: 'Metal Scrap & Foundry Slag',
      slug: 'metal-slag',
      icon: 'Hammer',
      co2_factor_per_kg: 3.2,
      avg_market_price_inr: 35000,
      description: 'Foundry green sand, steel stamping offcuts, machining swarf, blast furnace slag, and aluminium turnings.'
    },
    {
      name: 'Textile Fibers & Garment Waste',
      slug: 'textile-fibers',
      icon: 'Scissors',
      co2_factor_per_kg: 1.6,
      avg_market_price_inr: 38000,
      description: 'Comber noils, denim cuttings, spinning mill waste, acrylic lint, and acoustic felt offcuts.'
    },
    {
      name: 'Fly Ash & Construction Waste',
      slug: 'flyash-construction',
      icon: 'Building',
      co2_factor_per_kg: 0.9,
      avg_market_price_inr: 1200,
      description: 'Dry thermal fly ash (Class F & C), bottom ash, brick rubble, and concrete crushed aggregate.'
    },
    {
      name: 'Industrial Oils & Spent Chemicals',
      slug: 'chemicals-lubricants',
      icon: 'Droplets',
      co2_factor_per_kg: 2.1,
      avg_market_price_inr: 30,
      description: 'Used hydraulic oil, transformer oil, spent solvents, pickling acid residues, and organic chemical sludges.'
    },
    {
      name: 'Paper, Pulp & Packaging',
      slug: 'paper-packaging',
      icon: 'Box',
      co2_factor_per_kg: 1.4,
      avg_market_price_inr: 14000,
      description: 'OCC 95/5 corrugated scrap, unprinted kraft cuttings, duplex board offcuts, and paper core tubes.'
    },
    {
      name: 'Glass & Ceramic Cullet',
      slug: 'glass-ceramics',
      icon: 'Layers',
      co2_factor_per_kg: 0.8,
      avg_market_price_inr: 4500,
      description: 'Flint clear glass cullet, amber bottle scrap, refractory ceramic broken tiles, and optical glass rejects.'
    }
  ];

  for (const cat of categories) {
    run(
      `INSERT INTO categories (name, slug, icon, co2_factor_per_kg, avg_market_price_inr, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cat.name, cat.slug, cat.icon, cat.co2_factor_per_kg, cat.avg_market_price_inr, cat.description]
    );
  }
  console.log('✓ Seeded 8 Industrial Categories');

  // 2. Companies (12 enterprises across Indian industrial hubs)
  const companies = [
    {
      name: 'Punjab Rice Industries',
      industry: 'Agro Processing & Rice Milling',
      state: 'Punjab',
      city: 'Ludhiana',
      address: 'Plot 44-48, Focal Point Phase V, Ludhiana, Punjab 141010',
      about: 'Premier automated rice milling and basmati processing plant with 40 tonnes/day milling capacity generating high-grade rice husk and bran.',
      is_verified: 1,
      verification_docs: 'GSTIN: 03AAACP1948Q1Z4 | Punjab Pollution Control Board Consent Valid till 2028',
      rating: 4.9,
      materials_generated: 'Rice Husk, Broken Rice, Rice Bran Pellets, Agro Ash',
      materials_required: 'Corrugated PP woven sacks, Jute bags, Industrial boiler fuel',
      phone: '+91 98140 22345',
      email: 'harpreet@punjabrice.com',
      website: 'https://punjabriceindustries.demo'
    },
    {
      name: 'Green Biomass Energy Ltd',
      industry: 'Biofuel & Renewable Power',
      state: 'Punjab',
      city: 'Rajpura',
      address: 'National Highway 44, Industrial Corridor, Rajpura, Punjab 140401',
      about: '15 MW biomass cogen energy plant and briquetting facility supplying clean steam and industrial briquettes to Northern India.',
      is_verified: 1,
      verification_docs: 'GSTIN: 03AABCG9812M1ZN | Punjab Energy Development Agency (PEDA) Certified',
      rating: 4.8,
      materials_generated: 'Potassium-rich Biomass Boiler Ash',
      materials_required: 'Rice Husk, Sugarcane Bagasse, Mustard Stalk, Cotton Stalk',
      phone: '+91 98765 44321',
      email: 'rajesh@greenbiomass.in',
      website: 'https://greenbiomassenergy.demo'
    },
    {
      name: 'Supreme PolyPlast Ltd',
      industry: 'Plastic Packaging & Injection Molding',
      state: 'Haryana',
      city: 'Manesar',
      address: 'Sector 8, IMT Manesar, Gurugram, Haryana 122050',
      about: 'High-speed automated injection and blow molding facility producing industrial containers, cosmetic caps, and PET bottles.',
      is_verified: 1,
      verification_docs: 'GSTIN: 06AABCS4455R1Z8 | ISO 14001:2015 Environmental System',
      rating: 4.7,
      materials_generated: 'PET Bottle Scrap Flakes, HDPE Runner Regrind, PP Purge Lumps',
      materials_required: 'Recycled HDPE masterbatch, PCR PET granules',
      phone: '+91 98110 55432',
      email: 'vikram@supremepoly.com',
      website: 'https://supremepolyplast.demo'
    },
    {
      name: 'EcoCycle Recyclers',
      industry: 'Polymer Reprocessing & Pellets',
      state: 'Delhi',
      city: 'Okhla',
      address: 'Phase III, Okhla Industrial Area, New Delhi 110020',
      about: 'State-of-the-art washing lines, optical sorting, and twin-screw extruders transforming post-industrial plastic waste into Grade A resin.',
      is_verified: 1,
      verification_docs: 'GSTIN: 07AAECE1122D1ZV | DPCC Hazardous & Solid Waste Authorization',
      rating: 4.9,
      materials_generated: 'Recycled rPET pellets, Recycled HDPE compound',
      materials_required: 'PET Scrap Flakes, HDPE Drums, LDPE Clean Shrink Film',
      phone: '+91 98101 88990',
      email: 'ananya@ecocycle.in',
      website: 'https://ecocyclerecyclers.demo'
    },
    {
      name: 'Panipat Textile Mills',
      industry: 'Yarn Spinning & Home Furnishings',
      state: 'Haryana',
      city: 'Panipat',
      address: 'Old Industrial Area, GT Road, Panipat, Haryana 132103',
      about: 'Integrated textile mill producing premium home textiles, blankets, and denim fabrics. High monthly yield of cotton combing waste.',
      is_verified: 1,
      verification_docs: 'GSTIN: 06AAAPM5566T1Z2 | Global Recycled Standard (GRS) Certified',
      rating: 4.6,
      materials_generated: 'Cotton Yarn Comber Noils, Denim Shreds, Polyester Rag Clips',
      materials_required: 'Recycled PET spun yarn, Sizing starches',
      phone: '+91 98960 77665',
      email: 'sandeep@panipattextiles.com',
      website: 'https://panipattextiles.demo'
    },
    {
      name: 'Shree Ram Thermal & Cement',
      industry: 'Cement & Construction Materials',
      state: 'Punjab',
      city: 'Bathinda',
      address: 'Thermal Road Industrial Zone, Bathinda, Punjab 151001',
      about: 'Portland Pozzolana Cement (PPC) and Autoclaved Aerated Concrete block manufacturer with massive demand for industrial pozzolans.',
      is_verified: 1,
      verification_docs: 'GSTIN: 03AABCS7788P1Z6 | Bureau of Indian Standards (BIS) CM/L-789012',
      rating: 4.8,
      materials_generated: 'Crushed Concrete Aggregates',
      materials_required: 'Dry Fly Ash Grade 1, Granulated Blast Furnace Slag, Gypsum by-product',
      phone: '+91 94170 33221',
      email: 'kljindal@shreeramthermal.com',
      website: 'https://shreeramthermal.demo'
    },
    {
      name: 'National Heavy Engineering',
      industry: 'Forging, Foundry & Heavy Machinery',
      state: 'Maharashtra',
      city: 'Pune',
      address: 'MIDC Bhosari Industrial Estate, Pune, Maharashtra 411026',
      about: 'Tier-1 automotive and railway component casting foundry operating high-capacity induction furnaces and sand mold lines.',
      is_verified: 1,
      verification_docs: 'GSTIN: 27AAACN3344K1ZS | Maharashtra Pollution Control Board (MPCB) Red Category',
      rating: 4.5,
      materials_generated: 'Spent Foundry Silica Sand, Steel Turnings, Machining Swarf, Slag',
      materials_required: 'Foundry coke, Pig iron scrap, High-purity scrap bundles',
      phone: '+91 98220 11998',
      email: 'nitin@nationalheavy.com',
      website: 'https://nationalheavyengineering.demo'
    },
    {
      name: 'Gujarat Chemical Synthetics',
      industry: 'Agro-chemicals & Specialty Organics',
      state: 'Gujarat',
      city: 'Dahej',
      address: 'PCPIR Industrial Zone, Dahej SEZ, Bharuch, Gujarat 392130',
      about: 'Synthesizing crop protection actives and specialty intermediates with solvent distillation and recovered by-product streams.',
      is_verified: 1,
      verification_docs: 'GSTIN: 24AAACG8899L1ZP | GPCB Consolidated Consent & Authorization',
      rating: 4.4,
      materials_generated: 'Spent Solvents, Calcium Sulfate Gypsum Sludge, Recovered Hydrochloric Acid',
      materials_required: 'Technical grade caustic soda, Activated carbon',
      phone: '+91 98250 66554',
      email: 'bhavin@gujaratchem.com',
      website: 'https://gujaratchem.demo'
    },
    {
      name: 'Jaipur Paper & Board Works',
      industry: 'Kraft Paper & Duplex Packaging',
      state: 'Rajasthan',
      city: 'Jaipur',
      address: 'VKIA Industrial Area, Sikar Road, Jaipur, Rajasthan 302013',
      about: '100% recycled paper mill manufacturing high-BF kraft fluting paper and duplex boards for e-commerce and FMCG packaging boxes.',
      is_verified: 1,
      verification_docs: 'GSTIN: 08AAACJ4433E1ZQ | FSC Certified Recycled Board',
      rating: 4.7,
      materials_generated: 'Paper Sludge Fiber Cake, Plastic Rejects from Pulper',
      materials_required: 'Corrugated Cardboard Waste (OCC), Unprinted Kraft Scraps, Bagasse Pulp',
      phone: '+91 98290 88776',
      email: 'ramesh@jaipurpaper.com',
      website: 'https://jaipurpaper.demo'
    },
    {
      name: 'Apex Auto Components',
      industry: 'Automotive Stamping & Precision Press',
      state: 'Rajasthan',
      city: 'Bhiwadi',
      address: 'Phase III, RIICO Industrial Area, Bhiwadi, Rajasthan 301019',
      about: 'Supplying stamped chassis body panels and hydraulic assemblies for leading OEMs in the Delhi-NCR automotive belt.',
      is_verified: 1,
      verification_docs: 'GSTIN: 08AAACA9900H1ZM | IATF 16949 Certified Manufacturer',
      rating: 4.6,
      materials_generated: 'Used Industrial Hydraulic Oil, Stamping Steel Trimmings, Aluminium Offcuts',
      materials_required: 'Cold rolled steel coils, Stamping lubricants',
      phone: '+91 98120 44889',
      email: 'gaurav@apexauto.in',
      website: 'https://apexauto.demo'
    },
    {
      name: 'Northern Bio-Fertilizers',
      industry: 'Organic Fertilizer & Soil Amendments',
      state: 'Haryana',
      city: 'Karnal',
      address: 'Indri Road Industrial Sector, Karnal, Haryana 132001',
      about: 'Formulating bio-enriched compost, humic concentrates, and granulated bio-fertilizers using industrial organic waste streams.',
      is_verified: 1,
      verification_docs: 'GSTIN: 06AAAFN2233J1Z7 | Ministry of Agriculture Organic Certification',
      rating: 4.8,
      materials_generated: 'Enriched Compost Granules',
      materials_required: 'Sugar Mill Press Mud, Brewery Spent Grain, Agro Ash, Distillery Sludge',
      phone: '+91 98130 99443',
      email: 'devender@northernbio.com',
      website: 'https://northernbiofertilizers.demo'
    },
    {
      name: 'Maha Clean Energy Corp',
      industry: 'Gasification & Industrial Biofuels',
      state: 'Maharashtra',
      city: 'Nagpur',
      address: 'Butibori Industrial Estate, Nagpur, Maharashtra 441108',
      about: 'Operating industrial gasifiers converting forestry and agro-industrial biomass residues into synthetic syngas and high-density pellets.',
      is_verified: 1,
      verification_docs: 'GSTIN: 27AAACM6677K1Z4 | Clean Development Mechanism (CDM) Registered',
      rating: 4.7,
      materials_generated: 'Biochar, Syngas Condensate',
      materials_required: 'Wood Sawdust, Sugarcane Bagasse, Agro Stalk Pellets',
      phone: '+91 98230 77123',
      email: 'sneha@mahacleanenergy.in',
      website: 'https://mahacleanenergy.demo'
    }
  ];

  for (const c of companies) {
    run(
      `INSERT INTO companies (name, industry, state, city, address, about, is_verified, verification_docs, rating, materials_generated, materials_required, phone, email, website)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.name, c.industry, c.state, c.city, c.address, c.about, c.is_verified, c.verification_docs, c.rating, c.materials_generated, c.materials_required, c.phone, c.email, c.website]
    );
  }
  console.log('✓ Seeded 12 Industrial Companies');

  // 3. Users (Auth + Demo Accounts)
  const defaultPasswordHash = bcrypt.hashSync('password123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  const users = [
    // Persona 1: SELLER DEMO
    {
      name: 'Harpreet Singh (Director of Operations)',
      email: 'seller@waste2market.com',
      password_hash: defaultPasswordHash,
      role: 'seller',
      company_id: 1 // Punjab Rice Industries
    },
    // Persona 2: BUYER DEMO
    {
      name: 'Rajesh Sharma (Head of Procurement)',
      email: 'buyer@waste2market.com',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      company_id: 2 // Green Biomass Energy Ltd
    },
    // Persona 3: ADMIN DEMO
    {
      name: 'Priya Nair (Lead Compliance & Verification Officer)',
      email: 'admin@waste2market.com',
      password_hash: adminPasswordHash,
      role: 'admin',
      company_id: null
    },
    // Other company users
    {
      name: 'Vikram Mehta',
      email: 'vikram@supremepoly.com',
      password_hash: defaultPasswordHash,
      role: 'seller',
      company_id: 3
    },
    {
      name: 'Ananya Sen',
      email: 'ananya@ecocycle.in',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      company_id: 4
    },
    {
      name: 'Sandeep Goel',
      email: 'sandeep@panipattextiles.com',
      password_hash: defaultPasswordHash,
      role: 'seller',
      company_id: 5
    },
    {
      name: 'K. L. Jindal',
      email: 'kljindal@shreeramthermal.com',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      company_id: 6
    },
    {
      name: 'Nitin Deshmukh',
      email: 'nitin@nationalheavy.com',
      password_hash: defaultPasswordHash,
      role: 'seller',
      company_id: 7
    },
    {
      name: 'Bhavin Patel',
      email: 'bhavin@gujaratchem.com',
      password_hash: defaultPasswordHash,
      role: 'seller',
      company_id: 8
    },
    {
      name: 'Ramesh Agarwal',
      email: 'ramesh@jaipurpaper.com',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      company_id: 9
    },
    {
      name: 'Gaurav Verma',
      email: 'gaurav@apexauto.in',
      password_hash: defaultPasswordHash,
      role: 'seller',
      company_id: 10
    },
    {
      name: 'Devender Gill',
      email: 'devender@northernbio.com',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      company_id: 11
    },
    {
      name: 'Sneha Kulkarni',
      email: 'sneha@mahacleanenergy.in',
      password_hash: defaultPasswordHash,
      role: 'buyer',
      company_id: 12
    }
  ];

  for (const u of users) {
    run(
      `INSERT INTO users (name, email, password_hash, role, company_id)
       VALUES (?, ?, ?, ?, ?)`,
      [u.name, u.email, u.password_hash, u.role, u.company_id]
    );
  }
  console.log('✓ Seeded 13 Users with Demo Personas');

  // 4. Industrial Waste Listings (22 realistic listings across India)
  const listings = [
    {
      unique_code: 'W2M-2026-1001',
      seller_company_id: 1, // Punjab Rice Industries
      title: 'Paddy Rice Husk (High Calorific Agro By-product)',
      category_id: 1, // Biomass
      description: 'Clean golden rice husk from modern parboiled basmati milling. Low moisture content (<9%), high calorific value (3,400 kcal/kg). Zero foreign stones or sand.',
      quantity: 10,
      unit: 'tonne',
      price_per_unit_inr: 4500,
      state: 'Punjab',
      city: 'Ludhiana',
      quality_grade: 'Grade A',
      availability_date: '2026-11-05',
      image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Biomass power generation, bio-pelletizing, boiler fuel, silica extraction',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1002',
      seller_company_id: 3, // Supreme PolyPlast
      title: 'Clear PET Flakes (Hot Washed Bottle Scrap)',
      category_id: 2, // Plastics
      description: 'Post-industrial transparent PET bottle trim and preform scrap, hot caustic washed, moisture <1%, PVC contamination <30ppm. Bulk packaged in 1-tonne jumbo bags.',
      quantity: 4,
      unit: 'tonne',
      price_per_unit_inr: 62000,
      state: 'Haryana',
      city: 'Manesar',
      quality_grade: 'Grade A',
      availability_date: '2026-11-04',
      image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      expected_use: 'rPET yarn spinning, polyester staple fiber, thermoform blister sheet',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1003',
      seller_company_id: 4, // EcoCycle
      title: 'Cardboard Corrugated Offcuts (OCC 95/5 Baled)',
      category_id: 7, // Paper
      description: 'Clean hydraulic compressed bales of double-wall corrugated cartons and die-cut sheet offcuts. Moisture certified under 10%.',
      quantity: 8,
      unit: 'tonne',
      price_per_unit_inr: 14000,
      state: 'Delhi',
      city: 'Okhla',
      quality_grade: 'Grade A',
      availability_date: '2026-11-03',
      image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Kraft paper pulping, testliner manufacturing, molded fiber packaging',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1004',
      seller_company_id: 6, // Shree Ram Thermal (as generator of bottom ash)
      title: 'Electrostatic Precipitator Dry Fly Ash (Class F)',
      category_id: 5, // Fly Ash
      description: 'Pneumatically collected dry siliceous fly ash conforming to IS:3812 Part 1. Fineness 340 m2/kg, reactive silica >55%, LOI <2.5%. Available for bulk tanker dispatch.',
      quantity: 45,
      unit: 'tonne',
      price_per_unit_inr: 1150,
      state: 'Punjab',
      city: 'Bathinda',
      quality_grade: 'Grade A',
      availability_date: '2026-11-08',
      image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      expected_use: 'PPC cement blending, ready-mix concrete, AAC lightweight blocks, pavement sub-base',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1005',
      seller_company_id: 5, // Panipat Textile Mills
      title: '100% Cotton Yarn Comber Noils & Ring Waste',
      category_id: 4, // Textile
      description: 'Virgin combed cotton fiber waste from ring spinning frames. Staple length 18-22mm, clean white color, zero synthetic contamination. Compressed in 160kg bales.',
      quantity: 1.5,
      unit: 'tonne',
      price_per_unit_inr: 42000,
      state: 'Haryana',
      city: 'Panipat',
      quality_grade: 'Grade A',
      availability_date: '2026-11-06',
      image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Rotor open-end spinning (Ne 6s to 12s), surgical absorbent cotton, banknote paper',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1006',
      seller_company_id: 10, // Apex Auto Components
      title: 'Filtered Used Hydraulic Oil (ISO VG 46/68 Grade)',
      category_id: 6, // Oils & Chemicals
      description: 'Recovered hydraulic fluid drained during press preventative maintenance. Screen filtered to 25 micron, water content <0.8%, stored in sealed 210-litre MS barrels.',
      quantity: 1200,
      unit: 'litre',
      price_per_unit_inr: 28,
      state: 'Rajasthan',
      city: 'Bhiwadi',
      quality_grade: 'Industrial Reusable',
      availability_date: '2026-11-04',
      image_url: 'https://images.unsplash.com/photo-1618090584176-7132b9911661?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Lube oil re-refining into base oil, furnace burner fuel blending, chain lubricant',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1007',
      seller_company_id: 1, // Punjab Rice Industries
      title: 'Sugarcane Bagasse Bales (Sun Dried Fibers)',
      category_id: 1, // Biomass
      description: 'Depithed sugarcane fibrous bagasse residue. Solar dried to 18% moisture. Baled for convenient flatbed trailer haulage.',
      quantity: 25,
      unit: 'tonne',
      price_per_unit_inr: 2800,
      state: 'Uttar Pradesh',
      city: 'Muzaffarnagar',
      quality_grade: 'Grade B',
      availability_date: '2026-11-10',
      image_url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Co-generation thermal boilers, particle board manufacturing, eco tableware molding',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1008',
      seller_company_id: 7, // National Heavy Engineering
      title: 'Spent Foundry Silica Green Sand',
      category_id: 3, // Metal & Foundry
      description: 'Used bentonite-bonded silica green sand discarded from gray iron casting shakeout. Magnetically separated to remove all ferrous tramp metal.',
      quantity: 30,
      unit: 'tonne',
      price_per_unit_inr: 650,
      state: 'Maharashtra',
      city: 'Pune',
      quality_grade: 'Industrial Reusable',
      availability_date: '2026-11-07',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Asphalt paving aggregate, cement kiln silica source, fly ash brick filler',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1009',
      seller_company_id: 10, // Apex Auto Components
      title: 'Aluminium Stamping Trimmings & CNC Swarf (Alloy 6061)',
      category_id: 3, // Metal
      description: 'High purity clean 6061 aircraft/auto grade aluminium stamp offcuts and de-oiled CNC turnings. Dry, briquetted, recovery yield >94%.',
      quantity: 3.5,
      unit: 'tonne',
      price_per_unit_inr: 142000,
      state: 'Haryana',
      city: 'Gurgaon',
      quality_grade: 'Grade A',
      availability_date: '2026-11-05',
      image_url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Aluminium ingot re-melting, secondary alloying, die-casting billets',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1010',
      seller_company_id: 5, // Panipat Textile Mills
      title: 'Denim Fabric Clips (Indigo Dyed Shreds)',
      category_id: 4, // Textile
      description: 'Indigo dyed denim fabric cutting table scraps. 98% cotton 2% elastane blend, sorted by shade, baled into 200kg units.',
      quantity: 2,
      unit: 'tonne',
      price_per_unit_inr: 36000,
      state: 'Haryana',
      city: 'Panipat',
      quality_grade: 'Grade B',
      availability_date: '2026-11-09',
      image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Recycled denim yarn, thermal and acoustic insulation batts, handmade artisan paper',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1011',
      seller_company_id: 3, // Supreme PolyPlast
      title: 'High Density Polyethylene (HDPE) Chemical Drum Regrind',
      category_id: 2, // Plastics
      description: 'Shredded flakes from triple-rinsed industrial 200L chemical drums. Blue color, melt flow index 0.05-0.15 g/10min. Cleaned and dried.',
      quantity: 5,
      unit: 'tonne',
      price_per_unit_inr: 58000,
      state: 'Himachal Pradesh',
      city: 'Baddi',
      quality_grade: 'Grade A',
      availability_date: '2026-11-12',
      image_url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Corrugated drainage pipe extrusion, road barricades, pallet molding',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1012',
      seller_company_id: 8, // Gujarat Chemical Synthetics
      title: 'Recovered Pickling Hydrochloric Acid (18% Technical Grade)',
      category_id: 6, // Chemicals
      description: 'Spent steel pickling acid regenerated via distillation. Clean yellow-greenish solution free from excessive heavy metals.',
      quantity: 3000,
      unit: 'litre',
      price_per_unit_inr: 12,
      state: 'Gujarat',
      city: 'Dahej',
      quality_grade: 'Industrial Reusable',
      availability_date: '2026-11-15',
      image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Ferric chloride coagulant manufacturing, ETP pH neutralization, oil well acidizing',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1013',
      seller_company_id: 9, // Jaipur Paper
      title: 'Heavy Duty Paper Core Tubes & Roll Rejects',
      category_id: 7, // Paper
      description: 'Spiral wound thick kraft cores from newsprint and film rewinding. High compressive crush strength, ideal for re-cutting or hydrapulping.',
      quantity: 4,
      unit: 'tonne',
      price_per_unit_inr: 16000,
      state: 'Rajasthan',
      city: 'Jaipur',
      quality_grade: 'Grade A',
      availability_date: '2026-11-11',
      image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Re-use as winding cores, high yield packaging pulp, edge protectors',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1014',
      seller_company_id: 11, // Northern Bio-Fertilizers
      title: 'Brewery Spent Barley Grain (Wet Distillers Residue)',
      category_id: 1, // Biomass
      description: 'Protein and fiber rich spent grain from malt mashing. 24% crude protein on dry basis. Freshly discharged, suitable for immediate drying or ensiling.',
      quantity: 14,
      unit: 'tonne',
      price_per_unit_inr: 3800,
      state: 'Rajasthan',
      city: 'Alwar',
      quality_grade: 'Grade B',
      availability_date: '2026-11-04',
      image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Cattle feed compounding, mushroom cultivation substrate, biogas feedstock',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1015',
      seller_company_id: 12, // Maha Clean Energy
      title: 'Pine & Hardwood Sawdust Residue (Kiln Dried)',
      category_id: 1, // Biomass
      description: 'Fine clean sawdust generated from timber sawing and plywood seasoning. Moisture <8%, uniform particle size, low silica ash.',
      quantity: 18,
      unit: 'tonne',
      price_per_unit_inr: 3200,
      state: 'Haryana',
      city: 'Yamunanagar',
      quality_grade: 'Grade A',
      availability_date: '2026-11-07',
      image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Biomass white wood pellets, agarbatti powder, wood plastic composite (WPC)',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1016',
      seller_company_id: 7, // National Heavy Engineering
      title: 'Granulated Blast Furnace Slag (GGBS Raw Feed)',
      category_id: 3, // Metal & Slag
      description: 'Rapidly water-quenched glassy metallurgical slag. Glass content >92%, moisture <10%, uniform sandy grain consistency.',
      quantity: 50,
      unit: 'tonne',
      price_per_unit_inr: 850,
      state: 'Maharashtra',
      city: 'Pune',
      quality_grade: 'Grade A',
      availability_date: '2026-11-18',
      image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
      expected_use: 'GGBS cement production, marine concrete durability enhancer, soil stabilization',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1017',
      seller_company_id: 3, // Supreme PolyPlast
      title: 'Crushed Clear Soda-Lime Glass Cullet',
      category_id: 8, // Glass
      description: 'Color-sorted crushed flint bottle cullet, size 10-25mm, free of ceramics, stone and metal caps. Ready for furnace charge.',
      quantity: 8,
      unit: 'tonne',
      price_per_unit_inr: 4200,
      state: 'Uttar Pradesh',
      city: 'Meerut',
      quality_grade: 'Grade A',
      availability_date: '2026-11-14',
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Container glass melting, glass wool insulation, reflective road marking beads',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1018',
      seller_company_id: 5, // Panipat Textile Mills
      title: 'Cotton Ginning Micro-Trash & Seed Linters',
      category_id: 4, // Textile
      description: 'Cellulose-rich ginning byproduct from cotton ginning factories. High alpha-cellulose content suitable for chemical dissolution.',
      quantity: 6,
      unit: 'tonne',
      price_per_unit_inr: 24000,
      state: 'Punjab',
      city: 'Bathinda',
      quality_grade: 'Grade B',
      availability_date: '2026-11-16',
      image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Cellulose acetate, nitrocellulose, security bond paper, viscous rayon',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1019',
      seller_company_id: 8, // Gujarat Chemical Synthetics
      title: 'Phosphogypsum Cake Byproduct (Calcium Sulfate Dihydrate)',
      category_id: 6, // Chemicals
      description: 'Washed and neutralized chemical gypsum from wet-process phosphoric acid reaction. Purity CaSO4.2H2O >90%, neutral pH (6.5-7.5).',
      quantity: 35,
      unit: 'tonne',
      price_per_unit_inr: 550,
      state: 'Gujarat',
      city: 'Dahej',
      quality_grade: 'Industrial Reusable',
      availability_date: '2026-11-20',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Cement retarder additive, plasterboard (drywall) core, sodic soil reclamation',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1020',
      seller_company_id: 10, // Apex Auto Components
      title: 'End-of-Life Vulcanized Rubber Tire Crumb (30 Mesh)',
      category_id: 2, // Plastics/Polymers
      description: 'Ambient mechanical crumb rubber derived from truck tire tread peel. Free of steel cord wires and nylon fluffs (magnetic & air classified).',
      quantity: 7,
      unit: 'tonne',
      price_per_unit_inr: 32000,
      state: 'Delhi',
      city: 'Delhi',
      quality_grade: 'Grade A',
      availability_date: '2026-11-12',
      image_url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Crumb Rubber Modified Bitumen (CRMB) road surfacing, athletic running tracks, molded playground tiles',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1021',
      seller_company_id: 7, // National Heavy Engineering
      title: 'Hot Dip Galvanizing Zinc Dross / Skimmings',
      category_id: 3, // Metal
      description: 'Top and bottom zinc dross skimmings containing 90-94% metallic zinc and zinc oxide from continuous steel strip galvanizing pot.',
      quantity: 2,
      unit: 'tonne',
      price_per_unit_inr: 185000,
      state: 'Rajasthan',
      city: 'Bhiwadi',
      quality_grade: 'Grade A',
      availability_date: '2026-11-10',
      image_url: 'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Zinc oxide (French process) chemical production, zinc sulphate fertilizer, secondary zinc smelting',
      status: 'ACTIVE'
    },
    {
      unique_code: 'W2M-2026-1022',
      seller_company_id: 6, // Shree Ram Thermal
      title: 'Demolition Crushed Brick & Masonry Aggregate (0-20mm)',
      category_id: 5, // Fly Ash & Construction
      description: 'Recycled concrete and red clay brick crushed aggregate. Screened 0-20mm well graded, washed to eliminate excessive dust.',
      quantity: 40,
      unit: 'tonne',
      price_per_unit_inr: 450,
      state: 'Uttar Pradesh',
      city: 'Noida',
      quality_grade: 'Industrial Reusable',
      availability_date: '2026-11-05',
      image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
      expected_use: 'Sub-base road construction, drainage bedding, interlocking permeable pavers',
      status: 'ACTIVE'
    }
  ];

  for (const l of listings) {
    run(
      `INSERT INTO listings (unique_code, seller_company_id, title, category_id, description, quantity, unit, price_per_unit_inr, state, city, quality_grade, availability_date, image_url, expected_use, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [l.unique_code, l.seller_company_id, l.title, l.category_id, l.description, l.quantity, l.unit, l.price_per_unit_inr, l.state, l.city, l.quality_grade, l.availability_date, l.image_url, l.expected_use, l.status]
    );
  }
  console.log('✓ Seeded 22 Realistic Industrial Waste Listings');

  // 5. Buyer Procurement Requirements (For the Smart Matching Engine)
  const requirements = [
    {
      buyer_company_id: 2, // Green Biomass Energy Ltd (Rajpura, Punjab)
      category_id: 1, // Biomass
      material_name: 'Rice Husk',
      min_quantity: 8,
      max_quantity: 15,
      unit: 'tonne',
      max_budget_per_unit_inr: 5000,
      preferred_states: 'Punjab, Haryana, Chandigarh',
      min_quality_grade: 'Grade B'
    },
    {
      buyer_company_id: 4, // EcoCycle Recyclers (Okhla, Delhi)
      category_id: 2, // Plastics
      material_name: 'PET Flakes / Scrap',
      min_quantity: 3,
      max_quantity: 10,
      unit: 'tonne',
      max_budget_per_unit_inr: 66000,
      preferred_states: 'Delhi, Haryana, Uttar Pradesh, Rajasthan',
      min_quality_grade: 'Grade A'
    },
    {
      buyer_company_id: 6, // Shree Ram Thermal & Cement (Bathinda, Punjab)
      category_id: 5, // Fly Ash
      material_name: 'Fly Ash Grade 1',
      min_quantity: 30,
      max_quantity: 100,
      unit: 'tonne',
      max_budget_per_unit_inr: 1300,
      preferred_states: 'Punjab, Haryana, Rajasthan',
      min_quality_grade: 'Grade A'
    },
    {
      buyer_company_id: 9, // Jaipur Paper & Board (Jaipur, Rajasthan)
      category_id: 7, // Paper
      material_name: 'Cardboard Corrugated Waste',
      min_quantity: 5,
      max_quantity: 20,
      unit: 'tonne',
      max_budget_per_unit_inr: 15500,
      preferred_states: 'Rajasthan, Delhi, Haryana, Gujarat',
      min_quality_grade: 'Grade B'
    },
    {
      buyer_company_id: 11, // Northern Bio-Fertilizers (Karnal, Haryana)
      category_id: 1, // Biomass
      material_name: 'Sugarcane Bagasse & Press Mud',
      min_quantity: 15,
      max_quantity: 40,
      unit: 'tonne',
      max_budget_per_unit_inr: 3000,
      preferred_states: 'Haryana, Punjab, Uttar Pradesh',
      min_quality_grade: 'Grade B'
    },
    {
      buyer_company_id: 12, // Maha Clean Energy (Nagpur, Maharashtra)
      category_id: 1, // Biomass
      material_name: 'Sawdust & Wood Residue',
      min_quantity: 10,
      max_quantity: 25,
      unit: 'tonne',
      max_budget_per_unit_inr: 3500,
      preferred_states: 'Maharashtra, Madhya Pradesh, Gujarat',
      min_quality_grade: 'Grade A'
    }
  ];

  for (const r of requirements) {
    run(
      `INSERT INTO buyer_requirements (buyer_company_id, category_id, material_name, min_quantity, max_quantity, unit, max_budget_per_unit_inr, preferred_states, min_quality_grade)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.buyer_company_id, r.category_id, r.material_name, r.min_quantity, r.max_quantity, r.unit, r.max_budget_per_unit_inr, r.preferred_states, r.min_quality_grade]
    );
  }
  console.log('✓ Seeded 6 Buyer Procurement Requirements');

  // 6. Seed Initial Offers and Deals
  // Deal 1: Completed Deal (EcoCycle bought PET flakes from Supreme PolyPlast)
  const offer1 = run(
    `INSERT INTO offers (listing_id, buyer_company_id, seller_company_id, offered_quantity, offered_price_per_unit_inr, total_amount_inr, logistics_preference, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [2, 4, 3, 4, 61000, 244000, 'BUYER_PICKUP', 'We will send our dedicated 20ft container vehicle for factory gate pickup from Manesar.', 'ACCEPTED']
  );

  const deal1Events = JSON.stringify([
    { status: 'ACCEPTED', timestamp: '2026-10-25T10:00:00Z', note: 'Offer accepted by Supreme PolyPlast Ltd' },
    { status: 'LOGISTICS_ARRANGED', timestamp: '2026-10-26T14:30:00Z', note: 'Buyer logistics vehicle HR-55-AK-9042 dispatched to Manesar plant' },
    { status: 'PROCESSING', timestamp: '2026-10-27T09:15:00Z', note: 'Quality inspection passed at Okhla facility (Moisture 0.8%, PVC <25ppm)' },
    { status: 'COMPLETED', timestamp: '2026-10-28T16:00:00Z', note: 'Payment processed and 4 Tonnes PET plastic diverted to rPET yarn manufacturing' }
  ]);

  const deal1 = run(
    `INSERT INTO deals (deal_code, offer_id, listing_id, buyer_company_id, seller_company_id, agreed_quantity, agreed_price_per_unit_inr, total_deal_value_inr, status, timeline_events, notes, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['DEAL-W2M-7701', offer1.lastInsertRowid, 2, 4, 3, 4, 61000, 244000, 'COMPLETED', deal1Events, 'High quality clear PET flakes successfully reprocessed into staple fibers.', '2026-10-28 16:00:00']
  );

  // Impact log for deal 1: 4 tonnes = 4000 kg, CO2 avoided = 4000 * 2.5 = 10,000 kg CO2!
  run(
    `INSERT INTO impact_logs (deal_id, waste_diverted_kg, co2_avoided_kg, economic_value_inr)
     VALUES (?, ?, ?, ?)`,
    [deal1.lastInsertRowid, 4000, 10000, 244000]
  );

  // Deal 2: Active / Processing Deal (Jaipur Paper bought Cardboard from EcoCycle)
  const offer2 = run(
    `INSERT INTO offers (listing_id, buyer_company_id, seller_company_id, offered_quantity, offered_price_per_unit_inr, total_amount_inr, logistics_preference, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [3, 9, 4, 8, 13800, 110400, 'SELLER_DELIVER', 'Need fast dispatch to Jaipur mill for kraft paper batch run.', 'ACCEPTED']
  );

  const deal2Events = JSON.stringify([
    { status: 'ACCEPTED', timestamp: '2026-10-29T11:00:00Z', note: 'Offer accepted by EcoCycle Recyclers' },
    { status: 'LOGISTICS_ARRANGED', timestamp: '2026-10-30T15:00:00Z', note: 'Truck loaded at Okhla Delhi hub en route to Jaipur VKIA' },
    { status: 'PROCESSING', timestamp: '2026-11-01T10:00:00Z', note: 'Consignment arrived at Jaipur paper mill. Quality verification under way.' }
  ]);

  const deal2 = run(
    `INSERT INTO deals (deal_code, offer_id, listing_id, buyer_company_id, seller_company_id, agreed_quantity, agreed_price_per_unit_inr, total_deal_value_inr, status, timeline_events, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ['DEAL-W2M-7702', offer2.lastInsertRowid, 3, 9, 4, 8, 13800, 110400, 'PROCESSING', deal2Events, 'Corrugated scrap consignment in transit for kraft fluting pulp.']
  );

  // Impact log for deal 2: 8 tonnes = 8000 kg, CO2 avoided = 8000 * 1.4 = 11,200 kg CO2!
  run(
    `INSERT INTO impact_logs (deal_id, waste_diverted_kg, co2_avoided_kg, economic_value_inr)
     VALUES (?, ?, ?, ?)`,
    [deal2.lastInsertRowid, 8000, 11200, 110400]
  );

  // Historical macro impact data (Simulating platform growth: total ~12,450 KG waste diverted, ₹8.4 Lakhs value)
  run(
    `INSERT INTO impact_logs (deal_id, waste_diverted_kg, co2_avoided_kg, economic_value_inr)
     VALUES (NULL, 450, 810, 485600)`
  );

  // Offer 3: Active Pending Offer from Green Biomass Energy to Punjab Rice Industries (Ready for Demo!)
  run(
    `INSERT INTO offers (listing_id, buyer_company_id, seller_company_id, offered_quantity, offered_price_per_unit_inr, total_amount_inr, logistics_preference, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [1, 2, 1, 10, 4400, 44000, 'BUYER_PICKUP', 'Greetings from Green Biomass Energy. We can immediately lift the full 10-tonne lot of Rice Husk using our tractor-trailer fleet from your Ludhiana mill gate at ₹4,400/tonne.', 'OFFER_SENT']
  );

  // Reviews
  run(
    `INSERT INTO reviews (from_company_id, to_company_id, deal_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [4, 3, deal1.lastInsertRowid, 5, 'Supreme PolyPlast delivered exceptional grade PET scrap. Moisture was verified under 1% and zero PVC contamination. Highly recommended partner!']
  );

  run(
    `INSERT INTO reviews (from_company_id, to_company_id, deal_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [3, 4, deal1.lastInsertRowid, 5, 'EcoCycle arrived promptly with their own container logistics. Smooth payment settlement within 24 hours. Excellent circular partnership.']
  );

  // Notifications
  run(
    `INSERT INTO notifications (user_id, title, message, type, link)
     VALUES (?, ?, ?, ?, ?)`,
    [1, 'New Purchase Offer Received', 'Green Biomass Energy Ltd sent an offer of ₹44,000 for your 10-tonne Rice Husk lot.', 'offer', '/deals']
  );

  run(
    `INSERT INTO notifications (user_id, title, message, type, link)
     VALUES (?, ?, ?, ?, ?)`,
    [2, 'High Compatibility Material Match', 'New listing "Paddy Rice Husk" by Punjab Rice Industries matches your requirement with a 94% match score!', 'match', '/marketplace/1']
  );

  run(
    `INSERT INTO notifications (user_id, title, message, type, link)
     VALUES (?, ?, ?, ?, ?)`,
    [3, 'Admin System Update', 'Welcome to Waste2Market Admin Operations. 12 industrial facilities verified, 22 active circular listings monitored.', 'system', '/admin']
  );

  console.log('✓ Seeded Deals, Offers, Reviews, Impact Logs and Notifications');
  console.log('🎉 Database seeding complete! Ready for hackathon demonstration.');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
