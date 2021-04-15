const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    customer: {type: String, required: true, ref: 'Customer'},
    business: {type: String, required: true, ref: 'Business'},
    customer_text: {type: String, required: true},
    business_reply: {type: String, required: false}
});

module.exports = Review = mongoose.model('Review', ReviewSchema);