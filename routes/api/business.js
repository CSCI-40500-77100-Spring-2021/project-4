const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');

const Business = require('../../models/Business');

const licenseRegex = /^([0-9]{7})(-DCA)$/g;
const regex = /^([a-zA-Z0-9]+[a-zA-Z0-9.!#$%&'*+\-\/=?^_`{|}~]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/g;

const { SearchDCALicense } = require('../../middleware/DCA_SEARCH');
const { SendMsgWithCallBack } = require('../../middleware/SMS_VERIFICATION');
const { CalcTimeInFuture } = require('../../middleware/TIME_FUNCTIONS');

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
    if(req.session.dca_search.sms_success) {
        next();
    }
    res.status(401).json({success: false, msg: "Action not permitted, must go through steps 1-2 of DCA verification process."});
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


router.get('/signup-dca-final', proceed_to_dca_signup3, (req, res) => {
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


    let newBizz = new Business({

    });
});



