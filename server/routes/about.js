let express = require('express');
let router = express.Router();
let aboutController = require('../controllers/about');

/* GET about page. */
router.get('/', aboutController.displayAboutPage);

module.exports = router;