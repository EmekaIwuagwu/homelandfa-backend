const express = require('express');
const { body } = require('express-validator');
const applicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

const validateApplication = [
    body('player_name').isLength({ min: 2, max: 100 }).withMessage('Player name must be between 2 and 100 characters'),
    body('date_of_birth').isDate().withMessage('Valid date of birth required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('preferred_program').notEmpty().withMessage('Preferred program is required'),
    body('parent_name').notEmpty().withMessage('Parent name is required'),
    body('emergency_contact_name').notEmpty().withMessage('Emergency contact name is required'),
    body('emergency_contact_phone').notEmpty().withMessage('Emergency contact phone is required')
];

const validate = (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Public endpoint
router.post('/', validateApplication, validate, applicationController.createApplication);

// Protected endpoints
router.get('/', authenticateToken, authorizeRole(['admin', 'super_admin']), applicationController.getAllApplications);
router.get('/stats', authenticateToken, authorizeRole(['admin', 'super_admin']), applicationController.getStats);
router.get('/export', authenticateToken, authorizeRole(['admin', 'super_admin']), applicationController.exportApplications);
router.get('/:id', authenticateToken, authorizeRole(['admin', 'super_admin']), applicationController.getApplicationById);
router.patch('/:id/status', authenticateToken, authorizeRole(['admin', 'super_admin']),
    body('status').isIn(['pending', 'approved', 'rejected', 'enrolled']), validate,
    applicationController.updateApplicationStatus
);

module.exports = router;
