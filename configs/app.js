const {
    NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';

exports.PORT = NODE_ENV === 'production' ?  process.env.PORT : 5000;

exports.MONGO_URI = NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:3000';

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
} = process.env;

module.exports = {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER, OPEN_DATA_APP_TOKEN, OPEN_DATA_KEY, OPEN_DATA_SECRET, OPEN_DATA_SECRET_TOKEN, YELP_API_CLIENT_ID, YELP_API_KEY};

exports.IN_PROD = IN_PROD;
