/* 
*  Copyright (c) Terawe. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import { VectorMap } from "react-jvectormap";
import { Card,Row,Col} from "reactstrap";
import Spinner from "components/spinner/spin";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.toolTipRef = React.createRef();
        this.state = {
            loading : true,
            mapColorCode:this.utils.mapColorCode,
        };
        this.regionClick = this.regionClick.bind(this);
        this.onMarkerTipShow = this.onMarkerTipShow.bind(this);
    }

    async componentDidMount() {
        this.utils.log("dashboard","componentDidMount method enter")
            if (this.state.loading) {
                let { mapData,batchIdSet,batchObjectArray} = await this.utils.getMapData();
                let usMapData = this.utils.generalUSMapMarkerData();
                this.utils.log("dashboard","componentDidMount method enter", batchIdSet.size)
                this.setState({ usMapData, mapData,loading:false,mapData,batchIdSet,batchObjectArray})
            }
        
    }

    regionClick =  async (event,code)=>{
        event.preventDefault();

        this.utils.log("dashboard","regionClick method enter : ", code)
        let cde = code.substring(3).toLowerCase();
        let stateCodeArray = this.state.usMapData.map(x=>x.stateCode.toLowerCase());

        if(stateCodeArray.includes(cde)){
            this.utils.log("dashboard","handleClick method", cde )
            this.props.history.push({
                pathname: '/admin/state',
                state: { 
                    stateCode:cde, 
                    usMapData:this.state.usMapData, 
                    mapData : this.state.mapData, 
                    batchIdSet : this.state.batchIdSet,
                    batchObjectArray : this.state.batchObjectArray
                }
              })
        }
        this.utils.log("dashboard","regionClick method exit")
    }

    onMarkerTipShow =  async (event,tip,code)=>{

        this.utils.log("dashboard","onMarkerTipShow method enter : ", code)
        let rowNumberArray = this.state.usMapData.map(x=>x.rowNumber.toString());
        if(rowNumberArray.includes(code)){
            let unitDeployedObj = this.state.usMapData.find(x=>x.rowNumber.toString()===code);
            console.log("onMarkerTipShow ", unitDeployedObj)
            tip.html(`<div className = 'btn btn-none' id="tooptipObject" ref=${this.toolTipRef}>
                    <strong className="bold">${unitDeployedObj.name}</strong><br/><br>
                    <em>Deployed Units: ${unitDeployedObj.noOfDeployedUnits}</em><br/>
                    <em>State Code: ${unitDeployedObj.stateCode}</em><br/><em>_________________</em><br/>
                    <em>Overall Health: ${unitDeployedObj.health === 1 ? "Good":"Bad"}</em><br/>
                    </div>`);
        };
        this.utils.log("dashboard","onMarkerTipShow method exit")
    }


    markerClick =  async (event,code)=>{
        event.preventDefault();

        this.utils.log("dashboard","markerClick method enter : ", code)

        this.utils.log("dashboard","markerClick method exit")
    }

    regionTipShow =  async (event,tip,code)=>{
        event.preventDefault();
        this.utils.log("dashboard","regionTipShow method enter : ", event,tip,code)
        
        this.utils.log("dashboard","regionTipShow method exit")
    }


    render() {
        let css_2= {"backgroundColor":"#F9F9FB"};

        if (this.state.loading) {
            return (
                <div className="content">
                    {Spinner.call(this)}
                </div>
            );
        } else {
            return (
                <div className="content">

                    <div className="pt-2 pb-2 ml-5 mr-5">
                    <div className="row"> 
                        <div className="col-sm-12">
                            <span className="text-muted font-weight-bold">
                                <h5>
                                Dashboard
                                </h5>
                            </span>
                        </div>
                    </div>
                        <Row>
                            <Col md="12">
                                <Card>
                                    <Col md="12" className="pr-4 pl-4 pt-4 pb-4">
                                        <span style={css_2} className="text-muted font-weight-bold">US MAP of HVAC Systems Deployed</span>
                                    </Col>
                                    <div className="pr-4 pl-4 pt-4 pb-4 col-md-12">
                                    <VectorMap
                                        map={"us_aea"}
                                        backgroundColor="transparent" //change it to blue !!!
                                        zoomOnScroll={false}
                                        containerStyle={{
                                            width: "100%",
                                            height: "550px"
                                        }}
                                        regionsSelectableOne={true}
                                        markersSelectableOne = {true}
                                        zoomAnimate ={true}
                                        containerClassName="map"

                                        regionStyle={{
                                            initial: {
                                                "fill": "#51BCDA",
                                                "fill-opacity": 1.9,
                                            },
                                            selected: {
                                                "fill-opacity": 0.5,
                                            }
                                        }}
                                        
                                        markers={this.state.usMapData}
                                        
                                        series={{
                                            markers: [
                                                {
                                                    scale: [ '#ff0000','#00ff00'],
                                                    attribute: 'fill',
                                                    values: this.state.usMapData.map(x=>x.health)
                                                },{
                                                    attribute: 'r',
                                                    scale: [1, 16],
                                                    values: this.state.usMapData.map(x=>x.noOfDeployedUnits),
                                                    min: 1,
                                                    max: 16
                                            }]
                                        }}

                                        onRegionClick={(e,code)=>{this.regionClick(e,code)}} 
                                        onMarkerTipShow = {(e,tip,code)=>{this.onMarkerTipShow(e,tip,code)}}

                                        onRegionTipShow={(e,code)=>{this.regionTipShow(e,code)}} 
                                        onMarkerClick = {(e,tip,code)=>{this.markerClick(e,tip,code)}}
                                    />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        }
    }
}

export default Dashboard;
