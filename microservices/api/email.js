const express = require('express');
const router =  express.Router();
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');


const { configureOTPEmail } = require('../middleware/configureEmailTemplate');
const { CalcTimeInFuture } = require('../middleware/timefunctions');

const regex = /^([a-zA-Z0-9]+[a-zA-Z0-9.!#$%&'*+\-\/=?^_`{|}~]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/g;
const regex2 = /^([a-zA-Z0-9]+[a-zA-Z0-9.!#$%&'*+\-\/=?^_`{|}~]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/g;

const SENDGRID_APIKEY = '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';

checkThings = (req, res, next) => {
    let toEmail = req.body.to;
    let fromEmail = req.body.from;

    if(!regex.test(toEmail)) {
        return res.status(422).json({success: false, msg: "Please enter a valid email for the receiver."});
    }
    if(!regex2.test(fromEmail)) {
        return res.status(422).json({success: false, msg: "Please enter a valid email for the sender."});
    }
    if(typeof req.body.expr !== 'number' || !req.body.expr) {
        return res.status(422).json({success: false, msg: "The value for expr must be a number"});
    }
    if(!req.body.name || typeof req.body.name !== 'string') {
        return res.status(422).json({success: false, msg: "The value for name must be a string"});
    }
    if(req.session.email_cooldown && req.session.email_cooldown.email === toEmail && req.session.email_cooldown.expr > Date.now()) {
        return res.status(422).json({success: false, msg: "An email has already been sent within the past 10 minutes; code is still valid."});
    }
    if(req.session.email_cooldown && req.session.email_cooldown.email === toEmail && req.session.email_cooldown.expr <= Date.now()) {
        delete req.session.email_cooldown;
        next();
    }
    next();
}

router.post('/send-email', checkThings, (req, res) => {
    console.log(req.body);
    let code = uuidv4();
    code = code.substring(0,6);

    const emailText = configureOTPEmail(req.body.name, code);

    const exprTime = CalcTimeInFuture(req.body.expr, 'mins');

    sgMail.setApiKey(SENDGRID_APIKEY);

    let sender = req.body.from;
    let receiver = req.body.to;

    const msg = {
        to: receiver,
        from: sender,
        subject: 'Your Serve OTP',
        html: emailText
    };
    sgMail.send(msg, (err, result) => {
        if(Object.entries(err).length > 0) {
            return res.status(500).json({success: false, msg: "Something went wrong; couldn't send email.", err});
        }

        return res.status(200).json({success: true, msg: `An email has been sent to ${req.body.to}`, result});
    })
})


module.exports = router;
