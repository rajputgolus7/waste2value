// Distance and logistics calculation service for Indian Industrial Hubs

const INDUSTRIAL_HUBS = {
  'Ludhiana': { state: 'Punjab', lat: 30.9010, lon: 75.8573 },
  'Rajpura': { state: 'Punjab', lat: 30.4839, lon: 76.5940 },
  'Bathinda': { state: 'Punjab', lat: 30.2110, lon: 74.9455 },
  'Chandigarh': { state: 'Chandigarh', lat: 30.7333, lon: 76.7794 },
  'Panipat': { state: 'Haryana', lat: 29.3909, lon: 76.9635 },
  'Manesar': { state: 'Haryana', lat: 28.3514, lon: 76.9388 },
  'Gurgaon': { state: 'Haryana', lat: 28.4595, lon: 77.0266 },
  'Faridabad': { state: 'Haryana', lat: 28.4089, lon: 77.3178 },
  'Karnal': { state: 'Haryana', lat: 29.6857, lon: 76.9905 },
  'Yamunanagar': { state: 'Haryana', lat: 30.1290, lon: 77.2674 },
  'Delhi': { state: 'Delhi', lat: 28.7041, lon: 77.1025 },
  'Okhla': { state: 'Delhi', lat: 28.5307, lon: 77.2713 },
  'Noida': { state: 'Uttar Pradesh', lat: 28.5355, lon: 77.3910 },
  'Muzaffarnagar': { state: 'Uttar Pradesh', lat: 29.4727, lon: 77.7085 },
  'Meerut': { state: 'Uttar Pradesh', lat: 28.9845, lon: 77.7064 },
  'Jaipur': { state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  'Bhiwadi': { state: 'Rajasthan', lat: 28.2104, lon: 76.8606 },
  'Alwar': { state: 'Rajasthan', lat: 27.5530, lon: 76.6346 },
  'Pune': { state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  'Nagpur': { state: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  'Mumbai': { state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  'Dahej': { state: 'Gujarat', lat: 21.7135, lon: 72.5855 },
  'Surat': { state: 'Gujarat', lat: 21.1702, lon: 72.8311 },
  'Ahmedabad': { state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  'Baddi': { state: 'Himachal Pradesh', lat: 30.9578, lon: 76.7914 }
};

/**
 * Calculates Haversine distance in kilometers between two cities
 */
function getDistanceKm(city1, city2) {
  if (!city1 || !city2) return 150;
  if (city1.toLowerCase().trim() === city2.toLowerCase().trim()) return 15;

  const c1 = INDUSTRIAL_HUBS[city1] || Object.values(INDUSTRIAL_HUBS).find(h => city1.toLowerCase().includes(Object.keys(INDUSTRIAL_HUBS).find(k => k.toLowerCase() === city1.toLowerCase())));
  const c2 = INDUSTRIAL_HUBS[city2] || Object.values(INDUSTRIAL_HUBS).find(h => city2.toLowerCase().includes(Object.keys(INDUSTRIAL_HUBS).find(k => k.toLowerCase() === city2.toLowerCase())));

  if (!c1 || !c2) {
    // Default regional estimate based on state match
    return 140;
  }

  const R = 6371; // Earth's radius in km
  const dLat = (c2.lat - c1.lat) * (Math.PI / 180);
  const dLon = (c2.lon - c1.lon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(c1.lat * (Math.PI / 180)) * Math.cos(c2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = Math.round(R * c);

  return Math.max(10, d);
}

/**
 * Estimates freight and logistics cost in INR
 * Base fee + rate per tonne-km
 */
function estimateLogisticsCost(quantity, unit, distanceKm) {
  let quantityTonnes = quantity;
  if (unit === 'kg') quantityTonnes = quantity / 1000;
  if (unit === 'litre') quantityTonnes = quantity / 1000;

  const baseHandling = 1200;
  const ratePerTonneKm = 3.8; // INR per tonne per km
  const transportCost = Math.round(baseHandling + (quantityTonnes * distanceKm * ratePerTonneKm));
  return Math.max(2000, transportCost);
}

module.exports = {
  INDUSTRIAL_HUBS,
  getDistanceKm,
  estimateLogisticsCost
};
