const { IN_PROD } = require('./app');
const SESSION_SECRET = process.env.SESSION_SECRET;

const oneHour = 1000 * 60 * 60;

const {
    SESSION_NAME = 'sid',
    SESSION_IDLE_TIMEOUT = oneHour,    
} = process.env;

const SESSION_OPTIONS = {
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    cookie: {
        maxAge: parseInt(SESSION_IDLE_TIMEOUT),
        secure: IN_PROD,
        sameSite: true
    },
    rolling: true,
    resave: false,
    saveUnitialized: true
};

exports.SESSION_OPTIONS = SESSION_OPTIONS;