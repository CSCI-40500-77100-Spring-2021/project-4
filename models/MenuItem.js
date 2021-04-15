const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
    menu_id: {type: String, required: true, ref: 'Menu'},
    business_id: {type: String, required: true, ref: 'Business'},
    item_name: {type: String, required: true},
    item_description: {type: String, required: true},
    item_ingredients: [{type: String, required: false}],
    allergy_info: [{type: String, required: true}],
    item_age: {type: Number, required: true}, //age in days
    item_photos: [{type: String, required: true}],
    item_count: {type: Number, required: true},
    item_per_customer: {type: Number, required: true},
    info_for_customer: {type: String, required: true},

    isAvailable: {type: Boolean, required: true},

    placed_orders: [{type: String, required: false, ref: 'ItemOrder'}]
});

module.exports = MenuItem = mongoose.model('MenuItem', MenuItemSchema)