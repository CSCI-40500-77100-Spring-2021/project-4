const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');

const Business = require('../../models/Business');

const licenseRegex = /^([0-9]{7})(-DCA)$/g;
const regex = /^([a-zA-Z0-9]+[a-zA-Z0-9.!#$%&'*+\-\/=?^_`{|}~]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/g;

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

const { SearchDCALicense } = require('../../middleware/DCA_SEARCH');
const { SendMsgWithCallBack } = require('../../middleware/SMS_VERIFICATION');
const { CalcTimeInFuture } = require('../../middleware/TIME_FUNCTIONS');
const { configureEmailTemplate } = require('../../middleware/CONFIG_EMAIL_TEMPLATE');
const { TokenisePayload } = require('../../middleware/HASH_PAYLOAD');

const { JWT_EMAIL_SIGN_KEY, RESEND_PAYLOAD_KEY, PROJECT_EMAIL, CLIENT_ORIGIN } = require('../../configs/app');

verifyToken = (req, res, next) => {
    // req.token = req.query.token;
    req.token = req.params.token;
    if(!req.token || typeof req.token === 'undefined' || typeof req.token === null) {
        return res.status(403).json({success: false, msg: "Invalid email verification link, or your link has expired."});
    }
    next();
}

proceed_to_dca_signup2 = (req, res, next) => {
    if(req.session.dca_search.sms_success) {
        next();
    }
    if(req.session.dca_search.success && req.session.dca_search.license === req.body.license && req.session.dca_search.data) {
        next();
    }
    return res.status(401).json({success: false, msg: "Action not permitted; DCA license must be searched first."});
}
proceed_to_dca_signup2_1 = (req, res, next) => {
    if(req.session.dca_search.sms_success) {
        next();
    }
    if(!req.session.dca_search.success || req.session.dca_search.license !== req.body.license || req.session.dca_search.data) {
        return res.status(401).json({success: false, msg: "Action not permitted; DCA license must be searched first."});
    }
    else if(req.session.dca_search.ver_code && req.session.dca_search.ver_code.code && req.session.dca_search.ver_code.expr > Date.now()) {
        return res.status(202).json({success: true, msg: "Verification SMS has already been sent out; please wait 5 minutes before requesting a resend."});
    }
    else if(req.session.dca_search.ver_code && req.session.dca_search.ver_code.code && req.session.dca_search.ver_code.expr < Date.now()) {
        delete req.session.dca_search.ver_code;
        next();
    }
    else {
        next();
    }
}
proceed_to_dca_signup2_2 = (req, res, next) => {
    if(req.session.dca_search.sms_success) {
        next();
    }
    if(!req.session.dca_search.success || req.session.dca_search.license !== req.body.license || req.session.dca_search.data) {
        return res.status(401).json({success: false, msg: "Action not permitted; DCA license must be searched first."});
    }
    if(req.session.dca_search.ver_code && req.session.dca_search.ver_code.code && req.session.dca_search.ver_code.expr < Date.now()) {
        delete req.session.dca_search.ver_code;
        return res.status(401).json({success: false, msg: "Verification code has expired, please request a resend."});
    }
    next();
}
proceed_to_dca_signup3 = (req, res, next) => {
    if(req.session.dca_search.sms_success && req.session.dca_search.data) {
        next();
    }
    res.status(401).json({success: false, msg: "Action not permitted, must go through steps 1-2 of DCA verification process."});
}
proceed_to_dca_signup_final = (req, res, next) => {
    if(req.session.dca_search.verificationSuccess && req.session.dca_search.prelimVerifiedUser) {
        next();
    }
    res.status(401).json({success: false, msg: "Action not permitted; no proof of email verification success, in session data."});
}

//Signup with dca license
router.get('/signup-dca-step1', async (req, res) => {
    delete req.session.dca_search;

    const license = req.body.dca_license;
    if(!license || !licenseRegex.test(license)) {
        return res.status(422).json({success: false, msg: 'Please provide a valid DCA license'});
    }

    let dca_search_res = await SearchDCALicense(license);

    if(dca_search_res.matchFound()) {
        req.session.dca_search = {success: true, license: dca_search_res.data.license_nbr, data: dca_search_res.data};
        return res.status(202).json({success: true, msg: "Matching business found!", business: dca_search_res.data});
    }
    else {
        return res.status(422).json({success: false, msg: "No matching business found; please enter a valid DCA license", business: {}})
    }
});

router.get('/proceed-dca-signup2', proceed_to_dca_signup2, (req, res) => {
    const cur_auth = req.session.dca_search.data;
    // delete req.session.dca_search;

    return res.status(202).json({success: true, msg: "Client may proceed to step 2 of DCA signup.", business: cur_auth});
});

router.get('/signup-dca-step2-1', proceed_to_dca_signup2_1, async (req, res) => {
    let vcode = uuidv4();
    vcode = vcode.substring(0,6);

    
    const verification_body = `Your DCA license verification code is: ${vcode}`;
    const verification_to = req.session.dca_search.data.contact_phone;
    const verification_cbroute = '/handle-dca-sms-fail';

    let sms_res = await SendMsgWithCallBack(verification_body, verification_to, verification_cbroute); //params: body, to, callback_route

    if(sms_res.isError) {
        return res.status(422).json({success: false, msg:`${sms_res.errorCode} ${sms_res.errorMsg}`, msg_info: sms_res});
    }
    else {
        req.session.dca_search.ver_code = {code: vcode, expr: CalcTimeInFuture(5, 'min')};

        return res.status(202).json({success: true, msg: `A DCA verification code has been sent via SMS to contact: ${sms_res.sentTo}`, msg_info: sms_res});
    }
});

router.get('/signup-dca-step2-2', proceed_to_dca_signup2_2, (req, res) => {
    if(req.session.dca_search.sms_success) {
        return res.status(202).json({success: true, msg: "DCA license successfully verified; proceed with completing signup.", business: req.session.dca_search.data});
    }
    if(req.body.ver_code === req.session.dca_search.ver_code.code) {
        req.session.dca_search.sms_success = true;
        return res.status(202).json({success: true, msg: "DCA license successfully verified; proceed with completing signup.", business: req.session.dca_search.data});
    }
    else {
        // delete req.session.dca_search.ver_code;
        return res.status(422).json({success: false, msg: "Invalid verification code; please enter the correct code sent to you."})
    }
});

router.get('/proceed-dca-signup3', proceed_to_dca_signup3, (req, res) => {
    const cur_auth = req.session.dca_search.data;

    return res.status(202).json({success: true, msg: "Client may proceed to step 3 of DCA signup.", business: cur_auth});
});


router.get('/signup-dca-final-1', proceed_to_dca_signup3, (req, res) => {
    const { 
        has_dca_license,
        business_name,
        permanent_address,
        coordinates,
        manager,
        contact_number,
        contact_email,
        business_type,
    } = req.body;

    const sessData = req.session.dca_search.data;
    const licenseInfo = {
        dca_license: sessData.license_nbr,
        license_status: sessData.license_status,
        license_type: sessData.license_type,
        license_creation_date: sessData.license_creation_date,
        license_expr_date: sessData.lic_expir_dd,
        license_industry: sessData.industry
    };
    // check for inputs
    if(!has_dca_license) {
        return res.status(401).json({success: false, msg: "Must have a DCA license to proceed with this action"});
    }
    if(!business_name.trim() || !permanent_address.trim() || !coordinates || !manager.trim() || !contact_email.trim() 
    || !business_type.trim() || !contact_number.trim()) {
        return res.status(401).json({success: false, msg: "Please enter all fields."});
    }

    const newBizUser = {
        has_dca_license,
        business_name,
        permanent_address,
        coordinates,
        manager,
        contact_number,
        contact_email,
        business_type,
        ...licenseInfo
    };

    Business.findOne({dca_license: licenseInfo.dca_license})
    .then((bizz) => {
        if(bizz) {
            return res.status(403).json({success: false, msg: `A business account already exists with the license: ${licenseInfo.dca_license}`});
        }
        else {
            jwt.sign({newBizUser}, JWT_EMAIL_SIGN_KEY, {expiresIn: '24h'}, (err, token) => {
                if(err) {
                    return res.status(500).json({success: false, msg: "Something went wrong with jwt signing for email verification.", err});
                }

                const returnLink = `${CLIENT_ORIGIN}/business-email-verification/${token}`;
                const htmlContent = configureEmailTemplate(newBizUser.manager, newBizUser.business_name, returnLink);
                const resendToken = TokenisePayload(newBizUser, RESEND_PAYLOAD_KEY, {expiresIn: '24h'});

                const msg = {
                    to: newBizUser.contact_email,
                    from: PROJECT_EMAIL,
                    subject: 'Your Serve business account, email verification.',
                    html: htmlContent
                };

                sgMail.send(msg, (err) => {
                    if(err) {
                        return res.status(500).json({success: false, msg: "Something went wrong trying to complete email verification.", err});
                    }
                    
                    const emailCooldown = CalcTimeInFuture(10, 'mins');

                    req.session.dca_search.emailCoolDownExpr = emailCooldown;

                    return res.status(201).json({success: true, msg: "Email verification link successfully sent", resendPayload: resendToken});
                })
            })
        }
    })
    .catch(err => {
        return res.status(500).json({success: false, msg: "Something went wrong trying to complete email verification", err});
    })
});

router.get('/signup-dca-resend-verification-email', proceed_to_dca_signup3, (req, res) => {
    const resend_token = req.body.token;

    if(!resend_token) {
        return res.status(422).json({success: false, msg: "Something went wrong trying to resend verification email.", err: {msg: 'No resend token provided'}});
    }

    if(Date.now() =< req.session.dca_search.emailCoolDownExpr) {
        return res.status(201).json({success: true, msg: "Email verification already sent; cooldown not over", resendPayload: resend_token});
    }

    const hash = resend_token.substring(0,resend_token.length-(RESEND_PAYLOAD_KEY.length+1));

    jwt.verify(hash, RESEND_PAYLOAD_KEY, {expiresIn: '24h'}, (err, payload) => {
        if(err) {
            return res.status(500).json({success: false, msg: "Something went wrong trying to resend verification email.", err});
        }

        const newBizUser = payload.newBizUser;
        jwt.sign({newBizUser}, JWT_EMAIL_SIGN_KEY, {expiresIn: '24h'}, (err, token) => {
            if(err) {
                return res.status(500).json({success: false, msg: "Something went wrong with jwt signing for email verification.", err});
            }

            const returnLink = `${CLIENT_ORIGIN}/business-email-verification/${token}`;
            const htmlContent = configureEmailTemplate(newBizUser.manager, newBizUser.business_name, returnLink);
            const resendToken = TokenisePayload(newBizUser, RESEND_PAYLOAD_KEY, {expiresIn: '24h'});

            const msg = {
                to: newBizUser.contact_email,
                from: PROJECT_EMAIL,
                subject: 'Your Serve business account, email verification.',
                html: htmlContent
            };

            sgMail.send(msg, (err) => {
                if(err) {
                    return res.status(500).json({success: false, msg: "Something went wrong trying to complete email verification.", err});
                }
                const emailCooldown = CalcTimeInFuture(10, 'mins');
                req.session.dca_search.emailCoolDownExpr = emailCooldown;

                return res.status(201).json({success: true, msg: "Email verification link successfully sent", resendPayload: resendToken});
            })
        })
    })

});

router.get('/signup-dca-renew-expired-link', (req, res) => {
    const token = req.body.token;

    if(!token) {
        return res.status(422).json({success: false, msg: "Sorry, something went wrong trying to renew expired verification link", err: {msg:"No payload token provided"}});
    }

    jwt.verify(token, JWT_EMAIL_SIGN_KEY, {expiresIn: '24h'}, (err, payload) => {
        if(err) {
            return res.status(500).json({success: false, msg: "Something went wrong trying to resend verification email.", err});
        }

        const newBizUser = payload.newBizUser;
        jwt.sign({newBizUser}, JWT_EMAIL_SIGN_KEY, {expiresIn: '24h'}, (err, token) => {
            if(err) {
                return res.status(500).json({success: false, msg: "Something went wrong with jwt signing for email verification.", err});
            }

            const returnLink = `${CLIENT_ORIGIN}/business-email-verification/${token}`;
            const htmlContent = configureEmailTemplate(newBizUser.manager, newBizUser.business_name, returnLink);
            const resendToken = TokenisePayload(newBizUser, RESEND_PAYLOAD_KEY, {expiresIn: '24h'});

            const msg = {
                to: newBizUser.contact_email,
                from: PROJECT_EMAIL,
                subject: 'Your Serve business account, email verification.',
                html: htmlContent
            };

            sgMail.send(msg, (err) => {
                if(err) {
                    return res.status(500).json({success: false, msg: "Something went wrong trying to complete email verification.", err});
                }
                const emailCooldown = CalcTimeInFuture(10, 'mins');
                req.session.dca_search.emailCoolDownExpr = emailCooldown;

                return res.status(201).json({success: true, msg: "Email verification link successfully sent", resendPayload: resendToken});
            })
        })
    })
});

router.get('/signup-dca-verify-email', verifyToken, (req, res) => {
    jwt.verify(req.token, JWT_EMAIL_SIGN_KEY, {expiresIn: '24h'}, (err, payload) => {
        if(err) {
            return res.status(500).json({success: false, msg: "Something went wrong trying to verify your account email.", err});
        }

        let newBizUser = payload.newBizUser;

        Business.findOne({dca_license: newBizUser.dca_license})
        .then((bizz) => {
            if(bizz) {
                return res.status(403).json({success: false, msg: "Ivalid/expired verification link; business account already exists with that license."});
            }

            let noPassBizzUser = new Business({
                ...newBizUser,
                verified: true,
                passwordGiven: false
            });

            noPassBizzUser.save()
            .then(bus => {
                req.session.dca_search.prelimVerifiedUser = bus;
                req.session.dca_search.verificationSuccess = true;

                return res.status(201).json({success: true, msg: "Successfully verified business email; may proceed to provide passwords.", business: bus});
            })
            .catch(err => {
                if(Object.entries(err).length > 0) {
                    return res.status(500).json({success: false, msg: "Something went wrong, couldn't verify accout.", err});
                }
            })

        })
        .catch(err => {
            return res.status(500).json({success: false, msg: "Something went wrong trying to  verify account.", err});
        })
    })
});

router.get('/signup-dca-final-1', proceed_to_dca_signup_final, (req, res) => {
    const { password, confirmPassword } = req.body;
    if(!password || !confirmPassword || password.trim().length === 0 || confirmPassword.trim().length === 0) {
        return res.status(422).json({success: false, msg: "Please complete both password fields!"});
    }
    if(password.trim() !== confirmPassword.trim()) {
        return res.status(422).json({success: false, msg: "Passwords must match!"});
    }
    if(!passwordRegex.test(password)) {
        return res.status(422).json({success: false, msg: "Passwords must be at least 8 characters long, and must inlcude at least 1 capital letter, 1 lowercase letter, and a number."})
    }

    
})





