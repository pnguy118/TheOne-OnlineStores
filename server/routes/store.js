let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
//Create a reference to the Store model
let Store = require('../models/store');

/* GET display store list page. */
router.get('/', function (req, res, next) {
  Store.find((err, store)=>{
    if(err){
      return console.error(err);
    } else {
      res.render('stores/list',{
        title: "Store List",
        store: store,
      });
    }
  })
});

/* GET display store add page */
router.get('/add', function (req, res, next) {
  res.render('stores/add', { title: 'Add Store' });
});

/* POST add a new store model */
router.post('/add', function (req, res, next) {
  let newStore = Store({
    "storeName": req.body.storeName,
    "owner": req.body.owner,
    "type": req.body.type,
    "location": req.body.location,
    "about": req.body.about,
    "rate": req.body.rate,
    "review": req.body.review
  });

  Store.create(newStore, (err, store) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/store-list');
    }
  });
});

/* GET display the edit store page */
router.get('/edit/:id', function (req, res, next) {
  let id = req.params.id;
  Store.findById(id, (err, storeToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('stores/edit', { title: "Edit Store", store: storeToEdit });
    }
  });
});

/* POST update store */
router.post('/edit/:id', function (req, res, next) {

  let id = req.params.id;

  let updatedStore = Store({
    "_id": id,
    "storeName": req.body.storeName,
    "owner": req.body.owner,
    "type": req.body.type,
    "location": req.body.location,
    "about": req.body.about,
    "rate": req.body.rate,
    "review": req.body.review
  });

  Store.updateOne({ _id: id }, updatedStore, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/store-list');
    }
  });

});
module.exports = router;


router.get("/delete/:id", (req, res, next) => {
  let id = req.params.id;
  
  Store.deleteOne({_id: id}, (err) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      res.redirect('/store-list')
    };
  });
});
module.exports = router;