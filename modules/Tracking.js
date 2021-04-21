import Is from "strong-type";
import { getTracking } from "../utils/api-json.js";
import urls from "../utils/urls.js";
import {DominosFormat} from './DominosFormat.js';

const is=new Is;

class Tracking extends DominosFormat{
    constructor(proxyPrefix=''){
        super();
        this.proxyPrefix = proxyPrefix;
        return this;
    }

    get dominosPhoneAPIResult(){
        return this.#dominosPhoneAPIResult;
    }

    get dominosAPIResult(){
        return this.#dominosAPIResult;
    }

    #dominosPhoneAPIResult={}
    #dominosAPIResult={}

    async byPhone(phone) {
        is.string(phone);

        const url=`${this.proxyPrefix}${urls.trackRoot}${urls.track}?phonenumber=${phone}`;

        //console.log(url)

        this.#dominosPhoneAPIResult=await getTracking(url);

        //console.dir(this.dominosPhoneAPIResult,{depth:10});

        //Actions is an array should probably loop through
        //for now it is available on tracking.dominosPhoneAPIResult

        try{
            is.object(this.#dominosPhoneAPIResult[0]);
        }catch(err){
            throw new DominosTrackingError('No results found;');
        }

        const trackingURL=`${this.proxyPrefix}${urls.trackRoot}${this.#dominosPhoneAPIResult[0].Actions.Track}`;

        this.#dominosAPIResult=await getTracking(trackingURL);

        this.formatted=this.#dominosAPIResult;
        //console.dir(this.dominosAPIResult,{depth:10});

        return this;
    }

    //canada still uses the classic method
    async byPhoneClassic(phone) {
        //you will need to parse this
        //with something like xml2js
        this.#dominosPhoneAPIResult=await get(`${this.proxyPrefix}${urls.track}Phone=${phone}`);

        return this;
    }
}

export {
    Tracking as default,
    Tracking
}
