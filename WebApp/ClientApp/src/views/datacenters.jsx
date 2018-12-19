/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';

import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col
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
        const timeLine = JSON.parse(this.state.dataCenterTimeLineObj.timeLine);
        const timeLineArray = timeLine.map((obj,key)=>{
            if(obj.Name.trim() !=="Public Announcement"  && obj.Name.trim() !== "CAPEX Approved"){
                let css = `step col-sm-1 ${(key<3?"green":"none")}`; //TODO ..the logic is with respect to
                key = key -2;
                let num = key +1;
                    return (<PopoverItem key={key} id={key} keyprop={key} num={num} css={css} obj={obj} />)
            }
        });
        return timeLineArray;
    }

    _renderTimeLineAndPopOver(){
        return(<div className="row">
            <div className="col-sm-12">
                <Card className="stats">
                    <span className="text-muted font-weight-bold ml-2 mt-2">TimeLine</span>
                    <div className='htimeline'>
                        { this.timeline() }
                    </div>
                </Card>
            </div>
        </div>);
    };

    render(){
        if(this.state.status === "Live"){
            return(<div>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>Move Status</CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"SPO"}/></Col>
                                    <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"Exo"}/></Col>
                                    <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"Teams"}/></Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>);
        }else{
            return(<>
                <div className="text-muted font-weight-bold ml-1 mt-1 mb-2">{this.state.dataCenterTimeLineObj.dataCenterName}</div>
                {this._renderTimeLineAndPopOver()}
                <WorkLoadTable tableData = {JSON.parse(this.props.dataCenterTimeLineObj.workLoads) }workloadobject = {this.props.workloadobject}/>
            </>);
        }
    }
};