const jwt = require('jsonwebtoken');


TokenisePayload = (payload, signKey, signOptions) => {
    jwt.sign({payload}, signKey, signOptions, (err, token) => {
        if(err) {
            return null;
        }
        return `${token}-${signKey}`;
    })
}

module.exports = { TokenisePayload };