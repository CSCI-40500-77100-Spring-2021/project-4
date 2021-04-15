const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Business = require('./Business');

const Yelp_Business = Business.discriminator('Yelp_Business', new Schema({
    auth_type: {type: String, required: true},
    // auth_type is either: UBER, GRUBHUB, YELP, or IN_PERSON_VERIFICATION/OTHER
    auth_creds: {type: Schema.Types.Mixed, required: true},
    store_id: {type: String, required: true},
    store_status: {type: String, required: true},
    store_details: {type: Schema.Types.Mixed, required: true},
    store_claimed: {type: Boolean, required: true}
}));

module.exports = mongoose.model('Yelp_Business');