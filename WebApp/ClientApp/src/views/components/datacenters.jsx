import React from "react";
import Utils from '../../utils/utils';

import {
    Card,
    Badge,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    FormGroup,
    Progress,
    TabContent,
    TabPane,
    Row,
    Col
} from "reactstrap";

import MoveStatusTable from "views/table/moveStatus.jsx";
import WorkLoadTable from "views/table/workloadsTable.jsx";


export default class DataCentersProgress extends React.Component {

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

    _renderDC(){
        //console.log("HoverObject==>",this.state.hoverObject)
        const timeLine = JSON.parse(this.state.dataCenterTimeLineObj.timeLine);
        const statusColor = "";
        return(<Row>
            <Col sm="12">
                <Card className="stats">
                    <CardHeader>TimeLine</CardHeader>
                    <CardBody>
                        <div className='htimeline'>
                            {
                                timeLine.map((obj,key)=>{
                                    let css = `step col-sm-1 ${(key<3?"green":"none")}`
                                    let num = key +1
                                    return (<li 
                                                key ={key}data-date={num.toString()} 
                                                onMouseOver= {(e)=>{this.onHoverThroughTime(e,obj)}}
                                                className={css}>
                                                <div>{obj.Name}</div>
                                            </li>)
                                })
                            }
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

        return (this.state.status===this.utils.statusToShowDc)?
        (
            <>
                <CardHeader>{this.state.dataCenterTimeLineObj.dataCenterName}</CardHeader>
                {this._renderDC()}
                <WorkLoadTable tableData = {JSON.parse(this.props.dataCenterTimeLineObj.workLoads) }workloadobject = {this.props.workloadobject}/>
            </>
        ):
        (<Row>
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
        </Row>);
    }
};