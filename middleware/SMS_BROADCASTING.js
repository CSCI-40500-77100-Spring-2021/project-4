const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER} = require('../configs/app')

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const { SendMsgWithCallBack } = require('./SMS_VERIFICATION')

const phone_regex = /^((\+1)?)(([0-9]{3})([0-9]{3})([0-9]{4}))$/g;

class notifReceiver {
    constructor(name, number, longlat, pA) {
        this.name = name;
        this.number = number;
        this.longlat = longlat;
        this.dist = this.haversineDistance(pA, longlat);
    }

    isValidNum() {
        const tst = phone_regex.test(this.number);
        return tst;
    }

    hasLocation() {
        const hasLoc = this.longlat[0] && this.longlat[1];
        return hasLoc;
    }

    distanceTo(pointA) {
        let euclideanDistance = Math.sqrt(Math.pow((pointA[0]-this.longlat[0]),2) + Math.pow((pointA[1]-this.longlat[1]),2));
        return euclideanDistance;
    }

    haversineDistance(pointA, pointB) {
        let pALong = pointA[0];
        let pALat = pointA[1];

        let pBLong = pointB[0];
        let pBLat = pointB[1];

        const R = 6371e3;
        const pALatRadians = pALat * (Math.PI/180);
        const pBLatRadians = pBLat * (Math.PI/180);

        const dLat = Math.abs(pBLat - pALat) * (Math.PI/180);
        const dLong = Math.abs(pBLong - pALong) * (Math.PI/180);

        const a = Math.pow(Math.sin(dLat/2),2) + (Math.cos(pALatRadians) * Math.cos(pBLatRadians) * Math.pow(Math.sin(dLong/2),2));

        const c = 2 * (Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));

        const d = R * c;
    }
}

computeHaversineDistance = (pointA, pointB) => {
    let pALong = pointA[0];
    let pALat = pointA[1];

    let pBLong = pointB[0];
    let pBLat = pointB[1];

    const R = 6371e3;
    const pALatRadians = pALat * (Math.PI/180);
    const pBLatRadians = pBLat * (Math.PI/180);

    const dLat = Math.abs(pBLat - pALat) * (Math.PI/180);
    const dLong = Math.abs(pBLong - pALong) * (Math.PI/180);

    const a = Math.pow(Math.sin(dLat/2),2) + (Math.cos(pALatRadians) * Math.cos(pBLatRadians) * Math.pow(Math.sin(dLong/2),2));

    const c = 2 * (Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));

    const d = R * c;
}

ListToObjs = (from, toArr) => {
    let front = 0;
    let back = toArr.length - 1;

    if(front === back) {
        toArr[front] = new notifReceiver(toArr[front].name, toArr[front].number, toArr[front].longlat, from);
        return toArr;
    }

    while(front < back) {
        toArr[front] = new notifReceiver(toArr[front].name, toArr[front].number, toArr[front].longlat, from);
        toArr[back] = new notifReceiver(toArr[back].name, toArr[back].number, toArr[back].longlat, from);

        front++;
        back--;

        if(front === back) {
            toArr[front] = new notifReceiver(toArr[front].name, toArr[front].number, toArr[front].longlat, from);
        }
    }
    return toArr;
}

leftChildIdx = (parentIdx) => {
    return (parentIdx * 2) + 1;
}

rightChildIdx = (parentIdx) => {
    return (parentIdx * 2) + 2;
}

bubbleDownHeap = (heap, heapLength, index) => {
    while(index < heapLength) {
        let leftIdx = leftChildIdx(index);
        let rightIdx = rightChildIdx(index);

        if(leftIdx >= heapLength) {
            break;
        }

        let largerChildIdx = leftIdx;
        
        if((rightIdx < heapLength) && (heap[leftIdx].dist < heap[rightIdx].dist)) {
            largerChildIdx = rightIdx;
        }

        if(heap[index].dist < heap[largerChildIdx].dist) { 
            [heap[index], heap[largerChildIdx]] = [heap[largerChildIdx], heap[index]];

            index = largerChildIdx;
        }
        else {
            break;
        }
    }
}

removeMax = (heap, heapLength) => {
    let maxDist = heap[0];

    heap[0] = heap[heapLength-1];

    bubbleDownHeap(heap, heapLength -1, 0);

    return maxDist;
}

makeHeap = (arr) => {
    for(let i = arr.length - 1; i > -1; i--) {
        bubbleDownHeap(arr, arr.length, i);
    }
}

SortFarToNear = (arr) => {
    let bcstToUsers = arr;

    makeHeap(bcstToUsers);

    let heapSize = bcstToUsers.length;

    while(heapSize > 0) {
        let largestVal = removeMax(bcstToUsers, heapSize);
        heapSize --;

        bcstToUsers[heapSize] = largestVal;
    }
}

BroadCastToZip = async (from, body, toArr, callbackRoute) => {
    let objd = await ListToObjs(from, toArr);

    SortFarToNear(objd);
    
    let resArr = [];

    objd.forEach((user, index) => {
        let res = await SendMsgWithCallBack(body, user.number, callbackRoute);
        resArr.push(res);
    });

    return resArr;
}

module.exports = { BroadCastToZip, computeHaversineDistance };
