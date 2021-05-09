const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const PORT = 6000;


const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
      secret: 'e69ea015-6ed6-42f7-9adb-fe8cbf4ca167',
      resave: true,
      saveUninitialized: true
    })
);

/* Server routes */
app.use('/api/email', require('./api/email'));


const server = app.listen(PORT, () => {
    console.log("Emailing service is running on: ", PORT)
});