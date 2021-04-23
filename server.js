const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

// const { PORT, MONGO_URI, CLIENT_ORIGIN, IN_PROD } = require('./configs/app');
const cookieParser = require('cookie-parser');

const { SESSION_OPTIONS } = require('./configs/session');
const { PORT, MONGO_URI, CLIENT_ORIGIN, IN_PROD } = require('./configs/app');

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//Passport config here
require('./configs/passport')(passport);

const db = MONGO_URI;
mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to Mongodb cluster...');
})
.catch(err => {
    console.error(err);
});

app.use(session({
    ...SESSION_OPTIONS,
    store: new redisStore({ host: 'localhost', port: 6379, client: redisClient })
}));

//initialise Passportjs middleware here
app.use(passport.initialize());
app.use(passport.session());

if(IN_PROD) {
    app.use(express.static('client/my-app/build'));
    app.enable('trust proxy');

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'my-app', 'build', 'index.html'));
    });
}


const SERVER = app.listen(PORT, () => {
    console.log('App server is running on port: ', PORT);
});

redisClient.on('connect', () => {
    console.log('Redis server in running on port: 6379');

});

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

