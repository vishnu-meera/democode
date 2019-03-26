/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import Auth from 'utils/authhelper';
import {enableLogging} from 'utils/config';
const { getCode,getName} = require('country-list');

const mapColorCodes = {
    "Live" : "#CC99FF",
    "InProgress":"#FF9933",
    "Approved":"#228B22",
    "Potential":"#00FFFF"
};

const parseMicrosoftObject = (data) => {
    let microsoft = {
        "capex": "no data",
        "publicAnnouncement":"no data",
        "azureGa": "no data",
        "officeGa": "no data",
        "revenue3Y":"no data",
        "revenue5Y": "no data",
        "dcxCustomers": "no data"
    };

    try {
        if (data) {
            if (data.length > 0) {
                let roadMap = JSON.parse(data);
                microsoft.capex = (((roadMap || {}).Office_1 || {})["CAPEX Approved"] || {}).actualdate;
                microsoft.publicAnnouncement = ((roadMap || {}).Office_1 || {})["Public Announcement"];
                microsoft.azureGa = (((roadMap || {}).Azure || {}).GA || {}).actualdate;
                microsoft.officeGa = (((roadMap || {}).Office_2 || {})["External Public GA"] || {}).actualdate;;
                microsoft.revenue3Y = "";
                microsoft.revenue5Y = "";
                microsoft.dcxCustomers = "";
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return microsoft;
}

const countryStatusConverterObj = {
    1: "Live",
    2: "InProgress",
    3: "Approved",
    4: "Potential"
};

const countryStatusConverterObj2 = {
    "Live" : 1,
    "InProgress":2,
    "Approved":3,
    "Potential":4
};

export default class Utils {
    constructor(){
        this.auth = new Auth();

    };

    log = (modulename,message,object)=>{
        if(enableLogging){
            if(object)
                console.log(`${modulename} file : ${message}`, object);
            else
                console.log(`${modulename} file : ${message}`);
        }
    };

    cardIconCssObj = {
        "Potential": "nc-icon nc-bulb-63",
        "Approved": "nc-icon nc-check-2",
        "InProgress": "nc-icon nc-cloud-download-93",
        "Live": "nc-icon nc-compass-05"
    };

    textIconCssObj = {
        "Potential": "text-info",
        "Approved": "text-green",
        "InProgress": "text-warning",
        "Live": "text-potenial"
    };

    getCode = getCode;
    getName = getName;
    mapColorCode = Object.values(mapColorCodes);
    mapColorCodes = mapColorCodes;
    statusToShowDc = "Potential";

    async getCardsData(token) {
        this.log("utils","getCardsData method enter");
        try {
            let apiToken = token ||  this.auth.getWebApiToken();
            let requestUrl = 'api/CountriesStatus';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apiToken }
            });
            let data = await (this.handleErrors(response)).json();
            this.log("utils","getCardsData method exit");
            return data;
        } catch (error) {
            this.log("utils","getCardsData method error",error.message);
            return null
        } finally {
           //TODO
        }
    };

    async getMapData(token) {
        this.log("utils","getMapData method enter");
        try {
            let apiToken = token ||  this.auth.getWebApiToken();
            let requestUrl = 'api/CountriesStatus/ByCountryCode';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apiToken}
            });
            let data = await (this.handleErrors(response)).json();
            let keys = Object.keys(data.countriesStatusList);
            let {CountriesObject} = await this.getCountriesObject(token);
            let mapData = {} , toolTipObject = {};
            //New changes in the Dashboard : Date 03/25/2019
            keys.forEach(element => {
                mapData[getCode(element)] = data.countriesStatusList[element];
                toolTipObject[getCode(element)] = {
                    'Status':countryStatusConverterObj[data.countriesStatusList[element]],
                    'Name' :element,
                    'azureGa':"No Data",
                    'officeGa':"No Data",
                    'publicAnnouncement':"No Data",
                    'capex':"No Data"
                };
            });
            let obj = await this.getTableData({ ...data.countriesStatusList },toolTipObject,CountriesObject);
            let newToolTipObject = await this.getMicrosoftObject("All",obj.toolTip,CountriesObject,token);
            this.log("utils","getMapData method exit");
            return { mapData, tableData:obj.tableObj , toolTipObject:newToolTipObject,CountriesObject};
        } catch (error) {
            this.log("utils","getMapData method error", error.message);
            return {mapData:null,tableData:null,toolTipObject:null,CountriesObject:null}
        } finally {
            //TODO
        }
    };

    async getCountriesObject(token) {
        this.log("utils","getCountriesObject method enter");
        try {
            let requestUrl = 'api/Country';
            let apitoken  = token ||  this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });
            let data = await (this.handleErrors(response)).json();
            let CountriesObject = ("countries" in data) ? data.countries : {};
            this.log("utils","getCountriesObject method exit");
            return {CountriesObject};
        } catch (error) {
            this.log("utils","getCountriesObject method error", error.message);
            return {};
        } finally {
            //TODO
        }
    };

    async geAlltWorkloadObjects(country,dccode,token){
        this.log("utils","geAlltWorkloadObjects method enter");
        let workloadObject ;
        let apiToken = token ||  this.auth.getWebApiToken();
        try {
            let requestUrl = `api/CountryWorkLoad/${country.replace(/\s/g, '')}_${dccode}`;
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apiToken }
            });

            response = this.handleErrors(response) ; 
            let data = await response.text();
            workloadObject = JSON.parse(data);
            this.log("utils","geAlltWorkloadObjects method exit");
            return workloadObject;

        } catch (error) {
            this.log("utils","geAlltWorkloadObjects method error", error.message);
            return workloadObject
        } 
    }

    async getTableData(countryObj,toolTipObject,CountriesObject) {
        this.log("utils","getTableData method enter");
        let keys = Object.keys(countryObj);
        let tableObject = [];
        for (const key of keys) {
            let status = countryStatusConverterObj[countryObj[key]];
            let countryCode = getCode(key);
            let  Population = CountriesObject.filter(x=>x.name===key)[0]["population"];
            let  Gdp = CountriesObject.filter(x=>x.name===key)[0]["gdp"];
            toolTipObject[countryCode]['Population'] = Population;
            toolTipObject[countryCode]['Gdp'] = Gdp;
            tableObject.push([key, Population, Gdp, status])
        }
        this.log("utils","getTableData method exit");
        return {tableObj : tableObject,toolTip:toolTipObject};
    };

    async getPopulationAndGdp(countryCode) {
        this.log("utils","getPopulationAndGdp method enter",countryCode);
        let Population = "";
        let Gdp = "";
        try {
            let bodyPop = await fetch(`https://api.worldbank.org/v2/countries/${countryCode}/indicators/SP.POP.TOTL?format=json`);
            let bodyGdp = await fetch(`https://api.worldbank.org/v2/countries/${countryCode}/indicators/NY.GDP.MKTP.CD?format=json`);
            
            bodyPop = await bodyPop.text();
            bodyGdp = await bodyGdp.text();
            let data1 = JSON.parse(bodyPop);
            let data2 = JSON.parse(bodyGdp);

            Population = data1[1][0].value ? data1[1][0].value : data1[1][1].value;
            Gdp = data2[1][0].value ? data2[1][0].value : data2[1][1].value;
            this.log("utils","getPopulationAndGdp method exit",countryCode);
        } catch (error) {
            this.log("utils","getPopulationAndGdp method error",error.message);
        }

        return { Population, Gdp };
    };

    async getPopulationAndGdpByName(country){
        return await this.getPopulationAndGdp(getCode(country))
    }
    
    async getMicrosoftObject(country,toolTipObject,CountriesObject,token) {
        this.log("utils","getMicrosoftObject method enter");
        try {
            let requestUrl = country==="All"?`api/CountryRoadMap`: `api/CountryRoadMap/${country}`;
            let apiToken = token ||  this.auth.getWebApiToken() ;
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apiToken }
            });
            let data = await (this.handleErrors(response)).json();
            if(country !=="All")
                return parseMicrosoftObject(data.roadMapObject);
            else{
                for (const roadmap of data.countries) {
                    try {
                        let code = await getCode(roadmap.countryName)
                        let microsoft = parseMicrosoftObject(roadmap.roadMapObject);
                        toolTipObject[code]["azureGa"] = microsoft.azureGa || "No Data"
                        toolTipObject[code]["officeGa"] = microsoft.officeGa || "No Data"
                        toolTipObject[code]["publicAnnouncement"] = microsoft.publicAnnouncement || "No Data"
                        //New changes in the Dashboard : Date 03/25/2019
                        try {
                            toolTipObject[code]["capex"] = microsoft.capex.toString().replace("**","") || "No Data";
                        } catch (error) {
                            toolTipObject[code]["capex"] = "No Data";
                        }
                    } catch (error) {
                        this.log("utils","getMicrosoftObject method error", error.message);
                    }
                }
                
                return toolTipObject;
            }
        } catch (error) {
            this.log("utils","getMicrosoftObject method error", error.message);
            return null
        } finally {
            this.log("utils","getMicrosoftObject method exit");
        }
    };

    async getOverViewObject(country) {
        this.log("utils","getOverViewObject method enter");
        let overViewObject = {};
        try {
            let countryCode = await getCode(country);
            let microsoft = await this.getMicrosoftObject(country);
            let { Population, Gdp } = await this.getPopulationAndGdp(countryCode);

            overViewObject["nationalView"] = { population: Population, gdp: Gdp };
            overViewObject["Opportunity"] = {
                "tamN": "",
                "tamUN": "",
            };
            overViewObject["microsoft"] = microsoft;
        } catch (error) {
            this.log("utils","getOverViewObject method error",error.message);
        }
        this.log("utils","getOverViewObject method exit");
        return overViewObject;
    };

    async getDataCenterObject(country,token){
        this.log("Utils","getDataCenterObject method enter");
        let dataCentersObject = [];
        try {
            let apitoken = token ||  this.auth.getWebApiToken();
            let requestUrl = `api/Country/${country}`;
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });
            let data = await (this.handleErrors(response)).json();

            dataCentersObject = JSON.parse(data.dataCenters)
            this.log("Utils","getDataCenterObject method exit");
            return dataCentersObject;
        } catch (error) {
            this.log("Utils","getDataCenterObject method error", error.message);
            return null
        } 
    };

    async getDataCenterObjectWithDCCode(country,dccode, token){
        this.log("Utils","getDataCenterObjectWithDCCode method enter");
        let dataCenterTimeLineObject ;
        try {
            let requestUrl = `api/CountryDataCenters/${country}/${dccode}`;
            let apitoken = token ||  this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });

            response = this.handleErrors(response) ; 
            let data = await response.text();
            dataCenterTimeLineObject = JSON.parse(data);
            this.log("Utils","getDataCenterObjectWithDCCode method exit");
            return dataCenterTimeLineObject;

        } catch (error) {
            this.log("Utils","getDataCenterObjectWithDCCode method error", error.message);
            return dataCenterTimeLineObject
        } 
    };

    async geMoveStatusObject(country){
        this.log("Utils","geMoveStatusObject method enter");
        let moveStatusObject = {}, moveStatusItems={}
        try {
            let apitoken  =  this.auth.getWebApiToken();
            let requestUrl = `api/MoveStatus/${country}`;
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });
            let data = await (this.handleErrors(response)).json();
            moveStatusObject = JSON.parse(data.moveStatusPercentageObj);
            moveStatusItems = JSON.parse(data.moveStatusItems);
            this.log("Utils","geMoveStatusObject method exit");
        } catch (error) {
            this.log("Utils","geMoveStatusObject method error", error.message);
            return null
        } finally {
           //TODO
        }
        
        return {moveStatusObject,moveStatusItems};
    };

    async getRuleTable(token){
        this.log("Utils","getRuleTable method enter");
        let ruleTable ;
        try {
            let apitoken  = token ||  this.auth.getWebApiToken();
            let requestUrl = 'api/RuleTable';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });
            
            let data = await (this.handleErrors(response)).json();
            ruleTable = data.rules
            this.log("Utils","getRuleTable method exit");
        } catch (error) {
            this.log("Utils","getRuleTable method error",error.message);
            return [];
        } finally {
           //TODO
        }
        return {ruleTable};
    };

    async getAllTimelineList(token){
        this.log("Utils","getAllTimelineList method enter");
        let timelineObject ;
        try {
            let requestUrl = `api/CountryDataCenters`;
            let apitoken = token ||  this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });

            response = this.handleErrors(response) ; 
            let data = await response.text();
            timelineObject = JSON.parse(data);
            this.log("Utils","getAllTimelineList method exit");
            return timelineObject;

        } catch (error) {
            this.log("Utils","getAllTimelineList method error",error.message);
            return timelineObject
        } 
    };

    cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    };

    filterMapAndTableDataOnCard(key,mapObj,tableData){
        this.log("Utils","filterMapAndTableDataOnCard method enter");
        let tableFeedData = tableData.filter(x=>x.includes(key));
        let mapFeedData = {};
        Object.keys(mapObj).forEach(objKy=>{
            if(mapObj[objKy]===countryStatusConverterObj2[key])
                mapFeedData[objKy]=countryStatusConverterObj2[key]
        });
        let mapColorCode = [];
        let colorKey = Object.keys(mapColorCodes).filter(x=>x===key);
        mapColorCode.push(mapColorCodes[colorKey]);
        this.log("Utils","filterMapAndTableDataOnCard method exit");
        return {mapFeedData,tableFeedData,mapColorCode};

    }

    filterMapAndTable(countryCode,mapObj,tableData){
        this.log("Utils","filterMapAndTable method enter");
        let mapFeedData = {};
        let mapColorCode = [];

        let tableFeedData = tableData.filter(x=>x.includes(this.getName(countryCode)));

        Object.keys(mapObj).forEach(objKy=>{
            if(objKy===countryCode)
            mapFeedData[countryCode] = mapObj[countryCode];
        });
        
        mapColorCode.push(mapColorCodes[countryStatusConverterObj[mapFeedData[countryCode]]]);
        this.log("Utils","filterMapAndTable method exit");
        return {mapFeedData,tableFeedData,mapColorCode};
    }

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

