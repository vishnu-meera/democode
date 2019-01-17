/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import Auth from 'utils/authhelper';
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
                microsoft.capex = (((roadMap || {}).Infrastructure || {})["CAPEX Approved"] || {}).actualdate;
                microsoft.publicAnnouncement = ((roadMap || {}).Infrastructure || {})["Public Announcement"];
                microsoft.azureGa = (((roadMap || {}).Azure || {}).GA || {}).actualdate;
                microsoft.officeGa = (((roadMap || {}).Office || {}).GA || {}).actualdate;;
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
        try {
            let apiToken = token ||  this.auth.getWebApiToken();
            let requestUrl = 'api/CountriesStatus';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apiToken }
            });
            let data = await (this.handleErrors(response)).json();
            return data;
        } catch (error) {
            return null
        } finally {
           //TODO
        }
    };

    async getMapData(token) {
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
            keys.forEach(element => {
                mapData[getCode(element)] = data.countriesStatusList[element];
                toolTipObject[getCode(element)] = {
                    'Status':countryStatusConverterObj[data.countriesStatusList[element]],
                    'Name' :element,
                    'azureGa':"No Data",
                    'officeGa':"No Data",
                    'publicAnnouncement':"No Data"
                };
            });
            let obj = await this.getTableData({ ...data.countriesStatusList },toolTipObject,CountriesObject);
            let newToolTipObject = await this.getMicrosoftObject("All",obj.toolTip,CountriesObject,token);
            //console.log("toolTipObject==>",newToolTipObject);
            return { mapData, tableData:obj.tableObj , toolTipObject:newToolTipObject,CountriesObject};
        } catch (error) {
            return {mapData:null,tableData:null,toolTipObject:null,CountriesObject:null}
        } finally {
            //TODO
        }
    };

    async getCountriesObject(token) {
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
            //console.log("getCountriesObject==>",CountriesObject);
            return {CountriesObject};
        } catch (error) {
            return {};
        } finally {
            //TODO
        }
    };

    async geAlltWorkloadObjects(country,dccode,token){
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
            console.log("geAlltWorkloadObjects==>", workloadObject);
            return workloadObject;

        } catch (error) {
            console.log("geAlltWorkloadObjects==> error",error.message)
            return workloadObject
        } 
    }

    async getTableData(countryObj,toolTipObject,CountriesObject) {
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
        return {tableObj : tableObject,toolTip:toolTipObject};
    };

    async getPopulationAndGdp(countryCode) {
        let Population = "";
        let Gdp = "";
        try {
            let bodyPop = await fetch(`https://api.worldbank.org/v2/countries/${countryCode}/indicators/SP.POP.TOTL?format=json`);
            let bodyGdp = await fetch(`https://api.worldbank.org/v2/countries/${countryCode}/indicators/NY.GDP.MKTP.CD?format=json`);
            bodyPop = await bodyPop.text();
            bodyGdp = await bodyGdp.text();
            let data1 = JSON.parse(bodyPop);
            let data2 = JSON.parse(bodyGdp);
            Population = data1[1][0].value
            Gdp = data2[1][0].value
        } catch (error) {
            console.log("getPopulationAndGdp==>", error.message);
        }

        return { Population, Gdp };
    };

    async getPopulationAndGdpByName(country){
        return await this.getPopulationAndGdp(getCode(country))
    }
    
    async getMicrosoftObject(country,toolTipObject,CountriesObject,token) {
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
                        //console.log("getMicrosoftObjec$$$$$==>",microsoft,toolTipObject)
                        toolTipObject[code]["azureGa"] = microsoft.azureGa || "No Data"
                        toolTipObject[code]["officeGa"] = microsoft.officeGa || "No Data"
                        toolTipObject[code]["publicAnnouncement"] = microsoft.publicAnnouncement || "No Data"
                    } catch (error) {
                        //console.log("getMicrosoftObjec$$$$$==>",error.message)
                    }
                }
                //console.log("getMicrosoftObject==>",toolTipObject)
                return toolTipObject;
            }
        } catch (error) {
            return null
        } finally {
            //TODO
        }
    };

    async getOverViewObject(country) {

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
            //TODO 
            console.log("getOverViewObject==> ", error.message);
        }
        return overViewObject;
    };

    async getDataCenterObject(country,token){
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
            return dataCentersObject;
        } catch (error) {
            return null
        } 
    };

    async getDataCenterObjectWithDCCode(country,dccode, token){
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
            return dataCenterTimeLineObject;

        } catch (error) {
            console.log("dataCenterTimeLineObject==> error",error.message)
            return dataCenterTimeLineObject
        } 
    };

    async geMoveStatusObject(country){
        let moveStatusObject = {}, moveStatusItems={}
        try {
            let apitoken  =  this.auth.getWebApiToken();
            console.log("geMoveStatusObject==>", apitoken)
            let requestUrl = `api/MoveStatus/${country}`;
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET",headers: { 'authorization': 'Bearer ' + apitoken }
            });
            let data = await (this.handleErrors(response)).json();
            console.log("geMoveStatusObject==>",country)
            moveStatusObject = JSON.parse(data.moveStatusPercentageObj);
            moveStatusItems = JSON.parse(data.moveStatusItems);
        } catch (error) {
            return null
        } finally {
           //TODO
        }
        
        return {moveStatusObject,moveStatusItems};
    };

    async getRuleTable(token){
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

        } catch (error) {
            return [];
        } finally {
           //TODO
        }
        return {ruleTable};
    };

    getToolTipText(code){

    }

    cloneObject(obj){
        return JSON.parse(JSON.stringify(obj));
    };

    filterMapAndTableDataOnCard(key,mapObj,tableData){
        let tableFeedData = tableData.filter(x=>x.includes(key));
        let mapFeedData = {};
        Object.keys(mapObj).forEach(objKy=>{
            if(mapObj[objKy]===countryStatusConverterObj2[key])
                mapFeedData[objKy]=countryStatusConverterObj2[key]
            // console.log("filterMapAndTableDataOnCard==>,",mapObj[objKy],countryStatusConverterObj2[key])
        });
        //console.log("filterMapAndTableDataOnCard==>,",mapFeedData)
        let mapColorCode = [];
        let colorKey = Object.keys(mapColorCodes).filter(x=>x===key);
        mapColorCode.push(mapColorCodes[colorKey]);
        return {mapFeedData,tableFeedData,mapColorCode};

    }

    filterMapAndTable(countryCode,mapObj,tableData){
        
        let mapFeedData = {};
        let mapColorCode = [];

        let tableFeedData = tableData.filter(x=>x.includes(this.getName(countryCode)));

        Object.keys(mapObj).forEach(objKy=>{
            if(objKy===countryCode)
            mapFeedData[countryCode] = mapObj[countryCode];
        });
        
        mapColorCode.push(mapColorCodes[countryStatusConverterObj[mapFeedData[countryCode]]]);

        console.log("countryCode==>",mapColorCode);
        console.log("mapFeedData==>",mapFeedData);
        console.log("tableFeedData==>",tableFeedData);
        return {mapFeedData,tableFeedData,mapColorCode};
    }

    handleErrors(response) {
        console.log("handleErrors==>", response);
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

