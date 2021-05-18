const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const TwoFAStrategy = require('passport-2fa-totp').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Business = require('../models/Business');
const Customer = require('../models/Customer');

function SessionConstructor(user_id, account_type) {
    this.user_id = user_id;
    this.account_type = account_type;
}

module.exports = (passport) => {
    passport.use('businessP-login', new LocalStrategy({usernameField: 'phone'}, (phone, password, done) => {
        Business.findOne({contact_number: phone})
        .then(user => {
            if(!user) {
                return done(null, false, {msg: 'Phone number is not registered'});
            }
            if(!user.verified || !user.passwordGiven) {
                return done(null, false, {msg: 'Account must be verified, and password protected to continue'});
            }

            bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {msg: 'Password is incorrect'});
                }
            })
        })
    }));

    passport.use('businessE-login', new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        Business.findOne({contact_email: email})
        .then(user => {
            if(!user) {
                return done(null, false, {msg: 'Email is not registerd, or linked to an existing account'});
            }
            if(!user.verified || !user.passwordGiven) {
                return done(null, false, {msg: 'Account must be verified, and password protected to continue'});
            }

            bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {msg: 'Password is incorrect'});
                }
            })
        })
    }))

    passport.use('customerP-login', new LocalStrategy ({usernameField: 'phone'}, (phone, password, done) => {
        Customer.findOne({phone_number: phone})
        .then(user => {
            if(!user) {
                return done(null, false, {msg: 'Phone number is not registered'});
            }
            if(!user.verified) {
                return done(null, false, {msg: 'Account must be verified to continue'});
            }

            bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {msg: 'Password is incorrect'});
                }
            })
        })
    }));

    passport.use('customerE-login', new LocalStrategy ({usernameField: 'email'}, (email, password, done) => {
        Customer.findOne({email: email})
        .then(user => {
            if(!user) {
                return done(null, false, {msg: 'Email is not registered'});
            }
            if(!user.verified) {
                return done(null, false, {msg: 'Account must be verified to continue'});
            }
            
            bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
                if(err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {msg: 'Password is incorrect'});
                }
            });
        })
    }));

    passport.use('tfaotp-auth', new CustomStrategy ((req, done) => {
        //req.session.tfa_otp = where tfa one time pass is
        // req.session.tfa_otp_pass = true/false (wheter tfa was successful or not)
        if(!req.user || !req.user.tfa_otp) {
            return done(null, false, {msg: 'First auth layer not passed.'});
        }
        if(!req.session.tfa_otp) {
            return done(null, false, {msg: 'No tfa_otp in session; first auth layer must be passed.'});
        }
        if((req.session.tfa_otp === req.user.tfa_otp) && (req.session.tfa_otp === req.body.tfa_otp)) {
            return done(null, user);
        }
    }))

    passport.serializeUser((user, done) => {
        let user_session = new SessionConstructor(user._id, user.account_type);
        done(null, user_session);
    }); // result of serialise user is attached to sessoion as `req.session.passport.user`

    passport.deserializeUser((user_session_obj, done) => {
        if(user_session_obj.account_type === 'Customer') {
            Business.findById(user_session_obj.user_id, (err, user) => {
                done(err, user);
            })
        }


        if(user_session_obj.account_type === 'Business') {
            Customer.findById(user_session_obj.user_id, (err, user) => {
                done(err, user);
            })
        }
    })
}