const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemListingSchema = new Schema({
    item_id: {type: String, required: true, ref: 'MenuItem'},
    menu_id: {type: String, required: true, ref: 'Menu'},
    business_id: {type: String, required: true, ref: 'Business'},

    listing_item_age: {type: Number, required: true}, //age in days
    listing_item_count: {type: Number, required: true},
    listing_item_per_customer: {type: Number, required: true},
    info_for_customer: {type: String, required: true},

    order_frequency: {type: Number, required: true}, //Frequency in hours (time between order of same item by same customer)

    available: {type: Boolean, required: true},

    placed_orders: [{type: String, required: false, ref: 'ItemOrder'}],

    date_listed: {type: String, required: true, default: Date.now()},

    listing_duration: {type: String, required: true}, // how long item should bve listed

    listing_token: {type: String, required: true},
    fot: {type: String, required: true}
});

module.exports = ItemListing = mongoose.model('ItemListing', ItemListingSchema);