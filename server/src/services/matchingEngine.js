const { getDistanceKm, estimateLogisticsCost } = require('./distanceService');

/**
 * 6-Factor Smart Waste Matching Algorithm
 * Calculates deterministic match score (0-100%) and generates structured explanation items.
 */
function calculateMatch(listing, requirement, buyerCompany) {
  // 1. Material Compatibility (Weight: 30%)
  let materialScore = 0;
  const listingTitle = (listing.title || '').toLowerCase();
  const listingDesc = (listing.description || '').toLowerCase();
  const reqMaterial = (requirement.material_name || '').toLowerCase();
  const reqCategory = Number(requirement.category_id);
  const listingCategory = Number(listing.category_id);

  const categoryMatch = reqCategory === listingCategory;
  const keywordMatch = listingTitle.includes(reqMaterial) || reqMaterial.includes(listingTitle) || listingDesc.includes(reqMaterial);

  if (categoryMatch && keywordMatch) {
    materialScore = 1.0;
  } else if (categoryMatch) {
    materialScore = 0.75;
  } else if (keywordMatch) {
    materialScore = 0.65;
  } else {
    // Check if buyer company's materials_required mentions listing
    const materialsRequired = (buyerCompany.materials_required || '').toLowerCase();
    if (materialsRequired.includes(listingTitle) || listingTitle.split(' ').some(w => w.length > 3 && materialsRequired.includes(w))) {
      materialScore = 0.8;
    } else {
      materialScore = 0.2;
    }
  }

  // 2. Quantity Compatibility (Weight: 20%)
  let quantityScore = 0;
  const listingQty = Number(listing.quantity) || 1;
  const minReq = Number(requirement.min_quantity) || 1;
  const maxReq = Number(requirement.max_quantity) || (minReq * 3);

  if (listingQty >= minReq && listingQty <= maxReq) {
    quantityScore = 1.0;
  } else if (listingQty >= minReq * 0.7 && listingQty <= maxReq * 1.3) {
    quantityScore = 0.8;
  } else if (listingQty >= minReq * 0.4 && listingQty <= maxReq * 1.8) {
    quantityScore = 0.55;
  } else {
    quantityScore = 0.3;
  }

  // 3. Geographic Distance (Weight: 20%)
  const distanceKm = getDistanceKm(listing.city, buyerCompany.city);
  let distanceScore = 0;
  if (distanceKm <= 100) {
    distanceScore = 1.0;
  } else if (distanceKm <= 200) {
    distanceScore = 0.88;
  } else if (distanceKm <= 350) {
    distanceScore = 0.70;
  } else if (distanceKm <= 600) {
    distanceScore = 0.50;
  } else {
    distanceScore = 0.35;
  }

  // 4. Price Compatibility (Weight: 15%)
  let priceScore = 0;
  const listingPrice = Number(listing.price_per_unit_inr) || 1;
  const maxBudget = Number(requirement.max_budget_per_unit_inr) || listingPrice;

  if (listingPrice <= maxBudget) {
    // Discount bonus: under budget is great!
    priceScore = 1.0;
  } else if (listingPrice <= maxBudget * 1.1) {
    priceScore = 0.85;
  } else if (listingPrice <= maxBudget * 1.25) {
    priceScore = 0.65;
  } else {
    priceScore = 0.30;
  }

  // 5. Quality Grade Compatibility (Weight: 10%)
  let qualityScore = 0;
  const listingGrade = (listing.quality_grade || 'Grade A').trim();
  const reqMinGrade = (requirement.min_quality_grade || 'Grade B').trim();

  const gradeRank = { 'Grade A': 3, 'Grade B': 2, 'Industrial Reusable': 1 };
  const listingRank = gradeRank[listingGrade] || 2;
  const reqRank = gradeRank[reqMinGrade] || 2;

  if (listingRank >= reqRank) {
    qualityScore = 1.0;
  } else if (listingRank === reqRank - 1) {
    qualityScore = 0.7;
  } else {
    qualityScore = 0.4;
  }

  // 6. Availability Schedule (Weight: 5%)
  let availabilityScore = 1.0;
  const availDate = new Date(listing.availability_date || Date.now());
  const now = new Date();
  const daysDiff = (availDate - now) / (1000 * 60 * 60 * 24);
  if (daysDiff <= 7) {
    availabilityScore = 1.0;
  } else if (daysDiff <= 30) {
    availabilityScore = 0.85;
  } else {
    availabilityScore = 0.65;
  }

  // Total weighted score (0 - 100%)
  const totalScore = Math.round(
    (materialScore * 30) +
    (quantityScore * 20) +
    (distanceScore * 20) +
    (priceScore * 15) +
    (qualityScore * 10) +
    (availabilityScore * 5)
  );

  // Generate factors checklist with checkmarks/crosses and explanatory notes
  const factors = [
    {
      name: 'Material compatibility',
      status: materialScore >= 0.7,
      score: Math.round(materialScore * 100),
      explanation: materialScore >= 0.7
        ? `Compatible feedstock: ${listing.title} matches buyer requirement for ${requirement.material_name}`
        : `Partial material alignment with buyer processing setup`
    },
    {
      name: 'Quantity compatible',
      status: quantityScore >= 0.7,
      score: Math.round(quantityScore * 100),
      explanation: quantityScore >= 0.7
        ? `${listing.quantity} ${listing.unit} is within preferred procurement window (${minReq}–${maxReq} ${listing.unit})`
        : `Quantity is outside ideal single-lot procurement volume`
    },
    {
      name: 'Within preferred distance',
      status: distanceScore >= 0.7,
      score: Math.round(distanceScore * 100),
      explanation: distanceScore >= 0.7
        ? `${distanceKm} km from ${listing.city} to ${buyerCompany.city} (optimal transport radius)`
        : `${distanceKm} km distance incurs higher inter-state freight`
    },
    {
      name: 'Price acceptable',
      status: priceScore >= 0.7,
      score: Math.round(priceScore * 100),
      explanation: priceScore >= 0.7
        ? `₹${listing.price_per_unit_inr}/${listing.unit} matches or is below budget (max ₹${maxBudget}/${listing.unit})`
        : `Asking price ₹${listing.price_per_unit_inr} slightly exceeds target budget ₹${maxBudget}`
    },
    {
      name: 'Required quality available',
      status: qualityScore >= 0.7,
      score: Math.round(qualityScore * 100),
      explanation: qualityScore >= 0.7
        ? `${listingGrade} meets/exceeds minimum required specification (${reqMinGrade})`
        : `Material grade may require additional pre-processing`
    },
    {
      name: 'Immediate dispatch availability',
      status: availabilityScore >= 0.8,
      score: Math.round(availabilityScore * 100),
      explanation: availabilityScore >= 0.8
        ? `Lot ready for immediate dispatch (${listing.availability_date || 'Ready'})`
        : `Scheduled for future batch release`
    }
  ];

  const estimatedLogistics = estimateLogisticsCost(listing.quantity, listing.unit, distanceKm);

  return {
    score: totalScore,
    distanceKm,
    estimatedLogisticsInr: estimatedLogistics,
    buyerCompany: {
      id: buyerCompany.id,
      name: buyerCompany.name,
      industry: buyerCompany.industry,
      city: buyerCompany.city,
      state: buyerCompany.state,
      is_verified: buyerCompany.is_verified,
      rating: buyerCompany.rating
    },
    requirement: {
      id: requirement.id,
      material_name: requirement.material_name,
      min_quantity: requirement.min_quantity,
      max_quantity: requirement.max_quantity,
      max_budget_per_unit_inr: requirement.max_budget_per_unit_inr
    },
    factors
  };
}

module.exports = {
  calculateMatch
};
