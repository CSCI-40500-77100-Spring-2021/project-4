const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
    menu_id: {type: String, required: true, ref: 'Menu'},
    business_id: {type: String, required: true, ref: 'Business'},
    item_name: {type: String, required: true},
    item_description: {type: String, required: true},
    item_ingredients: [{type: String, required: false}],
    allergy_info: [{type: String, required: true}],
    item_photos: [{type: String, required: true}],
    
});

module.exports = MenuItem = mongoose.model('MenuItem', MenuItemSchema)