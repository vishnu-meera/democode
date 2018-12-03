/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

const { getCode} = require('country-list');

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
                console.log("RoadMap==>", roadMap)
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
    console.log("parseMicrosoftObject==>", microsoft);
    return microsoft;
}

export default class Utils {
    cardIconCssObj = {
        "Potential": "nc-icon nc-bulb-63",
        "Approved": "nc-icon nc-check-2",
        "InProgress": "nc-icon nc-cloud-download-93",
        "Live": "nc-icon nc-compass-05"
    };

    textIconCssObj = {
        "Potential": "text-info",
        "Approved": "text-success",
        "InProgress": "text-warning",
        "Live": "text-potenial"
    };

    getCode = getCode;
    async getCardsData() {
        try {
            let requestUrl = 'api/CountriesStatus';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET"//,headers: { 'authorization': 'Bearer ' + this.getWebApiToken() }
            });
            let data = await (this.handleErrors(response)).json();
            return data;
        } catch (error) {
            return null
        } finally {
           //TODO
        }
    }

    async getMapData() {
        try {
            let requestUrl = 'api/CountriesStatus/ByCountryCode';
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET"//,headers: { 'authorization': 'Bearer ' + this.getWebApiToken() }
            });
            let data = await (this.handleErrors(response)).json();
            let keys = Object.keys(data.countriesStatusList);
            let mapData = {};
            keys.forEach(element => {
                mapData[getCode(element)] = data.countriesStatusList[element]
            });
            let tableData = await this.getTableData({ ...data.countriesStatusList });
            return { mapData, tableData };
        } catch (error) {
            return null
        } finally {
            //TODO
        }
    }

    async getTableData(countryObj) {
        console.log("countryObj==>", countryObj)
        let keys = Object.keys(countryObj);
        console.log(keys)
        let tableObject = [];
        for (const key of keys) {
            let status = "";
            switch (countryObj[key]) {
                case 1:
                    status = "Live";
                    break;
                case 2:
                    status = "InProgress";
                    break;
                case 3:
                    status = "Approved";
                    break;
                case 4:
                    status = "Potential";
                    break;
                default:
                    break;
            };
            console.log(key);
            let countryCode = getCode(key);
            let { Population, Gdp } = await this.getPopulationAndGdp(countryCode);
            tableObject.push([key, Population, Gdp, status])
        }
        return tableObject;
    }

    async getPopulationAndGdp(countryCode) {
        console.log("getPopulationAndGdp")
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
            console.log("Population ", Population);
            console.log("Gdp ", Gdp);
        } catch (error) {
            console.log("getPopulationAndGdp==>", error.message);
        }

        return { Population, Gdp };
    }
    
    async getMicrosoftObject(country) {
        console.log("getMicrosoftObject==>country", country)
        try {
            let requestUrl = `api/CountryRoadMap/${country}`;
            let response = await fetch(requestUrl, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                method: "GET"//,headers: { 'authorization': 'Bearer ' + this.getWebApiToken() }
            });
            let data = await (this.handleErrors(response)).json();
            console.log("getMicrosoftObject==>", data);
            return parseMicrosoftObject(data.roadMapObject);
        } catch (error) {
            return null
        } finally {
            //TODO
        }
    }

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
    }
}

