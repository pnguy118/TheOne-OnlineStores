let mongoose = require('mongoose');


let productModel = mongoose.Schema({
    productName: String,
    type: String,
    about: String,
    rate: Number,
    review: String,
}
,{
    collection:"products"
})

module.exports = mongoose.model('products', productModel);