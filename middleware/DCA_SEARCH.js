const fetch = require('node-fetch');
const { OPEN_DATA_APP_TOKEN, OPEN_DATA_SECRET_TOKEN, OPEN_DATA_KEY } = require('../configs/app');

class DCA_Check_Result {
    constructor(license, data, success, msg) {
        this.license = license;
        this.data = data;
        this.success = success;
        this.msg = msg;
    }

    getData() {
        return this.data;
    }

    getLicense() {
        return this.license;
    }

    getMsg() {
        return this.msg;
    }

    matchFound() {
        return this.data.length > 0 && this.success;
    }
}



const licenseRegex = /^([0-9]{7})(-DCA)$/g;



SearchDCALicense = async (license) => {
    if(!licenseRegex.test(license)) {
        let failedSearch = new DCA_Check_Result(license, [], false, "Invalid DCA-license.");
        return failedSearch;
    }

    let searchRespose = await fetch(`https://data.cityofnewyork.us/resource/w7w3-xahh.json?license_nbr=${license}`, {
        headers: {
            'X-App-Token': OPEN_DATA_APP_TOKEN,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    let searchData = await searchRespose.json();
    let resSuccess = !searchData.error;
    let noRes = resSuccess && searchData.length < 1;
    let resMsg = resSuccess ? "License match found" : "Something went wrong";
    resMsg = noRes ? "No license match found." : resMsg;
    let result = new DCA_Check_Result(license, searchData, resSuccess, resMsg);
    
    return result;
}

module.exports = SearchDCALicense;