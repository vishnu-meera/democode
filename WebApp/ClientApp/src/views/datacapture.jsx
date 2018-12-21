import * as React from 'react';
import FileReaderInput from 'react-file-reader-input';
import XLSX from'xlsx';
import Utils from 'utils/inputUtils';
import Auth from 'utils/auth';
import Spinner from "components/spinner/spin";
const sheet2arr = function(sheet){
    let result = [];
    let row;
    let rowNum;
    let colNum;
    let range = XLSX.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
       row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
           let nextCell = sheet[
              XLSX.utils.encode_cell({r: rowNum, c: colNum})
           ];
           if( typeof nextCell !== 'undefined' )
                row.push([nextCell.w,nextCell.s]);
        }
        if(row.length>0) result.push(row);
    }
    return result;
};


const sheet2arr_2 = function(sheet){
    let result = [];
    let col;
    let rowNum;
    let colNum;
    let range = XLSX.utils.decode_range(sheet['!ref']);
    for(colNum=range.s.c; colNum<=range.e.c; colNum++){
        col = [];
        let prevHeader;
        for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
            let prevCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: colNum-1})];
            prevHeader = typeof prevCell !== 'undefined' ? prevCell: prevHeader;
            let nextCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: colNum})];
            
            if( typeof nextCell !== 'undefined' ){
                if(typeof prevHeader !== 'undefined') col.push([nextCell.w,nextCell.s,prevHeader.w]);
                else col.push([nextCell.w,nextCell.s]);
            }
        }
        if(col.length>0) result.push(col);
    }

    return result;
};

const MigrateTableAPIs =    ["api/RuleTable/Migrate",
                            "api/Country/Migrate",
                            "api/CountryDataCenters/Migrate",
                            "api/CountryRoadMap/Migrate",
                            "api/CountryWorkLoad/Migrate"];

                            
class InputView extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.auth = new Auth();
        this.handleChange2 = this.handleChange2.bind(this);
        this.takeSnapShot = this.takeSnapShot.bind(this);
        this.state = {
            readyToview : false,
            message:""
        };
    }

    async componentDidMount() {
        let {authenticated,token} = await this.auth.isAuthenticated();
        if(authenticated){

        }else{
            console.log("dashboard===> not authenticated");
            this.props.history.push("/admin");
        }
    }
    //adding roadmap array
    async addRoadMap(CountryRoadMaps){
        //console.log("RoadMap==>",CountryRoadMaps)
        for (const CountryRoadMap of CountryRoadMaps) {
            //Adding RoadMap to azure table
            let response = await this.utils.addRoadMapObject(CountryRoadMap);
        }
        
    };

    async doCountrySpecificSheets(workbook,countrySheetArr,TimeLine,CountriesExcelObj){

        let countryOject,workloadObject,datacnterObject,dataCenterArray
        let specific = countrySheetArr.find(x=>x.includes("Specific"));
        let mcio = countrySheetArr.find(x=>x.includes("MCIO"));
        let wrkld = countrySheetArr.find(x=>x.includes("Wrkld"));
        if(specific)
            [countryOject,dataCenterArray] = await this.utils.getCountryObject(sheet2arr_2(workbook.Sheets[specific]),CountriesExcelObj);

        if(wrkld && dataCenterArray){
            if(dataCenterArray.length>0){
                let workloadRowArr = sheet2arr(workbook.Sheets[wrkld]);
                let workLoadsHeader = sheet2arr_2(workbook.Sheets[wrkld])[0]
                workloadObject = this.utils.getWorkloadObject(workloadRowArr,dataCenterArray,countryOject.Name,workLoadsHeader);
                //console.log("WorkLoad ==>",workloadObject);
                for (const obj of workloadObject) {
                    //Adding Workload to azure table
                    let response = await this.utils.addWorkLoads(obj);
                }
            }  
        }

        if(mcio && dataCenterArray && TimeLine){
            if(dataCenterArray.length>0){
                let dataCenterRowArr = sheet2arr(workbook.Sheets[mcio]);
                datacnterObject = this.utils.getDataCenterObject(dataCenterRowArr,dataCenterArray,countryOject.Name,TimeLine);
                //console.log("Datacenter ==>",datacnterObject);
                for (const obj of datacnterObject) {
                    //Adding Datacenter to azure table
                    let response = await this.utils.addDataCenter(obj);
                }
            }
        }

        //console.log("Country===>",countryOject)
        //Adding Country to azure table
        if(countryOject){
            let response = await this.utils.addCountryObject(countryOject);
        }

        await this.setState({readyToview:false,message:"Excel sheets loaded into table storage"});
    };

    handleChange2  = async (e, results) => {
        let self = this;
        await this.setState({readyToview:true});

        if(results[0][1]["name"].split(".")[1] !== "xlsx")
            return "not an xlsx file";

        results.forEach(result => {
            const [e, file] = result;
            let workbook = XLSX.read(e.target.result, {
                type: 'binary',
                cellStyles:true
            });

            let roadmapSheet = workbook.Sheets['Roadmap']
            let roadMapArr = sheet2arr(roadmapSheet);
            let {CountryRoadMaps,TimeLine} = this.utils.getRoadMapObject(roadMapArr);
            this.addRoadMap(CountryRoadMaps);

            let countries = workbook.Sheets['Countries'];
            let countriesExcelSheet = sheet2arr(countries);
            //console.log("countriesExcelSheet==>",countriesExcelSheet);
            let {CountriesExcelObj} = this.utils.getCountriesExcelObj(countriesExcelSheet);

            let sheetMap = {};
            workbook.SheetNames.forEach(function(sheetName) {
                if(sheetName!=="Roadmap") {
                    //console.log("sheetName==>",sheetName)
                    let sheetNamePOSTFix = sheetName.split("_")[0];
                    if(!(sheetNamePOSTFix in sheetMap))
                        sheetMap[sheetNamePOSTFix] = [];
                    sheetMap[sheetNamePOSTFix].push(sheetName);
                    //self.doCountrySpecificSheets(workbook,sheetName);
                }
            });

            Object.keys(sheetMap).forEach(key=>{
                //console.log("sheetMap[key]==>",sheetMap[key])
                self.doCountrySpecificSheets(workbook,sheetMap[key],TimeLine,CountriesExcelObj);
            });
        });
    };
      

    takeSnapShot = async()=>{
        await this.setState({readyToview:true});

        for (const url of MigrateTableAPIs) {
            let response = await this.utils.migrateTables(url);
            console.log("takeSnapShot==>",response);
        }
        console.log("takeSnapShot==>finished");
        await this.setState({readyToview:false,message:"Successfully took the snapshot of table storage."});
    };
    
    render() {
        return (<div className="content">
                    <div className="row">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="card card-signin my-5">
                                <div className="card-body">
                                    <div className="custom-file">
                                        <label className="custom-file-label" htmlFor="my-file-input">Choose Excel file</label>
                                        <FileReaderInput 
                                            as="binary" 
                                            id="my-file-input" onChange={this.handleChange2} 
                                            disabled={this.state.readyToview}
                                            accept=".xlsx">
                                        </FileReaderInput>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary btn-md btn-block"
                                        onClick = {this.takeSnapShot}
                                        disabled={this.state.readyToview}
                                    >
                                            Take SnapShot of Table Storage
                                    </button>
                                    <hr className="my-4" />
                                    {
                                        (this.state.readyToview)?
                                        <div className="alert alert-light" role="alert">
                                            {Spinner.call(this)}
                                        </div>:null
                                    }
                                    {(this.state.message)?
                                        <div>
                                            <span className="text-success">{this.state.message}!!</span>
                                        </div>:null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>);
    }
}


  export default InputView;