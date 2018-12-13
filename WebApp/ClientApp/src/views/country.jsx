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

import Spinner from "components/spinner/spin";
import DataCenterView from "views/datacenters.jsx"
import MovestatusDatacenter from "components/countryView/movestatus_datacenter";
import McioAndOpportunity from "components/countryView/mcioCard";
import Overview from "components/countryView/overviewCard";
import Microsoft from "components/countryView/microsoftCard";

class Country extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        const { country ,status ,countriesObject,dataCentersObject,toolTipObject} = props.location.state
        console.log("Country Component==> :", props.location.state)
        this.state = {
            country: country,
            horizontalTabs:"Country",
            countryCode:this.utils.getCode(country),
            countriesObject:countriesObject,
            toolTipObject:toolTipObject,
            status:status,
            loading: true,
            loadingDC: false,
            countryCode: "",
            imgUri: "",
            moveStatusObject:{},
            dataCentersObject:dataCentersObject,
            dataCenterTimeLineObj:{},
            workloadobject:{}
        };
    }

    async componentDidMount() {
        if (this.state.loading) {
            let countryCode = await this.utils.getCode(this.state.country);
            let imgUri = `https://www.countryflags.io/${countryCode}/flat/64.png`;
            await this.setState({ imgUri, countryCode })
            if("Live"===this.state.status || "InProgress"===this.state.status){
                let dataCenterTimeLineObj = await this.utils.getDataCenterObjectWithDCCode(this.state.country,this.state.dataCentersObject[0].dcCode);
                let workloadobject = await this.utils.geAlltWorkloadObjects(this.state.country,this.state.dataCentersObject[0].dcCode)
                await this.setState({horizontalTabs:this.state.dataCentersObject[0].dcCode,dataCenterTimeLineObj,workloadobject});
                let  {moveStatusObject }= await this.utils.geMoveStatusObject(this.state.country);
                await this.setState({moveStatusObject});
            }else if("Live"===this.state.status){
                let  {moveStatusObject }= await this.utils.geMoveStatusObject(this.state.country);
                await this.setState({moveStatusObject});
            }
            await this.setState({loading: false });
        }
    }
    
    getDataCenterObject = async(dataCenterObj)=>{
        await this.setState({loadingDC: true });
        //console.log("getDataCenterObject dataCenterObj==>",dataCenterObj.dcCode);
        let dataCenterTimeLineObj = await this.utils.getDataCenterObjectWithDCCode(this.state.country,dataCenterObj.dcCode);
        await this.setState({dataCenterTimeLineObj,loadingDC: false});
    }

    render() {
        if (this.state.loading) {
            return (                <div className="content">
            {Spinner.call(this)}
        </div>)
        } else {
            return (
            <>
            <div className="content">
                <Row> <Col md="12"><h6>Dashboard/{this.state.country}</h6></Col></Row>
                <Row>
                    <Col sm="12">
                        <Card className="card-stats">
                            <CardHeader><h6>Overview</h6></CardHeader>
                                <CardBody>
                                    <Row>
                                        {Overview.call(this)}
                                        {McioAndOpportunity.call(this)}
                                        {Microsoft.call(this)}
                                        <Col lg="3" md="5" sm="5">
                                            <Card className="card-stats">
                                                <CardBody>
                                                    <Row>
                                                        <Col md="12" xs="12">
                                                            <MovestatusDatacenter 
                                                                getDataCenterObject = {this.getDataCenterObject}
                                                                country={this.state.country} 
                                                                status={this.state.status}
                                                                moveStatusObject={this.state.moveStatusObject}
                                                                dataCentersObject={this.state.dataCentersObject}
                                                                 />
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12">
                        <Card className="charts">
                        { (this.state.loadingDC)?null:
                   (<DataCenterView status={this.state.status} dataCenterTimeLineObj={this.state.dataCenterTimeLineObj} workloadobject = {this.state.workloadobject}/>)
                }
                        </Card>
                    </Col>
                </Row>
            </div>
            </>
            );
        }
    }
}

export default Country;