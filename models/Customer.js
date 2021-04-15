const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    phone_number: {type: String, required: true},
    email: {type: String, required: false},
    password: {type: String, required: true},
    locationOn: {type: Boolean, required: true},
    init_address: {type: String, required: false},
    init_coords: {type: Schema.Types.Mixed, required: false},
    init_zip: {type: String, required: false},
    // added_coords: [{name: String, raw_address: String, long: Number, lat: Number}]
    added_coords: [{type: Schema.Types.Mixed, required: false}],
    sms_notifon: {type: Boolean, required: true, default: false},
    notif_radius: {type: Number, required: true, default: 1},
    // notif_radius in miles
    recent_orders: [{type: String, required: false}]
});

module.exports = Customer = mongoose.model('Customer', CustomerSchema);