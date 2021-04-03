const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER} = require('../configs/app')

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const phone_regex = /^((\+1)?)(([0-9]{3})([0-9]{3})([0-9]{4}))$/g;

class TwilioResponse {
    constructor(msgBody, dateCreated, dateSent, dateUpdated, msgStatus, to, withCallback, isError, errorCode, errorMsg) {
        this.body = msgBody;
        this.created = dateCreated;
        this.dateSent = dateSent;
        this.dateUpdated = dateUpdated;
        this.status = msgStatus;
        this.sentTo = to;
        this.hasCallback = withCallback;
        this.isError = isError;
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }

    getRecipient() {
        return this.sentTo;
    }

    isSuccessful() {
        return !this.isError;
    }

    getError() {
        return [this.errorCode, this.errorMsg];
    }

    getSentArriveTimeDiffSecs() {
        const timeCreated = new Date(this.created);
        const timeArrived = new Date(this.dateSent);

        const diff = (timeArrived - timeCreated)/1000;
        return diff;
    }

    isStatus(inpStatus) {
        return this.status = inpStatus;
    }

    getStatus() {
        return this.status;
    }

    sentWithCallback() {
        return this.hasCallback;
    }
}

SendMsgWithCallBack = async (body, to, callbackRoute) => {
    if(!phone_regex.test(to)) {
        let failed =  new TwilioResponse();
        failed.isError = true;
        failed.errorMsg = "Invalid recipient phone number";
        failed.errorCode = 422;

        return failed;
    }

    let sendMsg = await twilioClient.messages.create({
        body: body,
        from: TWILIO_SMS_NUMBER,
        statusCallback: callbackRoute,
        to: to
    });

    let msgResp = await sendMsg.toJSON();

    let twilResp = new TwilioResponse(msgResp.body, msgResp.date_created, msgResp.date_sent, msgResp.date_updated, msgResp.status, msgResp.to, true, msgResp.error_code !== null, msgResp.error_code, msgResp.error_msg);

    return twilResp;
}

SendMsgNoCallback = async (body, to) => {
    if(!phone_regex.test(to)) {
        let failed =  new TwilioResponse();
        failed.isError = true;
        failed.errorMsg = "Invalid recipient phone number";
        failed.errorCode = 422;

        return failed;
    }

    let sendMsg = await twilioClient.messages.create({
        body: body,
        from: TWILIO_SMS_NUMBER,
        to: to
    });

    let msgResp = await sendMsg.toJSON();
    let twilResp = new TwilioResponse(msgResp.body, msgResp.date_created, msgResp.date_sent, msgResp.date_updated, msgResp.status, msgResp.to, false, msgResp.error_code !== null, msgResp.error_code, msgResp.error_msg);

    return twilResp;
}

module.exports = {SendMsgNoCallback, SendMsgWithCallBack};
