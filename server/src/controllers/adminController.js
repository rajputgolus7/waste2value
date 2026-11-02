const { get, run, query } = require('../db');

/**
 * Admin Platform Statistics
 */
exports.getAdminStats = (req, res) => {
  try {
    const totalCompanies = query('SELECT COUNT(*) as count FROM companies')[0].count;
    const pendingVerification = query('SELECT COUNT(*) as count FROM companies WHERE is_verified = 0')[0].count;
    const activeListings = query("SELECT COUNT(*) as count FROM listings WHERE status = 'ACTIVE'")[0].count;
    const suspendedListings = query("SELECT COUNT(*) as count FROM listings WHERE status = 'SUSPENDED'")[0].count;
    const activeDeals = query("SELECT COUNT(*) as count FROM deals WHERE status != 'COMPLETED'")[0].count;
    const completedDeals = query("SELECT COUNT(*) as count FROM deals WHERE status = 'COMPLETED'")[0].count;
    
    const impactAgg = query(
      `SELECT COALESCE(SUM(waste_diverted_kg), 0) as total_kg,
              COALESCE(SUM(economic_value_inr), 0) as total_val,
              COALESCE(SUM(co2_avoided_kg), 0) as total_co2
       FROM impact_logs`
    )[0];

    const totalOffers = query('SELECT COUNT(*) as count FROM offers')[0].count;

    res.json({
      totalCompanies,
      pendingVerification,
      activeListings,
      suspendedListings,
      activeDeals,
      completedDeals,
      totalOffers,
      totalWasteDivertedKg: Number(impactAgg.total_kg),
      totalEconomicValueInr: Number(impactAgg.total_val),
      totalCo2AvoidedKg: Number(impactAgg.total_co2)
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

/**
 * Get all companies for admin moderation
 */
exports.getAdminCompanies = (req, res) => {
  try {
    const companies = query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM listings WHERE seller_company_id = c.id) as listing_count,
              (SELECT COUNT(*) FROM deals WHERE seller_company_id = c.id OR buyer_company_id = c.id) as deal_count
       FROM companies c
       ORDER BY c.is_verified ASC, c.created_at DESC`
    );
    res.json(companies);
  } catch (err) {
    console.error('Admin companies error:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

/**
 * Verify a company business credentials
 */
exports.verifyCompany = (req, res) => {
  try {
    const { id } = req.params;
    run('UPDATE companies SET is_verified = 1 WHERE id = ?', [id]);
    
    // Notify company users
    const users = query('SELECT id FROM users WHERE company_id = ?', [id]);
    for (const u of users) {
      run(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES (?, 'Business Verified!', 'Your industrial business profile has been verified by the Waste2Market compliance team.', 'verified', '/profile')`,
        [u.id]
      );
    }

    res.json({ message: 'Company verified successfully', is_verified: 1 });
  } catch (err) {
    console.error('Verify company error:', err);
    res.status(500).json({ error: 'Failed to verify company' });
  }
};

/**
 * Reject or revoke company verification
 */
exports.rejectCompany = (req, res) => {
  try {
    const { id } = req.params;
    run('UPDATE companies SET is_verified = 0 WHERE id = ?', [id]);
    res.json({ message: 'Company verification revoked', is_verified: 0 });
  } catch (err) {
    console.error('Reject company error:', err);
    res.status(500).json({ error: 'Failed to revoke company verification' });
  }
};

/**
 * Toggle suspend / activate listing
 */
exports.toggleSuspendListing = (req, res) => {
  try {
    const { id } = req.params;
    const listing = get('SELECT status FROM listings WHERE id = ?', [id]);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const newStatus = listing.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    run('UPDATE listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, id]);

    res.json({ message: `Listing is now ${newStatus}`, status: newStatus });
  } catch (err) {
    console.error('Listing suspend error:', err);
    res.status(500).json({ error: 'Failed to toggle listing suspension' });
  }
};

/**
 * Delete listing (Admin action)
 */
exports.deleteAdminListing = (req, res) => {
  try {
    const { id } = req.params;
    run('DELETE FROM listings WHERE id = ?', [id]);
    res.json({ message: 'Listing permanently removed' });
  } catch (err) {
    console.error('Admin delete listing error:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

/**
 * Get all transactions for Admin monitoring
 */
exports.getAllTransactions = (req, res) => {
  try {
    const deals = query(
      `SELECT d.*,
              l.title as listing_title, l.unique_code as listing_code,
              bc.name as buyer_name, sc.name as seller_name
       FROM deals d
       JOIN listings l ON d.listing_id = l.id
       JOIN companies bc ON d.buyer_company_id = bc.id
       JOIN companies sc ON d.seller_company_id = sc.id
       ORDER BY d.created_at DESC`
    );
    res.json(deals);
  } catch (err) {
    console.error('Admin transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch all transactions' });
  }
};
