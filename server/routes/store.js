var express = require('express');
var router = express.Router();

/* GET store list page. */
router.get('/', function(req, res, next) {
  res.render('stores/list', { title: 'Stores' });
});

module.exports = router;