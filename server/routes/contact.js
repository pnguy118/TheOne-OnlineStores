let express = require('express');
let router = express.Router();
let contactController = require('../controllers/contact');

/* GET contact page. */
router.get('/', contactController.displayContactPage);

module.exports = router;