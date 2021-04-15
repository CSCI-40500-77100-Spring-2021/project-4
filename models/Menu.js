const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    business_id: {type: String, required: true, ref: 'Business'},
    menu_name: {type: String, required: true},
    menu_description: {type: String, required: true},
    menu_tags: [{type: String, required: false}],
    menu_items: [{type: String, required: false, ref: 'MenuItem'}],
    num_items: {type: Number, required: false, default: 0}
});

module.exports = Menu = mongoose.model('Menu', MenuSchema)