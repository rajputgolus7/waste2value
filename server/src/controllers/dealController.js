const { get, run, query } = require('../db');

/**
 * Get deals for the current company or all deals if admin
 */
exports.getDeals = (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const companyId = req.user.company_id || (req.user.role === 'seller' ? 1 : 2);

    let sql = `
      SELECT d.*,
             l.title as listing_title, l.unit, l.unique_code as listing_code, l.image_url as listing_image,
             cat.name as category_name, cat.co2_factor_per_kg,
             bc.name as buyer_name, bc.city as buyer_city, bc.state as buyer_state,
             sc.name as seller_name, sc.city as seller_city, sc.state as seller_state,
             o.logistics_preference
      FROM deals d
      JOIN listings l ON d.listing_id = l.id
      JOIN categories cat ON l.category_id = cat.id
      JOIN companies bc ON d.buyer_company_id = bc.id
      JOIN companies sc ON d.seller_company_id = sc.id
    `;
    const params = [];

    if (!isAdmin) {
      sql += ' WHERE d.seller_company_id = ? OR d.buyer_company_id = ?';
      params.push(companyId, companyId);
    }

    sql += ' ORDER BY d.created_at DESC';

    const deals = query(sql, params).map(d => {
      let timeline = [];
      try {
        timeline = JSON.parse(d.timeline_events || '[]');
      } catch (e) {
        timeline = [];
      }
      return {
        ...d,
        timeline_events: timeline
      };
    });

    res.json(deals);
  } catch (err) {
    console.error('Error fetching deals:', err);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
};

/**
 * Get deal by ID or deal code
 */
exports.getDealById = (req, res) => {
  try {
    const { id } = req.params;
    const isCode = isNaN(id);

    const sql = `
      SELECT d.*,
             l.title as listing_title, l.unit, l.unique_code as listing_code, l.image_url as listing_image,
             l.quality_grade, l.expected_use,
             cat.name as category_name, cat.co2_factor_per_kg,
             bc.name as buyer_name, bc.city as buyer_city, bc.state as buyer_state, bc.phone as buyer_phone, bc.email as buyer_email,
             sc.name as seller_name, sc.city as seller_city, sc.state as seller_state, sc.phone as seller_phone, sc.email as seller_email,
             o.logistics_preference, o.message as original_offer_message
      FROM deals d
      JOIN listings l ON d.listing_id = l.id
      JOIN categories cat ON l.category_id = cat.id
      JOIN companies bc ON d.buyer_company_id = bc.id
      JOIN companies sc ON d.seller_company_id = sc.id
      WHERE ${isCode ? 'd.deal_code = ?' : 'd.id = ?'}
    `;

    const deal = get(sql, [id]);
    if (!deal) {
      return res.status(404).json({ error: 'Deal transaction not found' });
    }

    let timeline = [];
    try {
      timeline = JSON.parse(deal.timeline_events || '[]');
    } catch (e) {
      timeline = [];
    }

    res.json({
      ...deal,
      timeline_events: timeline
    });
  } catch (err) {
    console.error('Error fetching deal details:', err);
    res.status(500).json({ error: 'Failed to fetch deal details' });
  }
};

/**
 * Progress deal through visual status timeline:
 * ACCEPTED -> LOGISTICS_ARRANGED -> PROCESSING -> COMPLETED
 */
exports.updateDealStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['ACCEPTED', 'LOGISTICS_ARRANGED', 'PROCESSING', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid deal status transition' });
    }

    const deal = get(
      `SELECT d.*, l.category_id, l.unit, cat.co2_factor_per_kg,
              bc.name as buyer_name, sc.name as seller_name
       FROM deals d
       JOIN listings l ON d.listing_id = l.id
       JOIN categories cat ON l.category_id = cat.id
       JOIN companies bc ON d.buyer_company_id = bc.id
       JOIN companies sc ON d.seller_company_id = sc.id
       WHERE d.id = ?`,
      [id]
    );

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Parse existing timeline
    let timeline = [];
    try {
      timeline = JSON.parse(deal.timeline_events || '[]');
    } catch (e) {
      timeline = [];
    }

    const defaultNotes = {
      'LOGISTICS_ARRANGED': 'Logistics transport confirmed and dispatch schedule allocated.',
      'PROCESSING': 'Material consignment received at processing plant. Quality verification and reprocessing in progress.',
      'COMPLETED': 'Consignment fully processed into circular feedstock. Transaction and economic value settled.'
    };

    const newEvent = {
      status,
      timestamp: new Date().toISOString(),
      note: note || defaultNotes[status] || `Status updated to ${status}`
    };

    timeline.push(newEvent);

    let completedAt = deal.completed_at;
    if (status === 'COMPLETED' && !completedAt) {
      completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // 1. Mark listing as SOLD
      run("UPDATE listings SET status = 'SOLD' WHERE id = ?", [deal.listing_id]);

      // 2. Log environmental & circular impact
      let weightKg = deal.agreed_quantity;
      if (deal.unit === 'tonne') weightKg = deal.agreed_quantity * 1000;
      if (deal.unit === 'litre') weightKg = deal.agreed_quantity * 0.9;

      const co2AvoidedKg = Math.round(weightKg * (deal.co2_factor_per_kg || 1.5));

      run(
        `INSERT INTO impact_logs (deal_id, waste_diverted_kg, co2_avoided_kg, economic_value_inr)
         VALUES (?, ?, ?, ?)`,
        [deal.id, weightKg, co2AvoidedKg, deal.total_deal_value_inr]
      );

      // 3. Send celebratory notifications
      const buyerUser = get('SELECT id FROM users WHERE company_id = ? LIMIT 1', [deal.buyer_company_id]);
      const sellerUser = get('SELECT id FROM users WHERE company_id = ? LIMIT 1', [deal.seller_company_id]);

      const messageText = `Deal ${deal.deal_code} completed! Diverted ${weightKg.toLocaleString('en-IN')} kg of industrial waste and avoided ${co2AvoidedKg.toLocaleString('en-IN')} kg of CO2 emissions.`;

      if (buyerUser) {
        run('INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, "impact", "/impact")', [buyerUser.id, 'Circular Deal Completed! 🎉', messageText]);
      }
      if (sellerUser) {
        run('INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, "impact", "/impact")', [sellerUser.id, 'Circular Deal Completed! 🎉', messageText]);
      }
    }

    run(
      `UPDATE deals
       SET status = ?, timeline_events = ?, completed_at = ?
       WHERE id = ?`,
      [status, JSON.stringify(timeline), completedAt, id]
    );

    res.json({
      message: `Deal status updated to ${status}`,
      status,
      timeline_events: timeline,
      isCompleted: status === 'COMPLETED'
    });
  } catch (err) {
    console.error('Error updating deal status:', err);
    res.status(500).json({ error: 'Failed to update deal status' });
  }
};
