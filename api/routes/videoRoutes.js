const express = require('express');
const { body } = require('express-validator');
const videoController = require('../controllers/videoController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

const validateVideo = [
    body('title').notEmpty(),
    body('category').notEmpty(),
    body('youtube_url').isURL()
];

const validate = (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);

router.post('/', authenticateToken, authorizeRole(['admin', 'super_admin']), validateVideo, validate, videoController.createVideo);
router.patch('/:id', authenticateToken, authorizeRole(['admin', 'super_admin']), videoController.updateVideo);
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'super_admin']), videoController.deleteVideo);

module.exports = router;
