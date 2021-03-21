const fetch = require('node-fetch');
const { YELP_API_KEY, YELP_API_CLIENT_ID } = require('../configs/app');

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

YelpQueryByNumber = (number) => {

}

YelpQueryByName = (name, location, advanced) => {
    const bqname = name.trim();
    const bqloc = advanced ? location.trim() : "NY";
    
    const qlimit = 50;

    let resList = [];

    if(!bqloc || bqloc.length === 0) {
        
    }
    if(!bqname || bqname.length === 0) {

    }


}

YelpQueryByID = (id) => {

}