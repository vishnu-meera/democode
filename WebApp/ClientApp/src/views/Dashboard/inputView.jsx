import * as React from 'react';
import FileReaderInput from 'react-file-reader-input';
import XLSX from'xlsx';
import Utils from 'utils/inputUtils';

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

class InputView extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.handleChange2 = this.handleChange2.bind(this);
    }

    //adding roadmap array
    async addRoadMap(CountryRoadMaps){
        //console.log("RoadMap==>",CountryRoadMaps)
        // for (const CountryRoadMap of CountryRoadMaps) {
        //     let response = await this.utils.addRoadMapObject(CountryRoadMap);
        // }
        
    };

    async doCountrySpecificSheets(workbook,countrySheetArr){
        let countryOject,workloadObject,datacnterObject,dataCenterArray
        let specific = countrySheetArr.find(x=>x.includes("Specific"));
        let mcio = countrySheetArr.find(x=>x.includes("MCIO"));
        let wrkld = countrySheetArr.find(x=>x.includes("Wrkld"));
        if(specific)
            [countryOject,dataCenterArray] = await this.utils.getCountryObject(sheet2arr_2(workbook.Sheets[specific]));

        if(wrkld && dataCenterArray){
            if(dataCenterArray.length>0){
                let workloadRowArr = sheet2arr(workbook.Sheets[wrkld]);
                let workLoadsHeader = sheet2arr_2(workbook.Sheets[wrkld])[0]
                workloadObject = this.utils.getWorkloadObject(workloadRowArr,dataCenterArray,countryOject.Name,workLoadsHeader);
                //console.log("WorkLoad ==>",workloadObject);
            }  
        }

        if(mcio && dataCenterArray){
            if(dataCenterArray.length>0){
                let dataCenterRowArr = sheet2arr(workbook.Sheets[mcio]);
                let dataCenterColArr = sheet2arr_2(workbook.Sheets[mcio])
                console.log("dataCenterRowArr ==>",dataCenterRowArr);
                console.log("dataCenterColArr ==>",dataCenterColArr);
            }
        }

        //console.log("Country===>",countryOject)
        //let response = await this.utils.addCountryObject(countryOject);
    };

    handleChange2  = async (e, results) => {
        let self = this;
        results.forEach(result => {
            const [e, file] = result;
            let workbook = XLSX.read(e.target.result, {
                type: 'binary',
                cellStyles:true
            });

            let roadmapSheet = workbook.Sheets['Roadmap']
            let roadMapArr = sheet2arr(roadmapSheet);
            let CountryRoadMaps = this.utils.getRoadMapObject(roadMapArr);
            this.addRoadMap(CountryRoadMaps);

            let sheetMap = {};
            workbook.SheetNames.forEach(function(sheetName) {
                if(sheetName!=="Roadmap") {
                    let sheetNamePOSTFix = sheetName.split("_")[0];
                    if(!(sheetNamePOSTFix in sheetMap))
                        sheetMap[sheetNamePOSTFix] = [];
                    sheetMap[sheetNamePOSTFix].push(sheetName);
                    //self.doCountrySpecificSheets(workbook,sheetName);
                }
            });

            Object.keys(sheetMap).forEach(key=>{
                //console.log("sheetMap[key]==>",sheetMap[key])
                self.doCountrySpecificSheets(workbook,sheetMap[key]);
            });
        });
    }
      
    render() {
        return (

            <div className="content">
                <label htmlFor="my-file-input">Select the excel</label>
                <FileReaderInput as="binary" id="my-file-input"
                                onChange={this.handleChange2}>
                <button>Select</button>
                </FileReaderInput>
          </div>
        );
    }
}


  export default InputView;