const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseOptions = {
    discriminatorKey: "has_dca_license",
    collection: "Businesses"
};

const GeneralBusiness = new Schema({
    has_dca_license: {type: Boolean, required: true},
    business_name: {type: String, required: true},
    permanent_address: {type: String, required: true},
    coordinates: [{type: Number, required: true}],
    manager: {type: String, required: true},
    contact_number: {type: String, required: true},
    contact_email: {type: String, required: true},
    connected_shops: [{type: Schema.Types.Mixed, required: false}],
    shop_images: [{type: Schema.Types.Mixed, required: false}],
    rating: {type: Schema.Types.Mixed, required: false, default: "N/A"},
    reviews: {type: String, required: false, ref: "Reviews"},
    business_type: {type: String, required: true},
    timeOpen: {type: String, required: true},
    timeClose: {type: String, required: true},
    master_key: {type: String, required: true},

    account_type: {type: String, required: true, default: 'Business'},
    verified: {type: Boolean, required: true, default: false},
    tfa_otp: {type: String, required: true}
}, baseOptions);

module.exports = Business = mongoose.model('Business', GeneralBusiness);