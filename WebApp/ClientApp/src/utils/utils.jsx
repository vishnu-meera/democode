/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import {enableLogging} from 'utils/config';
const { getCode} = require('country-list');

const mapColorCodes = {
    "NoAlert" : "#CC99FF",
    "Alert":"#FF9933"
};

export default class Utils {
    constructor(){

    };

    log = (modulename,message,object)=>{
        if(enableLogging){
            if(object)
                console.log(`${modulename} file : ${message}`, object);
            else
                console.log(`${modulename} file : ${message}`);
        }
    };

    getCode = getCode;
    mapColorCode = Object.values(mapColorCodes);
    mapColorCodes = mapColorCodes;

    generalUSMapMarkerData = ()=>{
 
        let data =   [{
            latLng: [41.50, -87.37],
            name: 'Chicago',
            stateCode:'IL',
            health:1,
            noOfDeployedUnits:11,
            rowNumber:0,
            stateName:"Illinois"
        }, {
            latLng: [32.46, -96.46],
            name: 'Dallas',
            stateCode:'TX',
            health:1,
            noOfDeployedUnits:9,
            rowNumber:1,
            stateName:"Texas"
        }, {
            latLng: [34.3, -118.15],
            name: 'Los Angeles',
            stateCode:'CA',
            health:1,
            noOfDeployedUnits:10,
            rowNumber:2,
            stateName:"California"
        }, {
            latLng: [40.43, -74.00],
            name: 'New York City',
            stateCode:'NY',
            health:1,
            noOfDeployedUnits:7,
            rowNumber:3,
            stateName:"New York"
        }, {
            latLng: [37.339 , -121.895],
            name: 'San Jose',
            stateCode:'CA',
            health:1,
            noOfDeployedUnits:5,
            rowNumber:4,
            stateName:"California"
        },
        {
            latLng: [32.716 , -117.165],
            name: 'San Deigo',
            stateCode:'CA',
            health:1,
            noOfDeployedUnits:11,
            rowNumber:5,
            stateName:"California"
        },
        {
            latLng: [37.775 , -122.419],
            name: 'San Fransico',
            stateCode:'CA',
            health:0,
            noOfDeployedUnits:16,
            rowNumber:6,
            stateName:"California"
        },
        {
            latLng: [36.748 , -119.772],
            name: 'Frenso',
            stateCode:'CA',
            health:1,
            noOfDeployedUnits:11,
            rowNumber:7,
            stateName:"California"
        }];

        return data;
    };

    async getMapData() {
        this.log("utils","getMapData method enter");
        try {
            let apiToken = "";
            let requestUrl = 'api/HvacData/ByStatecode';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apiToken}
            });
            let data = await (this.handleErrors(response)).json();
            let batchIdSet = new Set();
            let mapData =  data.countries

            let batchObjectArray = {};
            data.countries.forEach(obj=>{
                batchIdSet.add(obj.batchId)


                if(obj.batchId in batchObjectArray){
                    batchObjectArray[obj.batchId].push({
                        temperature : parseFloat(obj.mTemperature),
                        humidity:parseFloat(obj.aHumidity),
                        pressure:parseFloat(obj.mPressure),
                        alerType : obj.alert,
                        timeCreated: obj.timeCreated
                    });
                }else{
                    batchObjectArray[obj.batchId] = [{
                        temperature : parseFloat(obj.mTemperature),
                        humidity:parseFloat(obj.aHumidity),
                        pressure:parseFloat(obj.mPressure),
                        alerType : obj.alert,
                        timeCreated: obj.timeCreated
                    }];
                }
            });

            this.log("utils","getMapData method data", batchObjectArray);



            this.log("utils","getMapData method exit");
            return { mapData, batchIdSet, batchObjectArray};
        } catch (error) {
            this.log("utils","getMapData method error", error.message);
            return {mapData:null,batchIdSet:null}
        } finally {
            //TODO
        }
    };


    handleErrors(response) {
        this.log("Utils","handleErrors method : " , response);
        let ok = response.ok;
        if (!ok) {
            let status = response.status;
            let statusText = response.statusText;
            if (status >= 500) {
                throw new Error(`ServerError: ErrorMsg ${statusText} & status code ${status}`);
            }
            if (status <= 501) {
                throw new Error(`ApplicationError: ErrorMsg ${statusText} & status code ${status}`);
            }
            throw new Error(`NetworkError: ErrorMsg ${statusText} & status code ${status}`);
        }
        return response;
    };
}

