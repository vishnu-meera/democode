
import Utils from './utils';
const convert = require('color-convert');

let roadmapsummaryObjKeys = {    
    1:"Public Announcement",
    2:"CAPEX Approved",
    3:"Lease Signed",
    4:"TAM Award",
    5:"Colo Ready",
    6:"Dock Date",
    7:"RTEG Network",
    8:"RTEG Server",
    9:"RTEG",
    10:"Preview",
    11:"O365 Services",
    12:"GA",
    13:"Engineering Readiness", 
    14:"GA"
};

const CountryObject = {
    "PartitionKey": "Countries",
    "RowKey": "",
    "Status": "",
    "DCX_Customers": " No Data",
    "Name": "",
    "AzureStatus": "",
    "CAPEX": "",
    "GolocalCountry": "Yes",
    "GDP": "",
    "Population": "",
    "RevenueProjection3Y": "No Data",
    "RevenueProjection5Y": "No Data",
    "TAM_Restricted": "No Data",
    "TAM_UNRestricted": "No Data",
    "DataCenters": ""
};

const DataCenterObject = {
    "name":"",
    "dcCode":"",
    "leaseSigned":"",
    "leaseName":"",
    "rteg":"No Data",
    "dcVendors":[],
    "coloready":"",
    "coloName":"",
    "telcoVendors":[]
};

const WorkLoadObject = {
    "Key": "",
    "WorkLoadName": "",
    "DataCenterId": "",
    "DataCenterName": "",
    "Phases": "",
    "WorkLoadStatus": ""
};

const DataCenterDetailsObject = {
    "PartionKey":"",
    "RowKey":"",
    "DataCenterName":"",
    "DataCenterStatus":"",
    "TimeLine":"",
    "WorkLoads": ""
};

//temp for getting status...this will defently change
const statusArray = ['Approved', 'Live', 'InProgress','Potential'];   
const getRMCellObject = (roadMapCell,flag="")=>{
    let values = roadMapCell[0].split("\n");
    if(flag.length>0) return values[0];

    let temp = {};
    temp["actualdate"]=values.length>1?values[1]:values[0].replace(/[\r\n]/g, "");
    temp["planneddate"]=values[0].replace(/[\r\n]/g, "");
    temp["startdate"]=values[0].replace(/[\r\n]/g, "");
    temp["Status"] = "Live" //TODO : need to work here with color

    let style = roadMapCell[1]
    //console.log("sheet2Arr==>",temp,style)
    return temp;
};


const getTimeLineCellObject = (name,roadMapCell)=>{

    let values = roadMapCell[0].split("\n");
    let rgb = "none";
    let riskLevel = 0;

    if("fgColor" in roadMapCell[1]){
        if("rgb" in roadMapCell[1]["fgColor"]){
            rgb = roadMapCell[1]["fgColor"]["rgb"];
            rgb = convert.hex.keyword(rgb)
        }
    }
   
    let temp = {
        "Name":name,
		"Actual Date":values.length>1?values[1]:values[0].replace(/[\r\n]/g, ""),
		"Planned Date":values[0].replace(/[\r\n]/g, ""),
		"Risk Level":20,//based on color we will chnage this
        "Notes":{"note1":"Notes not aviable now"},
        "rgb":rgb
    };
    let style = roadMapCell[1]
    //console.log("sheet2Arr==>",temp,style)
    return temp;
};
export default class DataCapturingUtils {

    utils = new Utils();

    getRoadMapObject(roapMapExcelRows){
        const roadmapsummarykeys = ['Infrastructure','Azure','Office'];
        const keysNotInTimeLine = ["RTEG","Public Announcement","Preview"]
        let RoadMapSummary = {"Infrastructure":{},"Azure":{},"Office":{}};
        let key ,TimeLine ={};
        let CountryRoadMaps = [];
        //first three arrays should have , 2,4,14 otherwise throw error
        //Headers
        roapMapExcelRows[2].forEach((element,key)=>{
            if(key>=0 && key<8) RoadMapSummary[roadmapsummarykeys[0]][element[0]] = {};
            else if(key>7 && key<12) RoadMapSummary[roadmapsummarykeys[1]][element[0]] = {};
            else if(key>11) RoadMapSummary[roadmapsummarykeys[2]][element[0]] = {}; 
        });

        for (let index = 3; index < roapMapExcelRows.length; index++) {
            const countryRow = roapMapExcelRows[index];

            if(!(countryRow[0][0] in TimeLine)) TimeLine[countryRow[0][0]]=[];

            for (let index = 1; index < countryRow.length; index++) {
                
                let objIndex = (index>=1 && index<8) ? 0 : (index>=8 && index<13) ? 1 : 2;
                let key = roadmapsummarykeys[objIndex];
                if(roadmapsummaryObjKeys[index]==="Preview" || roadmapsummaryObjKeys[index]==="Public Announcement")
                    RoadMapSummary[key][roadmapsummaryObjKeys[index]] = getRMCellObject(countryRow[index],"YES")
                else    
                    RoadMapSummary[key][roadmapsummaryObjKeys[index]] = getRMCellObject(countryRow[index]);   
                    
                if(!keysNotInTimeLine.includes(roadmapsummaryObjKeys[index]))  {
                    let timeLineIndex = roadmapsummaryObjKeys[index];
                    if(timeLineIndex==="GA"){
                        timeLineIndex = key + " " + timeLineIndex;
                        //console.log("TimeLine===>key",timeLineIndex);
                    }
                    if("O365 Services"===timeLineIndex)timeLineIndex="O365 Services Deployment";
                    if("Engineering Readiness"===timeLineIndex)timeLineIndex="O365 Services Readiness";
                    TimeLine[countryRow[0][0]].push(getTimeLineCellObject(timeLineIndex,countryRow[index]));
                }
            }
            
            [TimeLine[countryRow[0][0]][7], TimeLine[countryRow[0][0]][8]] = [TimeLine[countryRow[0][0]][8], TimeLine[countryRow[0][0]][7]];

            CountryRoadMaps.push({
                "PartitionKey": "Countries",
                "RowKey": countryRow[0][0],
                "Status":"Live",
                "RoadMapObject":JSON.stringify(RoadMapSummary)
            });
        }

        console.log("TimeLine==>",TimeLine);
        return {CountryRoadMaps,TimeLine};
    };

    getCountriesExcelObj(cntryArray){
        let CountriesExcelObj = {};
        for (let index = 1; index < cntryArray.length; index++) {
            const element = cntryArray[index];
            // console.log("element==>",element);
            CountriesExcelObj[element[0][0]] =  {
                "Status" : element[1][0],
                "Revenue Projection 3Y" : element[2][0],
                "Revenue Projection 5Y" : element[3][0],
                "TAM Restricted" : element[4][0],
                "TAM Unrestricted" : element[5][0]
            };
        }
        //console.log("CountriesExcelObj==>",CountriesExcelObj);
        return {CountriesExcelObj};
    };

    async getCountryObject(cntryArray,countryExcelObject){
        //console.log("cntryArray===>",countryExcelObject)
        let countryObject = JSON.parse(JSON.stringify(CountryObject));
        countryObject.Name = cntryArray[0][0][0];
        countryObject.RowKey = cntryArray[0][0][0];

        if(countryObject.Name in countryExcelObject){
            countryObject.Status =  countryExcelObject[countryObject.Name]["Status"];
            countryObject.RevenueProjection3Y =  countryExcelObject[countryObject.Name]["Revenue Projection 3Y"];
            countryObject.RevenueProjection5Y =  countryExcelObject[countryObject.Name]["Revenue Projection 5Y"];
            countryObject.TAM_Restricted =  countryExcelObject[countryObject.Name]["TAM Restricted"];
            countryObject.TAM_UNRestricted =  countryExcelObject[countryObject.Name]["TAM Unrestricted"];
        }

        countryObject.AzureStatus = cntryArray[2].filter(y=>y[2]==="Azure Status")[0][0];
        countryObject.CAPEX = cntryArray[2].filter(y=>y[2]==="CAPEX")[0][0];

        let {Population,Gdp} = await this.utils.getPopulationAndGdpByName(countryObject.Name);
        countryObject.Population = Math.trunc(Population/1000000) + " million";
        countryObject.GDP = Math.trunc(Gdp/1000000000) + " billion USD";

        let dataCenterArray = [];
        for (const arr of cntryArray[2].filter(y=>y[2]==="Lease Signed")) {
            let dataCenterObject = JSON.parse(JSON.stringify(DataCenterObject));
            dataCenterObject.dcCode = arr[0].match(/\((.*)\)/)[1].replace(/\s/g, '');
            dataCenterObject.name =  arr[0].substr(0,arr[0].indexOf('(')-1);
            dataCenterObject.coloName =  arr[0].substr(0,arr[0].indexOf('(')-1);
            dataCenterObject.leaseName =  arr[0];
            cntryArray[2].filter(y=>y[2]==="DC Vendors").forEach(arr=>{
                if(arr[0].split(':')[0]===dataCenterObject.dcCode)
                    dataCenterObject.dcVendors.push(arr[0].split(':')[1])
            });
            dataCenterObject.telcoVendors = cntryArray[2].filter(y=>y[2]==="Telco vendor").map(x=>x[0]);
            dataCenterObject.coloready =  cntryArray[3].filter(y=>y[2]===dataCenterObject.coloName)[0][0];
            dataCenterObject.leaseSigned = cntryArray[3].filter(y=>y[2]===dataCenterObject.leaseName)[0][0];
            dataCenterArray.push(dataCenterObject);
        }
        countryObject.DataCenters = JSON.stringify(dataCenterArray);
        console.log("countryObject==>",countryObject);
        return [countryObject,dataCenterArray];
    };

    getPhasesObject(workloadarray){
        let phasesObject = {}, key ;

        for (let index = 1; index < workloadarray.length; index++) {
            const elementArray = workloadarray[index];

            let length = elementArray.length;
            //the value of 10 will change according to schema change
            key = (length===10) ? elementArray[0][0] :key;
            if (!(key in phasesObject)) phasesObject[key] = [];

            phasesObject[key].push({
                "Phase"				:length===10? elementArray[1][0]:elementArray[0][0],
                "Planned Start"		:length===10? elementArray[2][0]:elementArray[1][0],
                "Planned Finish"	:length===10? elementArray[3][0]:elementArray[2][0],
                "Planned Duration"	:length===10? elementArray[4][0]:elementArray[3][0],
                "Revised Start"		:length===10? elementArray[5][0]:elementArray[4][0],
                "Revised Finish"	:length===10? elementArray[6][0]:elementArray[5][0],
                "Revised Duration"	:length===10? elementArray[7][0]:elementArray[6][0],
                "Status"			:length===10? elementArray[8][0]:elementArray[7][0],
                "Remarks"			:length===10? elementArray[9][0]:elementArray[8][0]
            });
            
        }
        //console.log("getPhasesObject key==>",phasesObject);
        return {phasesObject}
    };

    getWorkloadObject(workloadarray,datacenterarray,countryName,workLoadsHeader){
        let cntryName = countryName.replace(/\s/g, '');
        let temp = [];
        let {phasesObject} = this.getPhasesObject(workloadarray);
        for (const datacenter of datacenterarray) {
            for (let index = 1; index < workLoadsHeader.length; index++) {
                const element = workLoadsHeader[index];
                let workLoadObject = JSON.parse(JSON.stringify(WorkLoadObject));
                workLoadObject.Key = `${cntryName}_${datacenter.dcCode}`;
                workLoadObject.DataCenterId = `${datacenter.dcCode}`;
                workLoadObject.DataCenterName = datacenter.name;
                workLoadObject.WorkLoadStatus = statusArray[Math.floor(Math.random() * statusArray.length)];
                workLoadObject.WorkLoadName = element[0];
                workLoadObject.Phases = JSON.stringify(phasesObject[element[0]]);
                temp.push(workLoadObject);
            }
        }
        //console.log("getWorkLoadPhaseseObject 1==>",workloadarray);
        //console.log("getWorkLoadPhaseseObject 2==>",temp);
        return temp;
    };


    getDCWorkLoads(dataCenterRowArr){
        let workloads = {}, key ,count=0;
        //console.log("getDCWorkLoads dataCenterRowArr==>",dataCenterRowArr);
        for (let index = 0; index < dataCenterRowArr.length; index++) {
            const elementArray = dataCenterRowArr[index];

            let length = elementArray.length;
            key = (length===1) ? elementArray[0][0].match(/\((.*)\)/)[1].replace(/\s/g, '') :key;
            if (!(key in workloads)) {
                workloads[key] = [];
                count = 0;
            }

            if(count>1 && length>1){
                workloads[key].push({
                    "Workloads":elementArray[0][0],
                    "TAM Awarded":elementArray[1][0],
                    "Dock Date (MCIO)":elementArray[2][0],
                    "RTEG Date (MCIO)":elementArray[3][0],
                    "Notes":elementArray[4][0],
                    "Calendar Months/Days to Deploy":elementArray[5][0],
                    "Engineering Readiness":elementArray[6][0]
                });  
            }
            count++
        }
        //console.log("getDCWorkLoads key==>",workloads);
        return {workloads};
    };

    getDataCenterObject(dataCenterRowArr,dataCenterArray,countryName,TimeLine){
        let temp = [];
        let {workloads} = this.getDCWorkLoads(dataCenterRowArr);
        //console.log("TimeLine==>",TimeLine)
        for (const arr of dataCenterArray) {
            let dObj = JSON.parse(JSON.stringify(DataCenterDetailsObject));
            dObj.PartionKey = countryName;
            dObj.RowKey = arr.dcCode;
            dObj.DataCenterName = arr.name
            dObj.DataCenterStatus = statusArray[Math.floor(Math.random() * statusArray.length)];
            dObj.TimeLine = JSON.stringify(TimeLine[countryName]);
            dObj.WorkLoads = JSON.stringify(workloads[arr.dcCode]);
            temp.push(dObj);
        }
        //console.log("getDataCenterObject 2==>",temp);
        return temp;
    }
    async addRoadMapObject(body){
        //console.log("addRoadMapObject==>",JSON.stringify(body))
        try {
            let requestUrl = `api/CountryRoadMap`;
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json"},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            console.log("response===>",response)
        } catch (error) {
            return null
        } 
    };

    async addCountryObject(body){
        //console.log("addCountryObject==>",JSON.stringify(body))
        try {
            let requestUrl = `api/Country`;
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json"},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            console.log("response===>",response)
        } catch (error) {
            return null
        } 
    };

    async addDataCenter(body){
        //console.log("addCountryObject==>",JSON.stringify(body))
        try {
            let requestUrl = `api/CountryDataCenters`;
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json"},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            console.log("response===>",response)
        } catch (error) {
            return null
        } 
    };

    async addWorkLoads(body){
        //console.log("addCountryObject==>",JSON.stringify(body))
        try {
            let requestUrl = `api/CountryWorkLoad`;
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json"},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            console.log("response===>",response)
        } catch (error) {
            return null
        } 
    };

    async migrateTables(url){
        try {
            let response = await fetch(url, {
                "headers":{"Accept":"application/json","Content-Type":"application/json"},
                "method": "GET"
            });
            console.log("response===>",response)
            let data = await (this.handleErrors(response)).json();
            return data;
        } catch (error) {
            return error.message
        } 
    };

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
};