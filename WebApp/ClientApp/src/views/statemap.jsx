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
        this.stateCode = this.props.location.state ? this.props.location.state.stateCode : 'ca';

        this.state = {
            loading : true,
            usMapData: this.props.location.state ? this.props.location.state.usMapData: [],
            mapColorCode:this.utils.mapColorCode,
            mapData: this.props.location.state.mapData,
            batchIdSet : this.props.location.state.batchIdSet,
            batchObjectArray: this.props.location.state.batchObjectArray
        };

        console.log("State unit :===>", this.props.location)
        this.map  =  `us-${this.stateCode}_lcc_en`;
    }

    async componentDidMount() {
        let loading = false;
        let usMapData = this.state.usMapData;
        this.utils.log("dashboard","componentDidMount method enter")
        if(usMapData.length === 0){
            let usMapData = this.utils.generalUSMapMarkerData();
        };
        let unitDeployedObj = usMapData.find(x=>x.stateCode.toLowerCase()===this.stateCode);
        console.log(unitDeployedObj)
        this.setState({loading,usMapData,stateName:unitDeployedObj.stateName});
        
    }

    markerClick =  async (event,code)=>{
        event.preventDefault();

        this.utils.log("dashboard","markerClick method enter : ", code)
        let stateCodeArray = this.state.usMapData.map(x=>x.rowNumber.toString());

        if(stateCodeArray.includes(code)){
            this.utils.log("dashboard","handleClick method", code )
            this.props.history.push({
                pathname: '/admin/modules',
                state: { 
                        rowNumber:code, 
                        usMapData:this.state.usMapData,
                        stateName:this.state.stateName,
                        stateCode:this.stateCode,
                        mapData: this.state.mapData,
                        batchIdSet : this.state.batchIdSet,
                        batchObjectArray : this.state.batchObjectArray
                    }
              })
        }
        this.utils.log("dashboard","markerClick method exit")
    }

    onMarkerTipShow = async(event,tip,cod)=>{
        event.preventDefault();
    };

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
                                        <span style={css_2} className="text-muted font-weight-bold">{this.state.stateName} State MAP of HVAC Systems Deployed</span>
                                    </Col>
                                    <div className="pr-4 pl-4 pt-4 pb-4 col-md-12">
                                    <VectorMap
                                        map={this.map}
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

                                        onMarkerClick = {(e,tip,code)=>{this.markerClick(e,tip,code)}}
                                        onMarkerTipShow = {(e,tip,code)=>{this.onMarkerTipShow(e,tip,code)}}
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
