const { get, run, query } = require('../db');

/**
 * Buyer makes an offer on a waste listing
 */
exports.createOffer = (req, res) => {
  try {
    const {
      listing_id,
      offered_quantity,
      offered_price_per_unit_inr,
      logistics_preference = 'BUYER_PICKUP',
      message
    } = req.body;

    const buyerCompanyId = req.user.company_id || 2; // Green Biomass Energy in demo mode

    const listing = get('SELECT * FROM listings WHERE id = ?', [listing_id]);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller_company_id === buyerCompanyId) {
      return res.status(400).json({ error: 'You cannot submit an offer on your own listing' });
    }

    const qty = Number(offered_quantity);
    const price = Number(offered_price_per_unit_inr);

    if (!qty || qty <= 0 || !price || price <= 0) {
      return res.status(400).json({ error: 'Please enter valid quantity and price amounts' });
    }

    const totalAmount = Math.round(qty * price);

    const result = run(
      `INSERT INTO offers (
        listing_id, buyer_company_id, seller_company_id, offered_quantity,
        offered_price_per_unit_inr, total_amount_inr, logistics_preference,
        message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OFFER_SENT')`,
      [
        listing_id,
        buyerCompanyId,
        listing.seller_company_id,
        qty,
        price,
        totalAmount,
        logistics_preference,
        message || `Offer submitted for ${qty} ${listing.unit} at ₹${price}/${listing.unit}`
      ]
    );

    // Create notification for seller company user
    const sellerUser = get('SELECT id FROM users WHERE company_id = ? LIMIT 1', [listing.seller_company_id]);
    if (sellerUser) {
      const buyerCompany = get('SELECT name FROM companies WHERE id = ?', [buyerCompanyId]);
      run(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES (?, ?, ?, 'offer', '/deals')`,
        [
          sellerUser.id,
          'New B2B Material Offer',
          `${buyerCompany?.name || 'A buyer'} submitted an offer of ₹${totalAmount.toLocaleString('en-IN')} for ${listing.title}.`
        ]
      );
    }

    const newOffer = get(
      `SELECT o.*, l.title as listing_title, l.unit, bc.name as buyer_name, sc.name as seller_name
       FROM offers o
       JOIN listings l ON o.listing_id = l.id
       JOIN companies bc ON o.buyer_company_id = bc.id
       JOIN companies sc ON o.seller_company_id = sc.id
       WHERE o.id = ?`,
      [result.lastInsertRowid]
    );

    res.status(201).json({
      message: 'Offer submitted successfully to seller',
      offer: newOffer
    });
  } catch (err) {
    console.error('Error creating offer:', err);
    res.status(500).json({ error: 'Failed to submit offer' });
  }
};

/**
 * Get offers for current company (both received and sent)
 */
exports.getMyOffers = (req, res) => {
  try {
    const companyId = req.user.company_id || (req.user.role === 'seller' ? 1 : 2);

    const receivedOffers = query(
      `SELECT o.*, l.title as listing_title, l.unit, l.unique_code as listing_code,
              bc.name as buyer_name, bc.city as buyer_city, bc.state as buyer_state,
              bc.is_verified as buyer_is_verified, bc.rating as buyer_rating, bc.phone as buyer_phone
       FROM offers o
       JOIN listings l ON o.listing_id = l.id
       JOIN companies bc ON o.buyer_company_id = bc.id
       WHERE o.seller_company_id = ?
       ORDER BY o.created_at DESC`,
      [companyId]
    );

    const sentOffers = query(
      `SELECT o.*, l.title as listing_title, l.unit, l.unique_code as listing_code,
              sc.name as seller_name, sc.city as seller_city, sc.state as seller_state,
              sc.is_verified as seller_is_verified, sc.rating as seller_rating, sc.phone as seller_phone
       FROM offers o
       JOIN listings l ON o.listing_id = l.id
       JOIN companies sc ON o.seller_company_id = sc.id
       WHERE o.buyer_company_id = ?
       ORDER BY o.created_at DESC`,
      [companyId]
    );

    res.json({
      received: receivedOffers,
      sent: sentOffers
    });
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

/**
 * Seller accepts an offer -> Creates deal & updates status to ACCEPTED
 */
exports.acceptOffer = (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.company_id || 1;

    const offer = get(
      `SELECT o.*, l.title as listing_title, l.unit, l.category_id,
              bc.name as buyer_name, sc.name as seller_name
       FROM offers o
       JOIN listings l ON o.listing_id = l.id
       JOIN companies bc ON o.buyer_company_id = bc.id
       JOIN companies sc ON o.seller_company_id = sc.id
       WHERE o.id = ?`,
      [id]
    );

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    if (offer.seller_company_id !== companyId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the listing seller can accept this offer' });
    }

    // 1. Update offer status
    run("UPDATE offers SET status = 'ACCEPTED', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);

    // 2. Generate unique Deal Code
    const dealCode = `DEAL-W2M-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialEvents = JSON.stringify([
      {
        status: 'OFFER_SENT',
        timestamp: offer.created_at,
        note: `Offer submitted by ${offer.buyer_name} for ${offer.offered_quantity} ${offer.unit} at ₹${offer.offered_price_per_unit_inr}/${offer.unit}`
      },
      {
        status: 'ACCEPTED',
        timestamp: new Date().toISOString(),
        note: `Offer accepted by ${offer.seller_name}. Deal created. Ready to coordinate logistics (${offer.logistics_preference}).`
      }
    ]);

    // 3. Create Deal record
    const dealResult = run(
      `INSERT INTO deals (
        deal_code, offer_id, listing_id, buyer_company_id, seller_company_id,
        agreed_quantity, agreed_price_per_unit_inr, total_deal_value_inr,
        status, timeline_events, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACCEPTED', ?, ?)`,
      [
        dealCode,
        offer.id,
        offer.listing_id,
        offer.buyer_company_id,
        offer.seller_company_id,
        offer.offered_quantity,
        offer.offered_price_per_unit_inr,
        offer.total_amount_inr,
        initialEvents,
        `Deal established between ${offer.seller_name} and ${offer.buyer_name}`
      ]
    );

    // 4. Update listing status to IN_NEGOTIATION
    run("UPDATE listings SET status = 'IN_NEGOTIATION' WHERE id = ?", [offer.listing_id]);

    // 5. Notify buyer
    const buyerUser = get('SELECT id FROM users WHERE company_id = ? LIMIT 1', [offer.buyer_company_id]);
    if (buyerUser) {
      run(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES (?, ?, ?, 'deal', '/deals')`,
        [
          buyerUser.id,
          'Offer Accepted! Deal Created',
          `Your offer on ${offer.listing_title} has been accepted by ${offer.seller_name}. Deal reference: ${dealCode}.`
        ]
      );
    }

    const createdDeal = get('SELECT * FROM deals WHERE id = ?', [dealResult.lastInsertRowid]);

    res.json({
      message: 'Offer accepted successfully! Deal created.',
      deal: createdDeal
    });
  } catch (err) {
    console.error('Error accepting offer:', err);
    res.status(500).json({ error: 'Failed to accept offer' });
  }
};

/**
 * Seller rejects an offer
 */
exports.rejectOffer = (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    run("UPDATE offers SET status = 'REJECTED', message = message || ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      reason ? ` | Rejection note: ${reason}` : '',
      id
    ]);

    res.json({ message: 'Offer marked as rejected' });
  } catch (err) {
    console.error('Error rejecting offer:', err);
    res.status(500).json({ error: 'Failed to reject offer' });
  }
};

/**
 * Seller proposes a counter-offer
 */
exports.counterOffer = (req, res) => {
  try {
    const { id } = req.params;
    const { counter_price_inr, counter_message } = req.body;

    if (!counter_price_inr || Number(counter_price_inr) <= 0) {
      return res.status(400).json({ error: 'Please enter a valid counter price' });
    }

    run(
      `UPDATE offers
       SET status = 'COUNTERED',
           counter_price_inr = ?,
           message = message || ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        Number(counter_price_inr),
        counter_message ? ` | Seller Counter: ₹${counter_price_inr}. Note: ${counter_message}` : ` | Seller Counter: ₹${counter_price_inr}`,
        id
      ]
    );

    res.json({ message: 'Counter-offer submitted to buyer', counter_price_inr });
  } catch (err) {
    console.error('Error countering offer:', err);
    res.status(500).json({ error: 'Failed to propose counter-offer' });
  }
};
