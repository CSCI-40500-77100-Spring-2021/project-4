const {
    NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';

exports.PORT = NODE_ENV === 'production' ?  process.env.PORT : 5000;

exports.MONGO_URI = NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:3000';

exports.IN_PROD = IN_PROD;
