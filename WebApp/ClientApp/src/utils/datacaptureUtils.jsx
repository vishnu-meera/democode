
import Utils from './utils';
import Auth from 'utils/authhelper';
import {enableLogging} from 'utils/config';
const convert = require('color-convert');

let roadmapsummaryObjKeys = {    
    1:"Public Announcement",
    2:"CAPEX Approved",
    3:"Lease Signed",
    4:"TAM Award",
    5:"WhiteSpace Ready",
    6:"Colo Ready",
    7:"Dock Date",
    8:"RTEG Network",
    9:"RTEG Server",
    //10:"RTEG",
    //11:"Preview",
    //12:"O365 Services",
    10:"GA",
    11:"Engineering Readiness", 
    12:"GA"
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

const getRMCellObject = (roadMapCell,flag="")=>{

    let temp = {};
    temp["actualdate"]="no data";
    temp["planneddate"]="no data";
    temp["startdate"]="no data";
    temp["Status"] = "" ;

    if(!Array.isArray(roadMapCell)){ 
        return temp;
    }

    let values = roadMapCell[0].split("\n");
    if(flag.length>0) return values[0]; 

    try {
        if(Array.isArray(values)){
            //values = validateDateArray(values);
            temp["actualdate"]=values.length>1?values[1]:values[0].replace(/[\r\n]/g, "");
            temp["planneddate"]=values[0].replace(/[\r\n]/g, "");
            temp["startdate"]=values[0].replace(/[\r\n]/g, "");
            temp["Status"] = "" ;
        }else if(typeof values ==="string"){

        }else
            throw new Error("Roadmap sheet: Excel contains wrong values")

    } catch (error) {
        throw new Error(error.message)
    }
    return temp;
};

const showtimelinedate = (date)=>{
    let inputData = date.replace(/\s/g, '');
    if(inputData.includes("**"))
        return true;
    else
        return false;
};

const getTimeLineCellObject = (name,roadMapCell)=>{
    let temp = {
        "Name":name,
        "Actual Date":"no data",
        "Planned Date":"no data",
        "Risk Level":"no data",
        "Notes":{"note1":"Notes not aviable now"},
        "ShowTimeLineDate":false,
        "rgb":"none"
    };

    try {

        if(!Array.isArray(roadMapCell)){ 
            return temp;
        }

        let values = roadMapCell[0].split("\n");
        let rgb = "none";


        if("fgColor" in roadMapCell[1]){
            if("rgb" in roadMapCell[1]["fgColor"]){
                rgb = roadMapCell[1]["fgColor"]["rgb"];
                rgb = convert.hex.keyword(rgb)
            }
        }
       
        temp = {
            "Name":name,
            "Actual Date":(values.length>1?values[1]:values[0].replace(/[\r\n]/g, "")),
            "Planned Date":(values[0].replace(/[\r\n]/g, "")),
            "Risk Level":"",
            "Notes":{"note1":"Notes not aviable now"},
            "ShowTimeLineDate":showtimelinedate(values.length>1?values[1]:values[0].replace(/[\r\n]/g, "")),
            "rgb":rgb
        };

        return temp;

    } catch (error) {
        //return temp;
        throw new Error(error.message);
    }

};
export default class DataCapturingUtils {
    constructor(){
        this.auth = new Auth();
    };
    utils = new Utils();


    log = (modulename,message,object)=>{
        if(enableLogging){
            if(object)
                console.log(`${modulename} file : ${message}`, object);
            else
                console.log(`${modulename} file : ${message}`);
        }
    };

    getRoadMapObject(roapMapExcelRows){
       
        this.log("datacapture","getRoadMapObject method enter");

        const roadmapsummarykeys = ['Infrastructure','Azure','Office'];
        const keysNotInTimeLine = ["RTEG","Public Announcement","Preview"];

        let RoadMapSummary = {"Infrastructure":{},"Azure":{},"Office":{}};
        let TimeLine ={};
        let CountryRoadMaps = [];

        try {
  
            roapMapExcelRows[2].forEach((element,key)=>{
                if(key>=0 && key<9) RoadMapSummary[roadmapsummarykeys[0]][element[0]] = {};
                else if(key === 9) RoadMapSummary[roadmapsummarykeys[1]][element[0]] = {};
                else if(key>9) RoadMapSummary[roadmapsummarykeys[2]][element[0]] = {}; 
            });

            for (let index = 3; index < roapMapExcelRows.length; index++) {
                const countryRow = roapMapExcelRows[index];
                if(countryRow.length >1){
                    if(!(countryRow[0][0] in TimeLine)) TimeLine[countryRow[0][0]]=[];
                    
                    for (let index = 1; index <= Object.keys(roadmapsummaryObjKeys).length; index++) {
                        
                        let objIndex = (index>=1 && index<10) ? 0 : (index===10) ? 1 : 2;
                        let key = roadmapsummarykeys[objIndex];
                        
                        if(roadmapsummaryObjKeys[index].includes("Preview") || roadmapsummaryObjKeys[index].includes("Public Announcement"))
                            RoadMapSummary[key][roadmapsummaryObjKeys[index]] = getRMCellObject(countryRow[index],"YES")
                        else    
                            RoadMapSummary[key][roadmapsummaryObjKeys[index]] = getRMCellObject(countryRow[index]);   
                            
                        if(!keysNotInTimeLine.includes(roadmapsummaryObjKeys[index]))  {
                            let timeLineIndex = roadmapsummaryObjKeys[index];
                            if(timeLineIndex==="GA")timeLineIndex = key + " " + timeLineIndex;
                            if("O365 Services"===timeLineIndex)timeLineIndex="O365 deployment";
                            if("Engineering Readiness"===timeLineIndex)timeLineIndex="O365 readiness";
    
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
            }
            
        } catch (error) {
            this.log("datacapture","getRoadMapObject method error", error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getRoadMapObject method exit");
        return {CountryRoadMaps,TimeLine};
    };

    getCountriesExcelObj(cntryArray){
        this.log("datacapture","getCountriesExcelObj method enter");
        let CountriesExcelObj = {};
        try {
            for (let index = 1; index < cntryArray.length; index++) {
                const element = cntryArray[index];

                CountriesExcelObj[element[0][0]] =  {
                    "Status" : element[1][0],
                    "Revenue Projection 3Y" : (element[2][0]),
                    "Revenue Projection 5Y" : (element[3][0]),
                    "TAM Restricted" : (element[4][0]),
                    "TAM Unrestricted" : (element[5][0])
                };
            }

        } catch (error) {
            this.log("datacapture","getCountriesExcelObj method error", error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getCountriesExcelObj method exit");
        return {CountriesExcelObj};
    };

    async getCountryObject(cntryArray,countryExcelObject){
        this.log("datacapture","getCountriesExcelObj method enter");
        let dataCenterArray = [];
        let countryObject = JSON.parse(JSON.stringify(CountryObject));
        try {
            countryObject.Name = cntryArray[0][0][0];
            countryObject.RowKey = cntryArray[0][0][0];

            try {
                if(countryObject.Name in countryExcelObject){
                    countryObject.Status =  (countryExcelObject[countryObject.Name]["Status"]);
                    countryObject.RevenueProjection3Y =  (countryExcelObject[countryObject.Name]["Revenue Projection 3Y"]);
                    countryObject.RevenueProjection5Y =  (countryExcelObject[countryObject.Name]["Revenue Projection 5Y"]);
                    countryObject.TAM_Restricted =  (countryExcelObject[countryObject.Name]["TAM Restricted"]);
                    countryObject.TAM_UNRestricted =  (countryExcelObject[countryObject.Name]["TAM Unrestricted"]);
                }
            } catch (error) {
                this.log("datacapture","getCountryObject method error", error.message);
            }

            try {
                countryObject.AzureStatus = cntryArray[2].filter(y=>y[2]==="Azure Status")[0][0];
                countryObject.CAPEX = cntryArray[2].filter(y=>y[2]==="CAPEX")[0][0];
            } catch (error) {
                this.log("datacapture","getCountryObject method error", error.message);
            }

            let {Population,Gdp} = await this.utils.getPopulationAndGdpByName(countryObject.Name);
            countryObject.Population = Math.trunc(Population/1000000)===0 ? Population :  Math.trunc(Population/1000000) + " million";
            countryObject.GDP = Math.trunc(Gdp/1000000000) + " billion USD";

            for (const arr of cntryArray[2].filter(y=>y[2]==="Lease Signed")) {
                let dataCenterObject = JSON.parse(JSON.stringify(DataCenterObject));

                dataCenterObject.dcCode = arr[0].toLowerCase().replace(/\s/g, '');
                dataCenterObject.name =  arr[0];
                dataCenterObject.coloName =  arr[0];
                dataCenterObject.leaseName =  arr[0];

                try {
                    cntryArray[2].filter(y=>y[2]==="DC Vendors").forEach(arr=>{
                        if(arr[0].includes(":")){
                            //if(dataCenterObject.dcCode.includes(arr[0].includes(":")[0].toLowerCase()))
                                dataCenterObject.dcVendors.push(arr[0].split(':')[1])
                        }else{
                            dataCenterObject.dcVendors.push(arr[0])
                        }
                    });
                } catch (error) {
                    this.log("datacapture","getCountryObject method error", error.message);
                }

                dataCenterObject.telcoVendors = cntryArray[2].filter(y=>y[2]==="Telco vendor").map(x=>x[0]);
                dataCenterObject.coloready =  cntryArray[3].filter(y=>dataCenterObject.coloName.includes(y[2]))[0][0];
                dataCenterObject.leaseSigned = cntryArray[3].filter(y=>dataCenterObject.leaseName.includes(y[2]))[0][0];

                dataCenterArray.push(dataCenterObject);

            }
            countryObject.DataCenters = JSON.stringify(dataCenterArray);
        } catch (error) {
            this.log("datacapture","getCountryObject method error", error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getCountryObject method exit");
        return [countryObject,dataCenterArray];
    };

    getPhasesObject(workloadarray){
        this.log("datacapture","getPhasesObject method enter");
        let phasesObject = {}, key ;

        try {
            for (let index = 1; index < workloadarray.length; index++) {
                const elementArray = workloadarray[index];
    
                let length = elementArray.length;
                //the value of 10 will change according to schema change
                key = (length===10) ? elementArray[0][0] :key;
                if (!(key in phasesObject)) phasesObject[key] = [];
    
                phasesObject[key].push({
                    "Phase"				:length===10? elementArray[1][0]:elementArray[0][0],
                    "Planned Start"		:(length===10? elementArray[2][0]:elementArray[1][0]),
                    "Planned Finish"	:(length===10? elementArray[3][0]:elementArray[2][0]),
                    "Planned Duration"	:length===10? elementArray[4][0]:elementArray[3][0],
                    "Revised Start"		:(length===10? elementArray[5][0]:elementArray[4][0]),
                    "Revised Finish"	:(length===10? elementArray[6][0]:elementArray[5][0]),
                    "Revised Duration"	:length===10? elementArray[7][0]:elementArray[6][0],
                    "Status"			:length===10? elementArray[8][0]:elementArray[7][0],
                    "Remarks"			:length===10? elementArray[9][0]:elementArray[8][0]
                });
                
            }

        } catch (error) {
            this.log("datacapture","getCountryObject method error", error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getPhasesObject method exit");
        return {phasesObject}
    };

    getWorkloadObject(workloadarray,datacenterarray,countryName,workLoadsHeader){
        this.log("datacapture","getWorkloadObject method enter");
        let cntryName = countryName.replace(/\s/g, '');
        let temp = [];
        try {
            let {phasesObject} = this.getPhasesObject(workloadarray);
            for (const datacenter of datacenterarray) {
                for (let index = 1; index < workLoadsHeader.length; index++) {
                    const element = workLoadsHeader[index];
                    let workLoadObject = JSON.parse(JSON.stringify(WorkLoadObject));
                    workLoadObject.Key = `${cntryName}_${datacenter.dcCode}`;
                    workLoadObject.DataCenterId = `${datacenter.dcCode}`;
                    workLoadObject.DataCenterName = datacenter.name;
                    workLoadObject.WorkLoadStatus = ""//TODO: calculate later;
                    workLoadObject.WorkLoadName = element[0];
                    workLoadObject.Phases = JSON.stringify(phasesObject[element[0]]);
                    temp.push(workLoadObject);
                }
            };

        } catch (error) {
            this.log("datacapture","getWorkloadObject method error",error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getWorkloadObject method exit");
        return temp;
    };


    getDCWorkLoads(dataCenterRowArr){
        this.log("datacapture","getDCWorkLoads method enter");
        let workloads = {}, key ,count=0;
      
        try {
            for (let index = 0; index < dataCenterRowArr.length; index++) {
                const elementArray = dataCenterRowArr[index];
    
                let length = elementArray.length;
                // if(elementArray[0][0].includes("(") && elementArray[0][0].includes(")")){
                //     key = (length===1) ? elementArray[0][0].match(/\((.*)\)/)[1] :key;
                // }else{
                //     key = (length===1) ? elementArray[0][0] :key;
                // }
                key = (length===1) ? elementArray[0][0] :key;
                key = key.toLowerCase().replace(/\s/g, '');

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
        } catch (error) {
            this.log("datacapture","getDCWorkLoads method error", error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getDCWorkLoads method exit");
        return {workloads};
    };

    getDataCenterObject(dataCenterRowArr,dataCenterArray,countryName,TimeLine){
        this.log("datacapture","getDataCenterObject method enter");
        let temp = [];
        try {
            let {workloads} = this.getDCWorkLoads(dataCenterRowArr);
            for (const arr of dataCenterArray) {
                let dcCode = arr.dcCode;
                dcCode = dcCode.replace(/\s/g, '').toLowerCase();
                this.log("datacapture","getDataCenterObject method enter",dcCode);
                let dObj = JSON.parse(JSON.stringify(DataCenterDetailsObject));
                dObj.PartionKey = countryName;
                dObj.RowKey = dcCode;
                dObj.DataCenterName = arr.name
                dObj.DataCenterStatus = ""//TODO;
                dObj.TimeLine = JSON.stringify(TimeLine[countryName]);
                let workloadsStr = JSON.stringify(workloads[dcCode]);
                this.log("datacapture","getDataCenterObject method enter",workloadsStr);
                if(!workloadsStr){
                    dcCode = Object.keys(workloads).find(x=>dcCode.includes(x));
                    if(dcCode) workloadsStr = JSON.stringify(workloads[dcCode]);
                }
                dObj.WorkLoads = workloadsStr;
                temp.push(dObj);
            }
      
        } catch (error) {
            this.log("datacapture","getDataCenterObject method error",error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getDataCenterObject method exit");
        return temp;
    };

    getMoveStatusObject(moveStatusArr,countryName){
        this.log("datacapture","getMoveStatusObject method enter");
        let moveStatusObject = {};
        try {
            moveStatusObject["PartitionKey"] = "Countries"
            moveStatusObject["RowKey"] = countryName;
            let temp = {}, temp1 ={};
    
            for (let index = 1; index < moveStatusArr.length; index++) {
                const element = moveStatusArr[index];
    
                temp[element[0][0]] = [];
                temp[element[0][0]].push(`Move Deadline  : ${element[1][0]}`);
                temp[element[0][0]].push(`Internal Target Deadline  : ${element[2][0]}`);
                temp[element[0][0]].push(`Enrolled Tenants  : ${element[3][0]}`);
                temp[element[0][0]].push(`Enrolled Tenant Competetion  : ${element[4][0]}`);
                temp[element[0][0]].push(`Migration From Regional To Local  : ${element[5][0]}`);
                temp[element[0][0]].push(`Capacity Distribution GoLocal vs Regional  : ${element[6][0]}`);
                temp[element[0][0]].push(`Move Status Percentage  : ${element[7][0]}`);
    
                temp1[element[0][0]] = element[7][0];

            }

            moveStatusObject["moveStatusItems"] = JSON.stringify(temp);
            moveStatusObject["moveStatusPercentageObj"] = JSON.stringify(temp1);
        } catch (error) {
            this.log("datacapture","getMoveStatusObject method error",error.message);
            throw new Error(error.message);
        }
        this.log("datacapture","getMoveStatusObject method exit");
        return moveStatusObject;
    };

    async addRoadMapObject(body){
        this.log("datacapture","addRoadMapObject method enter");
        try {
            let requestUrl = `api/CountryRoadMap`;
            let apiToken = await this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json",'authorization': 'Bearer ' + apiToken},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            this.log("datacapture","addRoadMapObject method exit",response);
        } catch (error) {
            this.log("datacapture","addRoadMapObject method error",error.message);
            throw new Error(error.message);
        } 
    };

    async addCountryObject(body){
        this.log("datacapture","addCountryObject method enter");
        try {
            let requestUrl = `api/Country`;
            let apiToken = await this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json",'authorization': 'Bearer ' + apiToken},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            this.log("datacapture","addCountryObject method exit",response);
        } catch (error) {
            this.log("datacapture","addCountryObject method error",error.message);
            throw new Error(error.message);
        } 
    };

    async addDataCenter(body){
        this.log("datacapture","addDataCenter method enter");
        try {
            let requestUrl = `api/CountryDataCenters`;
            let apiToken = await this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json",'authorization': 'Bearer ' + apiToken},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            this.log("datacapture","addDataCenter method exit",response);
        } catch (error) {
            this.log("datacapture","addDataCenter method error",error.message);
            throw new Error(error.message);
        } 
    };

    async addWorkLoads(body){
        this.log("datacapture","addWorkLoads method enter");
        try {
            let requestUrl = `api/CountryWorkLoad`;
            let apiToken = await this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json",'authorization': 'Bearer ' + apiToken},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            this.log("datacapture","addWorkLoads method exit",response);
        } catch (error) {
            this.log("datacapture","addDataCenter method error",error.message);
        } 
    };

    async addMoveStatus(body){
        this.log("datacapture","addMoveStatus method enter");
        try {
            let requestUrl = `api/MoveStatus`;
            let apiToken = await this.auth.getWebApiToken();
            let response = await fetch(requestUrl, {
                "headers":{"Content-Type":"application/json",'authorization': 'Bearer ' + apiToken},
                "method": "POST",
                "body":JSON.stringify(body)
            });
            this.log("datacapture","addMoveStatus method exit", response);
        } catch (error) {
            this.log("datacapture","addMoveStatus method error", error.message);
            throw new Error(error.message);
        } 
    };

    async migrateTables(url){
        this.log("datacapture","migrateTables method enter");
        try {
            let apiToken = await this.auth.getWebApiToken();
            let response = await fetch(url, {
                "headers":{"Accept":"application/json","Content-Type":"application/json",'authorization': 'Bearer ' + apiToken},
                "method": "GET",
            });
            this.log("datacapture","migrateTables method exit", response);
            let data = await (this.handleErrors(response)).json();
            return data;
        } catch (error) {
            this.log("datacapture","migrateTables method error", error.message);
            throw new Error(error.message);
        } 
    };

    handleErrors(response) {
        this.log("datacapture","handleErrors method enter",response);
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