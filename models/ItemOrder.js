const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemOrderSchema = new Schema({
    item_id: {type: String, required: true, ref: 'MenuItem'},
    menu_id: {type: String, required: true, ref: 'Menu'},
    business_id: {type: String, required: true, ref: 'Business'},
    idempotency_token: {type: String, required: true},
    customer_id: {type: String, required: true, ref: 'Customer'},
    customer_name: {type: String, required: true}
});

module.exports = ItemOrder = mongoose.model('ItemOrder', ItemOrderSchema);