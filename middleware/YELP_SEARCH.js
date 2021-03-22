const fetch = require('node-fetch');
const { YELP_API_KEY, YELP_API_CLIENT_ID } = require('../configs/app');

const phone_regex = /^((\+1)?)(([0-9]{3})([0-9]{3})([0-9]{4}))$/g;

class Yelp_Search_Result {
    constructor(query_param, contact_number, business_name, full_address, long_lat, address_zip, yelp_id, msg, error) {
        this.queryType = query_param;
        this.contact_number = contact_number;
        this.business_name = business_name;
        this.full_address = full_address;
        this.long_lat = long_lat;
        this.address_zip = address_zip;
        this.yelp_id = yelp_id;
        this.msg = msg;
        this.error = error;
    }

    isError() {
        return this.error;
    }

    getMsg() {
        return this.msg;
    }

    hasContanct() {
        return this.contact_number && this.contact_number.length.trim() > 0;
    }
}

YelpQueryByNumber = async (number) => {
    let resList = [];
    let queryNumber = number.trim();
    queryNumber = queryNumber[0] !== '+' ? `+${queryNumber}` : queryNumber;

    if(!phone_regex.test(queryNumber)) {
        let invalidNumRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
        invalidNumRes.error = true;
        invalidNumRes.queryType = 'phone';
        invalidNumRes.msg = "Please enter a valid phone number";

        resList.push(invalidNumRes);
        return resList;
    }
    else {
        let searchResponse = await fetch(`https://api.yelp.com/v3/businesses/search/phone?phone=${queryNumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YELP_API_KEY}`,
            }
        });

        let searchData = await searchResponse.json();

        let resError = searchData.error && searchData.error.code;
        let resMsg = resError ? `Something went wrong; ${searchData.error.description}` : "Successful search; here are the best matching results.";

        searchData.businesses.map((buss, idx) => {
            let curBizFullAdd = `${buss.location.address1}, ${buss.location.city}, ${buss.location.state} ${buss.location.zip_code}`;
            let curBizCoords = [buss.coordinates.longitude, buss.coordinates.latitude];
            let curBiz = new Yelp_Search_Result('phone', buss.phone, buss.name, curBizFullAdd, curBizCoords, buss.location.zip_code, buss.id, resMsg, resError);
            
            resList.push(curBiz);
        });
        return resList;
    }
}

YelpQueryByName = async (name, location, advanced) => {
    const bqname = name.trim();
    const bqloc = advanced ? location.trim() : "NY";
    
    const qlimit = 50;

    let resList = [];

    if(!bqloc || bqloc.length === 0) {
        let noLocRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
        noLocRes.error = true;
        noLocRes.msg = "No valid location provided";
        noLocRes.queryType = 'name';

        resList.push(noLocRes);
        return resList;
    }
    else if(!bqname || bqname.length === 0) {
        let noNameRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
        noNameRes.error = true;
        noNameRes.msg = "No valid business name provided";
        noLocRes.queryType = 'name';

        resList.push(noNameRes);
        return resList;
    }
    else {
        let searchResponse = await fetch(`https://api.yelp.com/v3/businesses/search?term=${bqname}&location=${bqloc}&limit=${qlimit}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YELP_API_KEY}`,
            }
        });

        let searchData = await searchResponse.json();

        let resError = searchData.error && searchData.error.code;
        let resMsg = resError ? searchData.error.code : "Successful search; here are the best matches.";
        
        if(resError) {
            let errRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
            errRes.error = true;
            errRes.msg = resMsg;
            noLocRes.queryType = 'name';

            resList.push(errRes);
            return resList;
        }
        else {
            searchData.businesses.map((buss, index) => {
                let curBizFullAdd = `${buss.location.address1}, ${buss.location.city}, ${buss.location.state} ${buss.location.zip_code}`;
                let curBizCoords = [buss.coordinates.longitude, buss.coordinates.latitude];
                let curBiz = new Yelp_Search_Result('name', buss.phone, buss.name, curBizFullAdd, curBizCoords, buss.location.zip_code, buss.id, resMsg, resError);
                
                resList.push(curBiz);
            });
        }
        return resList;
    }


}

YelpQueryByID = async (id) => {
    if(!id || id.length < 1) {
        let noIdRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
        noIdRes.error = true;
        let resMsg = "Enter valid Yelp business ID";
        noIdRes.msg = resMsg;
        noIdRes.queryType = 'id';
        return noIdRes;
    }
    else {
        let searchResponse = await fetch(`https://api.yelp.com/v3/businesses/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YELP_API_KEY}`,
            }
        });
        let searchData = await searchResponse.json();
        
        let resErr = searchData.error && searchData.error.code;
        let resMsg = resErr ? searchData.error.description : "Successful request; best match found";

        if(resErr) {
            let erredRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
            erredRes.error = true;
            erredRes.queryType = 'id';
            erredRes.msg = resMsg;
            
            return erredRes;
        }

        const buss = searchData;
        let curBizFullAdd = `${buss.location.address1}, ${buss.location.city}, ${buss.location.state} ${buss.location.zip_code}`;
        let curBizCoords = [buss.coordinates.longitude, buss.coordinates.latitude];
        let curBiz = new Yelp_Search_Result('id', buss.phone, buss.name, curBizFullAdd, curBizCoords, buss.location.zip_code, buss.id, resMsg, resErr);
        
        return curBiz;
    }
}

YelpQueryExactMatch = async (name, address, city) => {
    const params = {
        name: name,
        address: address,
        city: city,
        state: 'NY',
        country: 'US'
    };

    if(!name || !address || !city) {
        let noInputRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
        noInputRes.error = true;
        noInputRes.msg = "Required fields not completed";
        noInputRes.queryType = 'match';
        return noInputRes;
    }
    else if(name.length < 1 || address.length < 5 || city.length < 2) {
        let noInputRes = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
        noInputRes.error = true;
        noInputRes.msg = "Valid inputs required for all inputs";
        noInputRes.queryType = 'match';
        return noInputRes;
    }
    else {
        let searchResponse = await fetch(`https://api.yelp.com/v3/businesses/matches?name=${params.name}&address1=${params.address}&city=${params.city}&state=${params.state}&country=${params.country}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YELP_API_KEY}`,
            }
        });

        let searchData = await searchResponse.json();

        let resErr = searchData.error && searchData.error.code;
        let resMsg = resErr ? searchData.error.description : "Successful request; best match found";

        if(resErr) {
            let erredData = new Yelp_Search_Result(null, null, null, null, null, null, null, null, null);
            erredData.error = true;
            erredData.msg = "Couldn't find an exact match; review input data.";
            erredData.queryType = 'match';
            return erredData;
        }

        const buss = searchData;
        let curBizFullAdd = `${buss.location.address1}, ${buss.location.city}, ${buss.location.state} ${buss.location.zip_code}`;
        let curBizCoords = [buss.coordinates.longitude, buss.coordinates.latitude];
        let curBiz = new Yelp_Search_Result('match', buss.phone, buss.name, curBizFullAdd, curBizCoords, buss.location.zip_code, buss.id, resMsg, resErr);
        
        return curBiz;
    }

}

module.exports = {YelpQueryByID, YelpQueryByName, YelpQueryByNumber, YelpQueryExactMatch, Yelp_Search_Result};