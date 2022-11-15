let mongoose = require('mongoose');

let storeModel = mongoose.Schema({
    storeName: String,
    owner: String,
    type: String,
    location: String,
    about: String,
    rate: Number,
    review: String
},{
    collection:"stores"
})

module.exports = mongoose.model('Store', storeModel);