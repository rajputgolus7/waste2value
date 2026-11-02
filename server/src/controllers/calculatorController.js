/**
 * Waste Value Calculator Controller
 * Calculates economic recovery, net value, savings, and CO2 abatement
 */

const MATERIAL_PRESETS = [
  {
    material: 'Rice Husk',
    unit: 'tonne',
    defaultQty: 10,
    disposalCostPerUnit: 2000, // dumping/burning cost
    marketPricePerUnit: 4500,
    transportCostPerUnit: 800,
    co2PerUnitKg: 1800
  },
  {
    material: 'PET Plastic Scrap',
    unit: 'tonne',
    defaultQty: 4,
    disposalCostPerUnit: 8000,
    marketPricePerUnit: 62000,
    transportCostPerUnit: 3500,
    co2PerUnitKg: 2500
  },
  {
    material: 'Corrugated Cardboard',
    unit: 'tonne',
    defaultQty: 8,
    disposalCostPerUnit: 2500,
    marketPricePerUnit: 14000,
    transportCostPerUnit: 1200,
    co2PerUnitKg: 1400
  },
  {
    material: 'Dry Fly Ash',
    unit: 'tonne',
    defaultQty: 40,
    disposalCostPerUnit: 400, // ash pond dumping cost
    marketPricePerUnit: 1150,
    transportCostPerUnit: 350,
    co2PerUnitKg: 900
  },
  {
    material: 'Used Hydraulic Oil',
    unit: 'litre',
    defaultQty: 1500,
    disposalCostPerUnit: 8, // hazardous waste disposal fee
    marketPricePerUnit: 28,
    transportCostPerUnit: 3,
    co2PerUnitKg: 2.1
  },
  {
    material: 'Cotton Comber Noils',
    unit: 'tonne',
    defaultQty: 2,
    disposalCostPerUnit: 6000,
    marketPricePerUnit: 42000,
    transportCostPerUnit: 2000,
    co2PerUnitKg: 1600
  }
];

exports.getPresets = (req, res) => {
  res.json(MATERIAL_PRESETS);
};

exports.calculate = (req, res) => {
  try {
    const {
      material = 'Rice Husk',
      quantity = 10,
      unit = 'tonne',
      currentDisposalCost,
      estimatedMarketPrice,
      transportationCost
    } = req.body;

    const qty = Number(quantity) || 1;

    // Use user inputs or smart defaults
    const preset = MATERIAL_PRESETS.find(p => p.material.toLowerCase() === material.toLowerCase()) || MATERIAL_PRESETS[0];

    const disposalCost = currentDisposalCost !== undefined ? Number(currentDisposalCost) : (preset.disposalCostPerUnit * qty);
    const sellingPricePerUnit = estimatedMarketPrice !== undefined ? Number(estimatedMarketPrice) : preset.marketPricePerUnit;
    const grossSellingRevenue = Math.round(qty * sellingPricePerUnit);

    const transportCost = transportationCost !== undefined ? Number(transportationCost) : Math.round(preset.transportCostPerUnit * qty);

    // Net Recovered Value = Potential Selling Revenue - Transportation Cost
    const netSellingRevenue = grossSellingRevenue - transportCost;

    // Potential Savings / Total Economic Opportunity = Net Selling Revenue + Avoided Disposal Cost
    // Or Net Recovered Value from trade: Revenue - Transport = Recovered Cashflow
    const netRecoveredValue = Math.max(0, netSellingRevenue);
    const totalEconomicOpportunity = netRecoveredValue + disposalCost;

    // Environmental metrics
    let weightInKg = qty;
    if (unit === 'tonne') weightInKg = qty * 1000;
    if (unit === 'litre') weightInKg = qty * 0.9;
    const co2AvoidedKg = Math.round(weightInKg * (preset.co2PerUnitKg / (preset.unit === 'tonne' ? 1000 : 1)));

    const summaryText = `By selling this ${qty} ${unit} of ${material} instead of disposing of it, the company can potentially recover ₹${netRecoveredValue.toLocaleString('en-IN')} in net revenue and eliminate ₹${disposalCost.toLocaleString('en-IN')} in disposal costs (Total Economic Swing: ₹${totalEconomicOpportunity.toLocaleString('en-IN')}).`;

    res.json({
      material,
      quantity: qty,
      unit,
      currentDisposalCost: Math.round(disposalCost),
      potentialSellingRevenue: grossSellingRevenue,
      transportationCost: Math.round(transportCost),
      netEconomicValue: netRecoveredValue,
      totalEconomicOpportunity,
      co2AvoidedKg,
      summaryText,
      roiMultiplier: disposalCost > 0 ? Number((totalEconomicOpportunity / disposalCost).toFixed(1)) : 0
    });
  } catch (err) {
    console.error('Calculator error:', err);
    res.status(500).json({ error: 'Calculation failed' });
  }
};
