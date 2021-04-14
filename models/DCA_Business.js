const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Business = require('./Business');

const DCA_Business = Business.discriminator('DCA_Business', new Schema({
    dca_license: {type: String, required: true},
    license_status: {type: String, required: true},
    license_type: {type: String, required: true},
    license_creation_date: {type: String, required: true},
    license_expr_date: {type: String, required: true},
    license_industry: {type: String, required: true}    
}));

module.exports = mongoose.model('DCA_Business');