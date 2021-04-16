const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemOrderSchema = new Schema({
    listing_id: {type: String, required: true, ref: 'ItemListing'},
    item_id: {type: String, required: true, ref: 'MenuItem'},
    menu_id: {type: String, required: true, ref: 'Menu'},
    business_id: {type: String, required: true, ref: 'Business'},
    idempotency_token: {type: String, required: true},
    customer_id: {type: String, required: true, ref: 'Customer'},
    customer_name: {type: String, required: true},
    order_fulfilled: {type: Boolean, required: true, default: false},
    timestamp: {type: String, required: true, default: Date.now()},
    cooldown_end: {type: String, required: true},
    cancelled: {type: Boolean, required: false, default: false}
});

module.exports = ItemOrder = mongoose.model('ItemOrder', ItemOrderSchema);