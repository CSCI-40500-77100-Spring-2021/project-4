const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT;


const app = express();

app.use(cors({
    origin: 'http://localhost:6000'
  }));

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