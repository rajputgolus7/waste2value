const { get, run, query } = require('../db');

/**
 * Get all categories
 */
exports.getCategories = (req, res) => {
  try {
    const categories = query('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * Search and filter listings
 */
exports.getListings = (req, res) => {
  try {
    const {
      search,
      category,
      state,
      city,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      unit,
      grade,
      status = 'ACTIVE',
      sort = 'newest'
    } = req.query;

    let sql = `
      SELECT l.*,
             c.name as seller_company_name, c.industry as seller_industry, c.is_verified as seller_is_verified, c.rating as seller_rating,
             cat.name as category_name, cat.slug as category_slug, cat.icon as category_icon, cat.co2_factor_per_kg
      FROM listings l
      JOIN companies c ON l.seller_company_id = c.id
      JOIN categories cat ON l.category_id = cat.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'ALL') {
      sql += ' AND l.status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (l.title LIKE ? OR l.description LIKE ? OR c.name LIKE ? OR l.expected_use LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (category && category !== 'all') {
      if (!isNaN(category)) {
        sql += ' AND l.category_id = ?';
        params.push(Number(category));
      } else {
        sql += ' AND cat.slug = ?';
        params.push(category);
      }
    }

    if (state && state !== 'all') {
      sql += ' AND l.state = ?';
      params.push(state);
    }

    if (city && city.trim()) {
      sql += ' AND l.city LIKE ?';
      params.push(`%${city.trim()}%`);
    }

    if (grade && grade !== 'all') {
      sql += ' AND l.quality_grade = ?';
      params.push(grade);
    }

    if (unit && unit !== 'all') {
      sql += ' AND l.unit = ?';
      params.push(unit);
    }

    if (minPrice) {
      sql += ' AND l.price_per_unit_inr >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ' AND l.price_per_unit_inr <= ?';
      params.push(Number(maxPrice));
    }

    if (minQuantity) {
      sql += ' AND l.quantity >= ?';
      params.push(Number(minQuantity));
    }

    if (maxQuantity) {
      sql += ' AND l.quantity <= ?';
      params.push(Number(maxQuantity));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        sql += ' ORDER BY l.price_per_unit_inr ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY l.price_per_unit_inr DESC';
        break;
      case 'quantity_desc':
        sql += ' ORDER BY l.quantity DESC';
        break;
      case 'quantity_asc':
        sql += ' ORDER BY l.quantity ASC';
        break;
      case 'oldest':
        sql += ' ORDER BY l.created_at ASC';
        break;
      case 'newest':
      default:
        sql += ' ORDER BY l.created_at DESC';
        break;
    }

    const listings = query(sql, params);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace listings' });
  }
};

/**
 * Get listing by ID or unique code
 */
exports.getListingById = (req, res) => {
  try {
    const { id } = req.params;
    const isCode = isNaN(id);

    const sql = `
      SELECT l.*,
             c.name as seller_company_name, c.industry as seller_industry, c.is_verified as seller_is_verified,
             c.rating as seller_rating, c.about as seller_about, c.phone as seller_phone, c.email as seller_email,
             c.address as seller_address,
             cat.name as category_name, cat.slug as category_slug, cat.icon as category_icon, cat.co2_factor_per_kg
      FROM listings l
      JOIN companies c ON l.seller_company_id = c.id
      JOIN categories cat ON l.category_id = cat.id
      WHERE ${isCode ? 'l.unique_code = ?' : 'l.id = ?'}
    `;

    const listing = get(sql, [id]);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (err) {
    console.error('Error fetching listing details:', err);
    res.status(500).json({ error: 'Failed to fetch listing details' });
  }
};

/**
 * Create a new industrial material listing
 */
exports.createListing = (req, res) => {
  try {
    const {
      title,
      category_id,
      description,
      quantity,
      unit = 'tonne',
      price_per_unit_inr,
      state,
      city,
      quality_grade = 'Grade A',
      availability_date,
      image_url,
      expected_use
    } = req.body;

    // Seller company identification
    const sellerCompanyId = req.user.company_id || 1;

    // Validation
    if (!title || !category_id || !quantity || !price_per_unit_inr || !state || !city) {
      return res.status(400).json({
        error: 'Please complete all required fields: title, category, quantity, price, state, and city'
      });
    }

    if (Number(quantity) <= 0 || Number(price_per_unit_inr) <= 0) {
      return res.status(400).json({
        error: 'Quantity and price must be greater than zero'
      });
    }

    // Generate unique code like W2M-2026-5832
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const uniqueCode = `W2M-2026-${randomSuffix}`;

    const defaultImage = image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80';

    const result = run(
      `INSERT INTO listings (
        unique_code, seller_company_id, title, category_id, description,
        quantity, unit, price_per_unit_inr, state, city,
        quality_grade, availability_date, image_url, expected_use, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [
        uniqueCode,
        sellerCompanyId,
        title.trim(),
        Number(category_id),
        description ? description.trim() : '',
        Number(quantity),
        unit,
        Number(price_per_unit_inr),
        state.trim(),
        city.trim(),
        quality_grade,
        availability_date || new Date().toISOString().split('T')[0],
        defaultImage,
        expected_use ? expected_use.trim() : 'Industrial reuse and reprocessing'
      ]
    );

    const newListing = get(
      `SELECT l.*, c.name as seller_company_name, cat.name as category_name
       FROM listings l
       JOIN companies c ON l.seller_company_id = c.id
       JOIN categories cat ON l.category_id = cat.id
       WHERE l.id = ?`,
      [result.lastInsertRowid]
    );

    res.status(201).json({
      message: 'Waste material listed successfully on Waste2Market',
      listing: newListing
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Failed to create material listing' });
  }
};

/**
 * Get listings created by current seller
 */
exports.getMyListings = (req, res) => {
  try {
    const sellerCompanyId = req.user.company_id || 1;
    const listings = query(
      `SELECT l.*, cat.name as category_name, cat.slug as category_slug,
              (SELECT COUNT(*) FROM offers WHERE listing_id = l.id) as offer_count
       FROM listings l
       JOIN categories cat ON l.category_id = cat.id
       WHERE l.seller_company_id = ?
       ORDER BY l.created_at DESC`,
      [sellerCompanyId]
    );

    res.json(listings);
  } catch (err) {
    console.error('Error fetching seller listings:', err);
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
};

/**
 * Update listing status
 */
exports.updateListingStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'IN_NEGOTIATION', 'SOLD', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    run('UPDATE listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    res.json({ message: 'Listing status updated', status });
  } catch (err) {
    console.error('Error updating listing status:', err);
    res.status(500).json({ error: 'Failed to update listing status' });
  }
};

/**
 * Delete listing
 */
exports.deleteListing = (req, res) => {
  try {
    const { id } = req.params;
    run('DELETE FROM listings WHERE id = ?', [id]);
    res.json({ message: 'Listing removed successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};
