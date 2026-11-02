const { get, run, query } = require('../db');

/**
 * Get list of companies
 */
exports.getCompanies = (req, res) => {
  try {
    const { industry, state, verified } = req.query;

    let sql = 'SELECT * FROM companies WHERE 1=1';
    const params = [];

    if (industry && industry !== 'all') {
      sql += ' AND industry LIKE ?';
      params.push(`%${industry}%`);
    }

    if (state && state !== 'all') {
      sql += ' AND state = ?';
      params.push(state);
    }

    if (verified !== undefined) {
      sql += ' AND is_verified = ?';
      params.push(verified === 'true' || verified === '1' ? 1 : 0);
    }

    sql += ' ORDER BY rating DESC, name ASC';

    const companies = query(sql, params);
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

/**
 * Get detailed company profile with listings, transaction history, and reviews
 */
exports.getCompanyById = (req, res) => {
  try {
    const { id } = req.params;

    const company = get('SELECT * FROM companies WHERE id = ?', [id]);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Active listings
    const listings = query(
      `SELECT l.*, cat.name as category_name
       FROM listings l
       JOIN categories cat ON l.category_id = cat.id
       WHERE l.seller_company_id = ?
       ORDER BY l.created_at DESC`,
      [id]
    );

    // Completed deals (transaction history)
    const transactionHistory = query(
      `SELECT d.*, l.title as listing_title, l.unit,
              bc.name as buyer_name, sc.name as seller_name
       FROM deals d
       JOIN listings l ON d.listing_id = l.id
       JOIN companies bc ON d.buyer_company_id = bc.id
       JOIN companies sc ON d.seller_company_id = sc.id
       WHERE (d.seller_company_id = ? OR d.buyer_company_id = ?) AND d.status = 'COMPLETED'
       ORDER BY d.completed_at DESC`,
      [id, id]
    );

    // Reviews received
    const reviews = query(
      `SELECT r.*, c.name as from_company_name, c.city as from_company_city
       FROM reviews r
       JOIN companies c ON r.from_company_id = c.id
       WHERE r.to_company_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Stats
    const totalDiverted = query(
      `SELECT COALESCE(SUM(waste_diverted_kg), 0) as total_kg,
              COALESCE(SUM(economic_value_inr), 0) as total_value
       FROM impact_logs il
       JOIN deals d ON il.deal_id = d.id
       WHERE d.seller_company_id = ? OR d.buyer_company_id = ?`,
      [id, id]
    )[0];

    res.json({
      company,
      listings,
      transactionHistory,
      reviews,
      stats: {
        totalDivertedKg: totalDiverted ? totalDiverted.total_kg : 0,
        totalEconomicValueInr: totalDiverted ? totalDiverted.total_value : 0,
        completedDealsCount: transactionHistory.length,
        activeListingsCount: listings.filter(l => l.status === 'ACTIVE').length
      }
    });
  } catch (err) {
    console.error('Error fetching company profile:', err);
    res.status(500).json({ error: 'Failed to fetch company profile' });
  }
};

/**
 * Update company profile
 */
exports.updateProfile = (req, res) => {
  try {
    const companyId = req.user.company_id;
    if (!companyId) {
      return res.status(400).json({ error: 'No company associated with this user account' });
    }

    const { name, industry, state, city, address, about, materials_generated, materials_required, phone, website } = req.body;

    run(
      `UPDATE companies
       SET name = COALESCE(?, name),
           industry = COALESCE(?, industry),
           state = COALESCE(?, state),
           city = COALESCE(?, city),
           address = COALESCE(?, address),
           about = COALESCE(?, about),
           materials_generated = COALESCE(?, materials_generated),
           materials_required = COALESCE(?, materials_required),
           phone = COALESCE(?, phone),
           website = COALESCE(?, website)
       WHERE id = ?`,
      [name, industry, state, city, address, about, materials_generated, materials_required, phone, website, companyId]
    );

    const updated = get('SELECT * FROM companies WHERE id = ?', [companyId]);
    res.json({ message: 'Company profile updated successfully', company: updated });
  } catch (err) {
    console.error('Error updating company profile:', err);
    res.status(500).json({ error: 'Failed to update company profile' });
  }
};

/**
 * Request business verification (Simulated)
 */
exports.requestVerification = (req, res) => {
  try {
    const companyId = req.user.company_id;
    const { gstin, pcbConsent, isoCertification } = req.body;

    const docsString = `GSTIN: ${gstin || '27AAACP1234Q1Z1'} | Pollution Board Consent: ${pcbConsent || 'Valid'} | Certification: ${isoCertification || 'ISO 14001:2015'}`;

    run('UPDATE companies SET verification_docs = ?, is_verified = 1 WHERE id = ?', [docsString, companyId]);

    res.json({
      message: 'Business verification documents submitted. Verified Industrial Business status granted!',
      is_verified: 1,
      verification_docs: docsString
    });
  } catch (err) {
    console.error('Error requesting verification:', err);
    res.status(500).json({ error: 'Failed to submit verification request' });
  }
};
