/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import { FaArrowUp } from 'react-icons/fa';
import {
    Card,
    CardHeader,
    CardBody
} from "reactstrap";

import MoveStatusTable from "components/countryView/moveStatusTable";
import WorkLoadTable from "components/countryView/workloadsTable";
import PopoverItem from "components/countryView/popoverItem"

export default class DataCenterView extends React.Component {

    constructor(props){
        super(props);
        this.utils = new Utils();
        this.state = {
            status:this.props.status,
            loading:true,
            value : 0,
            previous: 0,
            dataCenterTimeLineObj:this.props.dataCenterTimeLineObj,
            workloadobject:{}
        };
    }

    checkEmptyObject = (obj)=>{
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }

    async componentDidUpdate(prevProps) {
        if (this.props.dataCenterTimeLineObj !== prevProps.dataCenterTimeLineObj) {
            let status =this.props.status;
            let dataCenterTimeLineObj = this.props.dataCenterTimeLineObj;
            await this.setState({status,dataCenterTimeLineObj});
        }
        if (this.props.workloadobject !== prevProps.workloadobject) {
            await this.setState({workloadobject:this.props.workloadobject});
        }
    }

    timeline = ()=>{
        let rules = this.props.ruleTable.ruleTable;
        const timeLine = JSON.parse(this.state.dataCenterTimeLineObj.timeLine);
        let length = timeLine.length;
        let lastelementcss = false;
        const timeLineArray = timeLine.map((obj,key)=>{
            if(length===key+1)
                lastelementcss = true;
            console.log("timeline===>",obj)
            let rule = rules.filter(x=>x.ruleName===obj.Name.replace(/\s/g,'').toLocaleLowerCase())[0];
            console.log("timeline===>",rule)
            return (<PopoverItem 
                            key={key} 
                            id={key} 
                            keyprop={key} 
                            obj={obj} 
                            rules = {rule?JSON.parse(rule.impact):null} 
                            lastelementcss={lastelementcss}
                            notshowbottombox={false}/>);   
              
        });

        return timeLineArray;
    }

            
    timeLineArrow = () =>{
        const timeLine = JSON.parse(this.state.dataCenterTimeLineObj.timeLine);
        const timelineArrowArr = timeLine.map((obj,key)=>{
            let color = (obj.rgb === "none"?"grey":obj.rgb);
            return (<div className="col-sm-1" key={key}>
                        <div className="col"><FaArrowUp size={23} color={color}/></div>
                        <div className="row">{obj["Actual Date"]}</div>
                    </div>);    
        });

        return timelineArrowArr;
    };

    _renderTimeLineAndPopOver(){
        return(<div className="row">
            <div className="col-sm-12">
                <Card className="stats">
                    <span className="text-muted font-weight-bold ml-2 mt-2">TimeLine</span>
                    <div className='htimeline ml-5'>
                        { this.timeline() }
                    </div>
                </Card>
            </div>
        </div>);
    };

    

    render(){
        let css = `col-sm-5 col-xs-6`;
        if(this.state.status === "Live"){
            return(<Card>
                <CardHeader>Move Status</CardHeader>
                <CardBody>
                    <div className="container-fluid testimonial-group">
                        <div className="row text-center"> 
                                {
                                    Object.keys(this.props.moveStatusItems).map((key)=>{
                                        return  (<div key={key} className={css}>
                                                    <MoveStatusTable workloadName={key} data={this.props.moveStatusItems[key]}/>
                                                </div>)
                                    })
                                }
                        </div>
                    </div>
                </CardBody>
            </Card>);
        }else{
            return(<>
                <div className="text-muted font-weight-bold ml-1 mt-1 mb-2">{this.state.dataCenterTimeLineObj.dataCenterName}</div>
                {this._renderTimeLineAndPopOver()}
                <WorkLoadTable tableData = {JSON.parse(this.props.dataCenterTimeLineObj.workLoads) }workloadobject = {this.props.workloadobject}/>
            </>);
        }
    }
};