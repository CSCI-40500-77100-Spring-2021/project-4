const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Business = require('./Business');

const No_DCA_Business = Business.discriminator('No_DCA_Business', new Schema({
    auth_type: {type: String, required: true},
    // auth_type is either: UBER, GRUBHUB, YELP, or IN_PERSON_VERIFICATION/OTHER
    auth_creds: {type: Schema.Types.Mixed, required: true}
}));

module.exports = mongoose.model('No_DCA_Business');