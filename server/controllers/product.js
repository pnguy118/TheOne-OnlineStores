let express = require('express');
let mongoose = require('mongoose');
let Product = require('../models/product');
let userModel = require('../models/user');
let User = userModel.User;

/* GET display product list page. */
module.exports.displayListProduct = (req, res, next) => {
  Product.find({}).sort('-updatedAt').exec((err, product) => {
    if (err) {
      return console.error(err);
    } else {
      res.render('products/list', {
        title: "Product List",
        product: product,
        displayName: req.user ? req.user.displayName : "",
        userId: req.user ? req.user._id.toString() : "not authenticated",
        username: req.user ? req.user.username : "not admin"
      });
    }
  });
};
/* GET display product detail page */
module.exports.displayProductDetail = (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, productToView) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('products/detail', {
        title: 'Product Detail',
        product: productToView,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });
};
/* GET display product add page */
module.exports.displayAddProduct = (req, res, next) => {
  res.render('products/add', {
    title: 'Add Product',
    displayName: req.user ? req.user.displayName : ""
  });
};

/* POST add a new product model */
module.exports.processAddProduct = (req, res, next) => {
  let newProduct = Product({
    "productName": req.body.productName.trim(),
    "type": req.body.type.trim(),
    "about": req.body.about.trim(),
    "rate": req.body.rate,
    "review": req.body.review.trim()
  });

  Product.create(newProduct, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/product-list');
    }
  });
};

/* GET display the edit product page */
module.exports.displayEditProduct = (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, productToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('products/edit', {
        title: "Edit Product", product: productToEdit,
        displayName: req.user ? req.user.displayName : "",
      });
    }
  });
};

/* POST update product */
module.exports.processEditProduct = (req, res, next) => {

  let id = req.params.id;

  let updatedProduct = Product({
    "_id": id,
    "productName": req.body.productName.trim(),
    "type": req.body.type.trim(),
    "about": req.body.about.trim(),
    "rate": req.body.rate,
    "review": req.body.review.trim()
  });

  Product.updateOne({ _id: id }, updatedProduct, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/product-list');
    }
  });

};
/* Perform the deletion */
module.exports.performDelete = (req, res, next) => {
  let id = req.params.id;

  Product.deleteOne({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/product-list');
    };
  });
};