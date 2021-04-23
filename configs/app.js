const dotenv = require('dotenv').config();

exports.IN_PROD = process.env.NODE_ENV === 'production';

exports.PORT = process.env.NODE_ENV === 'production' ?  process.env.PORT : 5000;

exports.MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:3000';

exports.SENDGRID_KEY = process.env.NODE_ENV === 'production' ? process.env.SENDGRID_KEY_PROD : process.env.SENDGRID_KEY_DEV;

const {
    OPEN_DATA_KEY,
    OPEN_DATA_SECRET,
    OPEN_DATA_APP_TOKEN,
    OPEN_DATA_SECRET_TOKEN,
    YELP_API_CLIENT_ID,
    YELP_API_KEY,
    TWILIO_SMS_NUMBER, 
    TWILIO_ACCOUNT_SID, 
    TWILIO_AUTH_TOKEN,
    JWT_EMAIL_SIGN_TOKEN
} = process.env;

exports = { JWT_EMAIL_SIGN_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER, OPEN_DATA_APP_TOKEN, OPEN_DATA_KEY, OPEN_DATA_SECRET, OPEN_DATA_SECRET_TOKEN, YELP_API_CLIENT_ID, YELP_API_KEY };
