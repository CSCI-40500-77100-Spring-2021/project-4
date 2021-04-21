const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RememberMeTokenSchema = new Schema({
    user_id: {type: String, required: true},
    token: {type: String, required: true},
    expr_date: {type: String, required: true}
});

module.exports  = RememberMeToken = mongoose.model('RememberMeToken', RememberMeTokenSchema);