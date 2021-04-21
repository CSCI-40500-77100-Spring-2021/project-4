module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.user && req.user.isVerified) {
            return next();
        }
        res.status(401).json({success: false, msg: 'Must be logged in to proceed'})
    },
    forwardAuthentication: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.status(200).json({success: true, msg: 'Successful login'})
    },
    ensureTfaAuthenticated: (req, res, next) => {
        if(req.user && req.user.isVerified && req.session.tfa_otp_pass) {
            return next();
        }
        res.status(401).json({success: false, msg: 'Must be Two Factor Authenticated to proceed'});
    },
    ensureUserType: (req, res, next) => {
        if(req.user && req.user.isVerified && req.session.tfa_otp_pass) {
            if(req.user.account_type === req.query.account_type) {
                return next();
            }
            res.status(401).json({success: false, msg: `Must be a ${req.query.account_type} user to proceed`});
        }
        res.status(401).json({success: false, msg: 'Must be Two Factor Authenticated to proceed'});
    }
}