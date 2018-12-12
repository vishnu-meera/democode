
import Utils from './utils';

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
}

const WorkLoadObject = {
    "Key": "",
    "WorkLoadName": "",
    "DataCenterId": "",
    "DataCenterName": "",
    "Phases": "",
    "WorkLoadStatus": ""
}

const PhaseObject = {
    "Phase":"N/A",
    "Planned Start":"N/A",
    "Planned Finish":"N/A",
    "Planned Duration":"N/A",
    "Revised Start":"N/A",
    "Revised Finish":"N/A",
    "Revised Duration":"N/A",
    "Status":"N/A",
    "Remarks":"N/A"
}

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

export default class DataCapturingUtils {

    utils = new Utils();

    getRoadMapObject(roapMapExcelRows){
        const roadmapsummarykeys = ['Infrastructure','Azure','Office'];
        let RoadMapSummary = {"Infrastructure":{},"Azure":{},"Office":{}};
        let temp = [];
        //first three arrays should have , 2,4,14 otherwise throw error
        //Headers
        roapMapExcelRows[2].forEach((element,key)=>{
            if(key>=0 && key<8) RoadMapSummary[roadmapsummarykeys[0]][element[0]] = {};
            else if(key>7 && key<12) RoadMapSummary[roadmapsummarykeys[1]][element[0]] = {};
            else if(key>11) RoadMapSummary[roadmapsummarykeys[2]][element[0]] = {}; 
        });

        for (let index = 3; index < roapMapExcelRows.length; index++) {
            const countryRow = roapMapExcelRows[index];
            for (let index = 1; index < countryRow.length; index++) {
                
                let objIndex = (index>=1 && index<8) ? 0 : (index>=8 && index<13) ? 1 : 2;
                let key = roadmapsummarykeys[objIndex];
                if(roadmapsummaryObjKeys[index]==="Preview" || roadmapsummaryObjKeys[index]==="Public Announcement")
                    RoadMapSummary[key][roadmapsummaryObjKeys[index]] = getRMCellObject(countryRow[index],"YES")
                else    
                    RoadMapSummary[key][roadmapsummaryObjKeys[index]] = getRMCellObject(countryRow[index]);    
            }

            temp.push({
                "PartitionKey": "Countries",
                "RowKey": countryRow[0][0],
                "Status":"Live",
                "RoadMapObject":JSON.stringify(RoadMapSummary)
            });
        }

        //console.log("RoadMapSummary==>",roapMapExcelRows,RoadMapSummary);
        return temp;
    };

    async getCountryObject(cntryArray){
        //console.log("cntryArray===>",cntryArray)
        let countryObject = JSON.parse(JSON.stringify(CountryObject));
        countryObject.Name = cntryArray[0][0][0];
        countryObject.RowKey = cntryArray[0][0][0];
        countryObject.Status = statusArray[Math.floor(Math.random() * statusArray.length)];
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
        //console.log("countryObject==>",countryObject);
        return [countryObject,dataCenterArray];
    };

    getPhasesObject(workloadarray){
        let phasesObject = {}, key ;

        for (let index = 1; index < workloadarray.length; index++) {
            const elementArray = workloadarray[index];

            let length = elementArray.length;
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
                workLoadObject.Phase = JSON.stringify(phasesObject[element[0]]);
                temp.push(workLoadObject);
            }
        }
        //console.log("getWorkLoadPhaseseObject 1==>",workloadarray);
        //console.log("getWorkLoadPhaseseObject 2==>",temp);
        return temp;
    };

    async addRoadMapObject(body){
        console.log("addRoadMapObject==>",JSON.stringify(body))
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
        console.log("addCountryObject==>",JSON.stringify(body))
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
};