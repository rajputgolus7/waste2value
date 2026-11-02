const { get, query } = require('../db');
const { calculateMatch } = require('../services/matchingEngine');

/**
 * Find matching buyers for a given listing
 */
exports.getMatchesForListing = (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = get(
      `SELECT l.*, c.name as seller_company_name, c.city as seller_city, c.state as seller_state,
              cat.name as category_name
       FROM listings l
       JOIN companies c ON l.seller_company_id = c.id
       JOIN categories cat ON l.category_id = cat.id
       WHERE l.id = ?`,
      [listingId]
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Get all buyer requirements and buyer companies
    const requirements = query(
      `SELECT r.*, c.id as company_id, c.name, c.industry, c.city, c.state, c.is_verified, c.rating,
              c.materials_required, c.phone, c.email
       FROM buyer_requirements r
       JOIN companies c ON r.buyer_company_id = c.id
       WHERE c.id != ?`,
      [listing.seller_company_id]
    );

    const matches = requirements.map(reqItem => {
      const buyerCompany = {
        id: reqItem.company_id,
        name: reqItem.name,
        industry: reqItem.industry,
        city: reqItem.city,
        state: reqItem.state,
        is_verified: reqItem.is_verified,
        rating: reqItem.rating,
        materials_required: reqItem.materials_required,
        phone: reqItem.phone,
        email: reqItem.email
      };

      return calculateMatch(listing, reqItem, buyerCompany);
    });

    // Sort descending by match score
    matches.sort((a, b) => b.score - a.score);

    res.json({
      listing: {
        id: listing.id,
        unique_code: listing.unique_code,
        title: listing.title,
        quantity: listing.quantity,
        unit: listing.unit,
        price_per_unit_inr: listing.price_per_unit_inr,
        city: listing.city,
        state: listing.state,
        seller_company_name: listing.seller_company_name,
        quality_grade: listing.quality_grade
      },
      matches
    });
  } catch (err) {
    console.error('Error computing matches for listing:', err);
    res.status(500).json({ error: 'Failed to compute buyer matches' });
  }
};

/**
 * Find matching listings for a buyer company
 */
exports.getMatchesForBuyer = (req, res) => {
  try {
    const buyerCompanyId = req.user?.company_id || req.query.buyerCompanyId || 2;

    const buyerCompany = get('SELECT * FROM companies WHERE id = ?', [buyerCompanyId]);
    if (!buyerCompany) {
      return res.status(404).json({ error: 'Buyer company not found' });
    }

    const requirements = query('SELECT * FROM buyer_requirements WHERE buyer_company_id = ?', [buyerCompanyId]);
    const listings = query(
      `SELECT l.*, c.name as seller_company_name, c.city as seller_city, c.state as seller_state,
              c.is_verified as seller_is_verified, c.rating as seller_rating,
              cat.name as category_name
       FROM listings l
       JOIN companies c ON l.seller_company_id = c.id
       JOIN categories cat ON l.category_id = cat.id
       WHERE l.status = 'ACTIVE' AND l.seller_company_id != ?`,
      [buyerCompanyId]
    );

    const matches = [];

    for (const listing of listings) {
      let bestReq = requirements[0] || {
        material_name: listing.title,
        category_id: listing.category_id,
        min_quantity: 1,
        max_quantity: 100,
        max_budget_per_unit_inr: listing.price_per_unit_inr * 1.1,
        min_quality_grade: 'Grade B'
      };

      // Find best fitting requirement for this listing
      for (const reqItem of requirements) {
        if (reqItem.category_id === listing.category_id) {
          bestReq = reqItem;
          break;
        }
      }

      const matchResult = calculateMatch(listing, bestReq, buyerCompany);
      matches.push({
        listing,
        ...matchResult
      });
    }

    matches.sort((a, b) => b.score - a.score);
    res.json({
      buyerCompany,
      matches
    });
  } catch (err) {
    console.error('Error computing buyer matches:', err);
    res.status(500).json({ error: 'Failed to compute material matches for buyer' });
  }
};

/**
 * Get all top circular economy match pairs across the network
 */
exports.getAllMatches = (req, res) => {
  try {
    const listings = query(
      `SELECT l.*, c.name as seller_company_name, c.city as seller_city, c.state as seller_state,
              cat.name as category_name
       FROM listings l
       JOIN companies c ON l.seller_company_id = c.id
       JOIN categories cat ON l.category_id = cat.id
       WHERE l.status = 'ACTIVE'
       LIMIT 10`
    );

    const requirements = query(
      `SELECT r.*, c.id as company_id, c.name, c.industry, c.city, c.state, c.is_verified, c.rating
       FROM buyer_requirements r
       JOIN companies c ON r.buyer_company_id = c.id`
    );

    const allPairs = [];

    for (const listing of listings) {
      for (const reqItem of requirements) {
        if (listing.seller_company_id !== reqItem.company_id) {
          const buyerCompany = {
            id: reqItem.company_id,
            name: reqItem.name,
            industry: reqItem.industry,
            city: reqItem.city,
            state: reqItem.state,
            is_verified: reqItem.is_verified,
            rating: reqItem.rating
          };
          const matchResult = calculateMatch(listing, reqItem, buyerCompany);
          if (matchResult.score >= 60) {
            allPairs.push({
              listingId: listing.id,
              listingTitle: listing.title,
              listingCity: listing.city,
              listingPrice: listing.price_per_unit_inr,
              listingUnit: listing.unit,
              listingQuantity: listing.quantity,
              sellerName: listing.seller_company_name,
              categoryName: listing.category_name,
              ...matchResult
            });
          }
        }
      }
    }

    allPairs.sort((a, b) => b.score - a.score);
    res.json(allPairs);
  } catch (err) {
    console.error('Error fetching all matches:', err);
    res.status(500).json({ error: 'Failed to compute network matches' });
  }
};
