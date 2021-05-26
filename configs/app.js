const IN_PROD = process.env.NODE_ENV === 'production';

const PORT = process.env.NODE_ENV === 'production' ?  process.env.PORT : 5000;

const MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

const CLIENT_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:3000';

const BACKEND_ORIGIN = process.env.NODE_ENV === 'production' ? process.env.BACKEND_ORIGIN : 'http://localhost:5000';

const SENDGRID_KEY = process.env.NODE_ENV === 'production' ? process.env.SENDGRID_KEY_PROD : process.env.SENDGRID_KEY_DEV;

const DCA_TEST_USER = {
  license_nbr: process.env.FAKE_DCA_LICENSE,
  license_type: process.env.FAKE_DCA_TYPE,
  lic_expir_dd: process.env.FAKE_DCA_EXPR,
  license_status: process.env.FAKE_DCA_STATUS,
  license_creation_date: process.env.FAKE_DCA_CREATE,
  industry: process.env.FAKE_DCA_INDUSTRY,
  business_name: process.env.FAKE_DCA_BUSINESS_NAME,
  address_city: process.env.FAKE_DCA_CITY,
  address_state: process.env.FAKE_DCA_STATE,
  address_zip: process.env.FAKE_DCA_ZIP,
  contact_phone: process.env.FAKE_DCA_NUMBER
};

module.exports = {
    OPEN_DATA_KEY: process.env.OPEN_DATA_KEY,
    OPEN_DATA_SECRET: process.env.OPEN_DATA_SECRET,
    OPEN_DATA_APP_TOKEN: process.env.OPEN_DATA_APP_TOKEN,
    OPEN_DATA_SECRET_TOKEN: process.env.OPEN_DATA_SECRET_TOKEN,
    YELP_API_CLIENT_ID: process.env.YELP_API_CLIENT_ID,
    YELP_API_KEY: process.env.YELP_API_KEY,
    TWILIO_SMS_NUMBER: process.env.TWILIO_SMS_NUMBER, 
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID, 
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    JWT_EMAIL_SIGN_KEY: process.env.JWT_EMAIL_SIGN_TOKEN,
    RESEND_PAYLOAD_KEY: process.env.RESEND_PAYLOAD_KEY,
    PROJECT_EMAIL: process.env.GMAIL_ACCOUNT,

    IN_PROD,
    PORT,
    MONGO_URI,
    CLIENT_ORIGIN,
    BACKEND_ORIGIN,
    SENDGRID_KEY,

    DCA_TEST_USER
};










