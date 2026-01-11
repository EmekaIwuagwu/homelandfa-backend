const express = require('express');
const statsController = require('../controllers/statsController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// All stats endpoints should be protected and admin-only
router.use(authenticateToken, authorizeRole(['admin', 'super_admin']));

router.get('/overview', statsController.getOverview);
router.get('/applications-by-program', statsController.getApplicationsByProgram);
router.get('/monthly-trend', statsController.getMonthlyTrend);
router.get('/age-distribution', statsController.getAgeDistribution);

module.exports = router;
