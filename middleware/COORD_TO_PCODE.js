const fetch = require('node-fetch');
const osm_uri= 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&';

parseCoordToPostCode = (longlat) => {
    const long = longlat[0];
    const lat = longlat[1];

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        }
        else {
            throw new Error("couldn't parse coordinates to postcode");
        }
    })
    .then((data) => {
        if(!data.error) {
            let postcode = data.address.postcode;
            return postcode;
        }
        else {
            throw new Error(data.error.message);
        }
    })
}

module.exports = { parseCoordToPostCode };