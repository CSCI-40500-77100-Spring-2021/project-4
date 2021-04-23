const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

const { JWT_EMAIL_SIGN_TOKEN, SENDGRID_KEY } = require('../configs/app');

