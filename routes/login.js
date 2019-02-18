const router = require('express').Router();
const loginController = require('../controllers/login');

router.get('/', loginController.get);
router.post('/', loginController.post);

module.exports = router;
