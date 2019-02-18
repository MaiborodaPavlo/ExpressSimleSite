const adminController = require('../controllers/admin');
const express = require('express');
const router = express.Router();

router.get('/', adminController.get);
router.post('/upload', adminController.postUpload);
router.post('/skills', adminController.postSkills);

module.exports = router;
