const express = require('express');
const router = express.Router();

const { authenticate, requireAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');
const listingController = require('../controllers/listingController');
const matchingController = require('../controllers/matchingController');
const offerController = require('../controllers/offerController');
const dealController = require('../controllers/dealController');
const calculatorController = require('../controllers/calculatorController');
const aiController = require('../controllers/aiController');
const companyController = require('../controllers/companyController');
const impactController = require('../controllers/impactController');
const adminController = require('../controllers/adminController');
const { query, run } = require('../db');

// --- AUTH ---
router.post('/auth/login', authController.login);
router.post('/auth/demo-login', authController.demoLogin);
router.post('/auth/register', authController.register);
router.get('/auth/me', authenticate, authController.getMe);

// --- CATEGORIES ---
router.get('/categories', listingController.getCategories);

// --- LISTINGS ---
router.get('/listings', listingController.getListings);
router.get('/listings/user/my', authenticate, listingController.getMyListings);
router.get('/listings/:id', listingController.getListingById);
router.post('/listings', authenticate, listingController.createListing);
router.patch('/listings/:id/status', authenticate, listingController.updateListingStatus);
router.delete('/listings/:id', authenticate, listingController.deleteListing);

// --- SMART MATCHING ENGINE ---
router.get('/matching/listing/:listingId', matchingController.getMatchesForListing);
router.get('/matching/buyer', authenticate, matchingController.getMatchesForBuyer);
router.get('/matching/all', matchingController.getAllMatches);

// --- OFFERS ---
router.post('/offers', authenticate, offerController.createOffer);
router.get('/offers/my', authenticate, offerController.getMyOffers);
router.post('/offers/:id/accept', authenticate, offerController.acceptOffer);
router.post('/offers/:id/reject', authenticate, offerController.rejectOffer);
router.post('/offers/:id/counter', authenticate, offerController.counterOffer);

// --- DEALS / TRANSACTIONS ---
router.get('/deals', authenticate, dealController.getDeals);
router.get('/deals/:id', authenticate, dealController.getDealById);
router.patch('/deals/:id/status', authenticate, dealController.updateDealStatus);

// --- VALUE CALCULATOR ---
router.get('/calculator/presets', calculatorController.getPresets);
router.post('/calculator/compute', calculatorController.calculate);

// --- AI CLASSIFIER ---
router.get('/ai/catalog', aiController.getCatalog);
router.post('/ai/classify', aiController.classify);

// --- COMPANIES & PROFILES ---
router.get('/companies', companyController.getCompanies);
router.get('/companies/:id', companyController.getCompanyById);
router.put('/companies/profile', authenticate, companyController.updateProfile);
router.post('/companies/verify', authenticate, companyController.requestVerification);

// --- IMPACT & DASHBOARD ---
router.get('/impact/summary', impactController.getImpactSummary);
router.get('/dashboard', authenticate, impactController.getCompanyDashboard);

// --- ADMIN ---
router.get('/admin/stats', authenticate, requireAdmin, adminController.getAdminStats);
router.get('/admin/companies', authenticate, requireAdmin, adminController.getAdminCompanies);
router.post('/admin/companies/:id/verify', authenticate, requireAdmin, adminController.verifyCompany);
router.post('/admin/companies/:id/reject', authenticate, requireAdmin, adminController.rejectCompany);
router.post('/admin/listings/:id/toggle-suspend', authenticate, requireAdmin, adminController.toggleSuspendListing);
router.delete('/admin/listings/:id', authenticate, requireAdmin, adminController.deleteAdminListing);
router.get('/admin/transactions', authenticate, requireAdmin, adminController.getAllTransactions);

// --- NOTIFICATIONS ---
router.get('/notifications', authenticate, (req, res) => {
  try {
    const notifications = query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/notifications/:id/read', authenticate, (req, res) => {
  try {
    run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification read' });
  }
});

module.exports = router;
