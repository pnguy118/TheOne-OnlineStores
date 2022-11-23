let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Store = require('../models/store');
let jwt = require('jsonwebtoken');
let userModel = require('../models/user');
let User = userModel.User;
/* GET display store list page. */
module.exports.displayListStore = (req, res, next) => {
  Store.find({}).sort('-updatedAt').exec((err, store) => {
    if (err) {
      return console.error(err);
    } else {
      res.render('stores/list', {
        title: "Store List",
        store: store,
        displayName: req.user ? req.user.displayName : "",
        userId: req.user ? req.user._id.toString() : "not authenticated",
        username: req.user ? req.user.username : "not admin"
      });
    }
  });
};
/* GET display store detail page */
module.exports.displayStoreDetail = (req, res, next) => {
  let id = req.params.id;
  Store.findById(id, (err, storeToView) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('stores/detail', {
        title: 'Store Detail',
        store: storeToView,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });
};
/* GET display store add page */
module.exports.displayAddStore = (req, res, next) => {
  res.render('stores/add', {
    title: 'Add Store',
    displayName: req.user ? req.user.displayName : ""
  });
};

/* POST add a new store model */
module.exports.processAddStore = (req, res, next) => {
  let newStore = Store({
    "storeName": req.body.storeName.trim(),
    "owner": req.user.displayName.trim(),
    "ownerId": req.user._id,
    "type": req.body.type.trim(),
    "location": req.body.location.trim(),
    "about": req.body.about.trim(),
    "rate": req.body.rate,
    "review": req.body.review.trim()
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
};

/* GET display the edit store page */
module.exports.displayEditStore = (req, res, next) => {
  let id = req.params.id;
  Store.findById(id, (err, storeToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('stores/edit', {
        title: "Edit Store", store: storeToEdit,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

/* POST update store */
module.exports.processEditStore = (req, res, next) => {

  let id = req.params.id;

  let updatedStore = Store({
    "_id": id,
    "storeName": req.body.storeName.trim(),
    "owner": req.user.displayName.trim(),
    "ownerId": req.user._id,
    "type": req.body.type.trim(),
    "location": req.body.location.trim(),
    "about": req.body.about.trim(),
    "rate": req.body.rate,
    "review": req.body.review.trim()
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

};
/* Display Owner's Store */
module.exports.displayOwnerStore = (req, res, next) => {
  let id = req.params.id;
  User.findById(id, (err, owner) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      Store.find({ ownerId: id }, (err, ownerStore) => {
        if (err) {
          console.log(err);
          res.end(err);
        }
        else {
          res.render('stores/owner_stores', {
            title:`${owner.displayName}'s Store List`,
            displayName: req.user ? req.user.displayName : "",
            store:ownerStore,
            userId: req.user ? req.user._id.toString() : "not authenticated",
            username: req.user ? req.user.username : "not admin"
          });
        }
      });
    }
  });
};
/* Perform the deletion */
module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Store.deleteOne({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/store-list');
    };
  });
};