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
    CardTitle,
    TabContent,
    TabPane,
    Row,
    Col
} from "reactstrap";

import MoveStatusTable from "components/countryView/moveStatusTable";
import WorkLoadTable from "components/countryView/workloadsTable";

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
            hoverObject : this.checkEmptyObject(this.props.dataCenterTimeLineObj)?{}: JSON.parse(this.props.dataCenterTimeLineObj.timeLine)[0],
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
            let hoverObject = JSON.parse(this.props.dataCenterTimeLineObj.timeLine)[0];
            await this.setState({status,dataCenterTimeLineObj,hoverObject});
        }
        if (this.props.workloadobject !== prevProps.workloadobject) {
            await this.setState({workloadobject:this.props.workloadobject});
        }
    }

    async onHoverThroughTime(e,hoverObject){
        //console.log("hoverObject==>",hoverObject)
        await this.setState({hoverObject})
    }

    timeline = ()=>{
        const timeLine = JSON.parse(this.state.dataCenterTimeLineObj.timeLine);
        const timeLineArray = timeLine.map((obj,key)=>{
            console.log(obj.Name,"====",key)
            if(obj.Name.trim() !=="Public Announcement"  && obj.Name.trim() !== "CAPEX Approved"){
                let css = `step col-sm-1 ${(key<3?"green":"none")}`
                let num = key +1
                    return (<li 
                                key ={key}data-date={num.toString()} 
                                onMouseOver= {(e)=>{this.onHoverThroughTime(e,obj)}}
                                className={css}>
                                <div>{obj.Name}</div>
                            </li>)
            }
        });
        return timeLineArray;
    }
    _renderDC(){
        //console.log("HoverObject==>",this.state.hoverObject)
        
        return(<Row>
            <Col sm="12">
                <Card className="stats">
                    <CardHeader>TimeLine</CardHeader>
                    <CardBody>
                        <div className='htimeline'>
                            { this.timeline() }
                        </div>
                    </CardBody>
                    <CardBody className="card-stats border border-secondary rounded">
                        <CardTitle className="text-center">{this.state.hoverObject.Name}</CardTitle>
                        <Row>
                            <Col sm="6">
                                <TabContent className="text-left border border-secondary round">
                                    <TabPane >
                                        <span>Planned Date: {this.state.hoverObject["Planned Date"]}</span><br />
                                        <span>Actual Date: {this.state.hoverObject["Actual Date"]}</span><br />
                                        <span>Risk Level: {this.state.hoverObject["Risk Level"]}</span><br />
                                    </TabPane>
                                </TabContent>
                            </Col>
                            <Col sm="6">
                            <TabContent className="text-left border border-secondary round">
                                        <span>Notes: </span><br />
                                        {
                                            
                                            Object.values(this.state.hoverObject.Notes).map((value,key)=><div key={key}><span>{value}</span><br /></div>)
                                        }
                                </TabContent>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>);
    };

    render(){

        if(this.state.status === "Live"){
            return(<div>
                <CardHeader>{this.state.dataCenterTimeLineObj.dataCenterName}</CardHeader>
                {this._renderDC()}
                <WorkLoadTable tableData = {JSON.parse(this.props.dataCenterTimeLineObj.workLoads) }workloadobject = {this.props.workloadobject}/>
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
            }else if(this.props.status === "InProgress"){
                return(<>
                    <CardHeader>{this.state.dataCenterTimeLineObj.dataCenterName}</CardHeader>
                    {this._renderDC()}
                    <WorkLoadTable tableData = {JSON.parse(this.props.dataCenterTimeLineObj.workLoads) }workloadobject = {this.props.workloadobject}/>
                </>);
            }else return null;
    }
};