let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
// helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}
let productController = require('../controllers/product');
/* GET Route for the Product List page - READ Operation */
router.get('/', productController.displayListProduct);

/* GET Route for the Product Detail Page */
router.get('/detail/:id',productController.displayProductDetail);

/* GET Route for displaying the Add product - CREATE Operation */
router.get('/add', requireAuth, productController.displayAddProduct);

/* POST Route for processing the Add product - CREATE Operation */
router.post('/add', requireAuth, productController.processAddProduct);

/* GET Route for displaying the Edit product - UPDATE Operation */
router.get('/edit/:id', requireAuth, productController.displayEditProduct);

/* POST Route for processing the Edit product - UPDATE Operation */
router.post('/edit/:id', requireAuth, productController.processEditProduct);

/* GET to perform  Deletion - DELETE Operation */
router.get('/delete/:id', requireAuth, productController.performDelete);

module.exports = router;