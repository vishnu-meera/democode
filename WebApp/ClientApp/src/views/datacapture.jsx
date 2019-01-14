import * as React from 'react';
import FileReaderInput from 'react-file-reader-input';
import XLSX from'xlsx';
import Utils from 'utils/inputUtils';
import Auth from 'utils/authhelper';
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
                            "api/CountryWorkLoad/Migrate",
                            "api/MoveStatus/Migrate"];

                            
class InputView extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.auth = new Auth();
        this.handleChange2 = this.handleChange2.bind(this);
        this.takeSnapShot = this.takeSnapShot.bind(this);
        this.state = {
            readyToview : false,
            message:"",
            textCss:"text-success",
            token:null
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async componentDidMount() {
        let {authenticated,token} = await this.auth.isAuthenticated();
        if(authenticated){
            await this.setState({token})
        }else{
            console.log("dashboard===> not authenticated");
            this.props.history.push("/admin");
        }
    }
    //adding roadmap array
    async addRoadMap(CountryRoadMaps){
        try {
        //console.log("RoadMap==>",CountryRoadMaps)
        for (const CountryRoadMap of CountryRoadMaps) {
            //Adding RoadMap to azure table
            let response = await this.utils.addRoadMapObject(CountryRoadMap);
        }
        } catch (error) {
            await this.setState({message:error.message,textCss:"text-danger"});
            await this.delay(3000);
            await this.setState({message:"",textCss:"text-success",readyToview:false});
        }
        
    };

    async doCountrySpecificSheets(workbook,countrySheetArr,TimeLine,CountriesExcelObj,countryName){

        try {
            let countryOject,workloadObject,datacnterObject,dataCenterArray
            let specific = countrySheetArr.find(x=>x.includes("Specific"));
            let mcio = countrySheetArr.find(x=>x.includes("MCIO"));
            let wrkld = countrySheetArr.find(x=>x.includes("Wrkld"));
            let moveStatus = countrySheetArr.find(x=>x.includes("MoveStatus"));
    
            if(specific)
                [countryOject,dataCenterArray] = await this.utils.getCountryObject(sheet2arr_2(workbook.Sheets[specific]),CountriesExcelObj);
    
            if(wrkld && dataCenterArray){
                if(dataCenterArray.length>0){
                    let workloadRowArr = sheet2arr(workbook.Sheets[wrkld]);
                    let workLoadsHeader = sheet2arr_2(workbook.Sheets[wrkld])[0]
                    workloadObject = this.utils.getWorkloadObject(workloadRowArr,dataCenterArray,countryName,workLoadsHeader);
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
                    console.log("TimeLineObj===>", TimeLine,countryName);
                    datacnterObject = this.utils.getDataCenterObject(dataCenterRowArr,dataCenterArray,countryName,TimeLine);
                    console.log("Datacenter ==>",datacnterObject);
                    for (const obj of datacnterObject) {
                        //Adding Datacenter to azure table
                        let response = await this.utils.addDataCenter(obj);
                    }
                }
            }
    
            if(moveStatus && countryName){
                let moveStatusRowArr = sheet2arr_2(workbook.Sheets[moveStatus]);
                let moveStatusObject = this.utils.getMoveStatusObject(moveStatusRowArr,countryName);
                //console.log("sheetname==>",moveStatusObject);
                //Adding MoveStatus to azure table
                let response = await this.utils.addMoveStatus(moveStatusObject);
            };
    
            //console.log("Country===>",countryOject)
            //Adding Country to azure table
            if(countryOject){
                let response = await this.utils.addCountryObject(countryOject);
            }

        } catch (error) {
            await this.setState({message:error.message,textCss:"text-danger"});
            await this.delay(3000);
            await this.setState({message:"",textCss:"text-success",readyToview:false});
        }
    };

    handleChange2  = async (e, results) => {
        let self = this;
        await this.setState({readyToview:true});

        try {
            if(results[0][1]["name"].split(".")[1] !== "xlsx")
                throw new Error ("not an xlsx file");
        } catch (error) {
            await this.setState({message:error.message,textCss:"text-danger"});
            await this.delay(3000);
            await this.setState({message:"",textCss:"text-success",readyToview:false});
            return;
        }

        try {
            for (const result of results) {
                const [e, file] = result;
                let workbook = XLSX.read(e.target.result, {
                    type: 'binary',
                    cellStyles:true
                });
    
                let roadmapSheet = workbook.Sheets['Roadmap']
                let roadMapArr = sheet2arr(roadmapSheet);
                let {CountryRoadMaps,TimeLine} = this.utils.getRoadMapObject(roadMapArr);
                let temp = await this.addRoadMap(CountryRoadMaps);
    
                let countries = workbook.Sheets['Countries'];
                let countriesExcelSheet = sheet2arr(countries);
                //console.log("countriesExcelSheet==>",countriesExcelSheet);
                let {CountriesExcelObj} = this.utils.getCountriesExcelObj(countriesExcelSheet);
    
                let sheetMap = {};
                for (const sheetName of workbook.SheetNames) {
                    if(sheetName!=="Roadmap") {
                        //console.log("sheetName==>",sheetName)
                        let sheetNamePOSTFix = sheetName.split("_")[0];
                        if(!(sheetNamePOSTFix in sheetMap))
                            sheetMap[sheetNamePOSTFix] = [];
                        sheetMap[sheetNamePOSTFix].push(sheetName);
                        //self.doCountrySpecificSheets(workbook,sheetName);
                    }
                };
    
                for (const key of Object.keys(sheetMap)) {
                    //console.log("sheetMap[key]==>",sheetMap[key],key)
                    let temp = await self.doCountrySpecificSheets(workbook,sheetMap[key],TimeLine,CountriesExcelObj,key);
                };

                await this.setState({readyToview:false,message:"Excel sheets loaded into table storage"});
            };
        } catch (error) {
            await this.setState({message:error.message,textCss:"text-danger"});
            await this.delay(3000);
            await this.setState({message:"",textCss:"text-success",readyToview:false});
            return;
        }
    };
      

    takeSnapShot = async()=>{
        await this.setState({readyToview:true});

        for (const url of MigrateTableAPIs) {
            try {
                let response = await this.utils.migrateTables(url);
            } catch (error) {
                await this.setState({message:error.message,textCss:"text-danger"});
                await this.delay(1000);
            }

        }
        //console.log("takeSnapShot==>finished");
        await this.setState({readyToview:false,message:"Successfully took the snapshot of table storage."});
    };
    
    render() {
        return (<div className="content">
                    <div className="row">
                        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                            <div className="card card-signin my-4">
                                <div className="card-body">
                                    <div className="row pl-3 pr-3">
                                        <div className="text-left text-muted pb-1">Choose Excel File For Dashboard.</div>
                                        <div className="custom-file">
                                            <label className="custom-file-label" htmlFor="my-file-input">Choose Excel file to load...</label>
                                            <FileReaderInput 
                                                as="binary" 
                                                id="my-file-input" onChange={this.handleChange2} 
                                                disabled={this.state.readyToview}
                                                accept=".xlsx">
                                            </FileReaderInput>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="row pl-3 pr-3">
                                        <div className="text-left text-muted">You can take backup of table storage using below button.</div>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary btn-md btn-block"
                                            onClick = {this.takeSnapShot}
                                            disabled={this.state.readyToview}
                                        >
                                                Take DB snaphot
                                        </button>
                                    </div>
                                    
                                    {
                                        (this.state.readyToview)?
                                        <div className="alert alert-light" role="alert">
                                            {Spinner.call(this)}
                                        </div>:null
                                    }
                                    {(this.state.message)?
                                        <div>
                                            <span className={this.state.textCss}>{this.state.message}!!</span>
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