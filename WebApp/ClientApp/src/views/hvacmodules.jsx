/* 
*  Copyright (c) Terawe. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import { Card,Row,Col} from "reactstrap";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import Spinner from "components/spinner/spin";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            loading : false,
            rowNumber:this.props.location.state.rowNumber, 
            usMapData:this.props.location.state.usMapData, 
            stateName:this.props.location.state.stateName, 
            stateCode:this.props.location.state.stateCode, 
            mapData: this.props.location.state.mapData, 
            batchIdSet : this.props.location.state.batchIdSet,
            batchObjectArray : this.props.location.state.batchObjectArray
        };

        console.log("State unit :===>", this.props.location)
    }

    async componentDidMount() {
        let loading = false;
        this.utils.log("dashboard","componentDidMount method enter")

    }

    _renderData(objectArray,key){
        const avgPresure = Math.round(
               ( (objectArray.slice(1,100).reduce((a,b)=>{ return a + b.pressure},0))/100)*100)/100;
        const avgTemperature = Math.round(
                ( (objectArray.slice(1,100).reduce((a,b)=>{ return a + b.temperature},0))/100)*100)/100;
        const avgHumidity = Math.round(
                    ( (objectArray.slice(1,100).reduce((a,b)=>{ return a + b.humidity},0))/100)*100)/100;
     
        console.log("batchId====>", avgPresure,key)
        let css_4 = {"color":"#252422"};

        return (<><Col sm="3" className="pt-3 pb-4" >
                <   div style={css_4} className="font-weight-bold text-center pb-1 text-dark">Presure</div>
                <Doughnut
                        data={{
                            datasets: [
                              {
                                backgroundColor: avgPresure < 20 ? ["#228B22", "#f4f3ef"] : ["#FF0000", "#f4f3ef"],
                                data: [avgPresure, 100-avgPresure]
                              }
                            ]
                          }}
                        options={{
                            elements: {
                                center: {
                                text: avgPresure.toString(),
                                color: "#66615c", 
                                fontStyle: "Arial", 
                                sidePadding: 60 
                                }
                            },
                            tooltips: {
                                enabled: false
                            },
                            }}
                        className="ct-chart ct-perfect-fourth"
                        height={300}
                        width={456}
                    />
                </Col>
                <Col sm="3" className="pt-3 pb-4" >
                <   div style={css_4} className="font-weight-bold text-center pb-1 text-dark">Temperature</div>
                <Doughnut
                        data={{
                            datasets: [
                              {
                                backgroundColor: avgTemperature < 50 ? ["#228B22", "#f4f3ef"] : ["#FF0000", "#f4f3ef"],
                                data: [avgTemperature, avgTemperature >100? 0 : 100-avgTemperature]
                              }
                            ]
                          }}
                        options={{
                            elements: {
                                center: {
                                text: avgTemperature.toString(),
                                color: "#66615c", 
                                fontStyle: "Arial", 
                                sidePadding: 60 
                                }
                            },
                            tooltips: {
                                enabled: false
                            },
                            }}
                        className="ct-chart ct-perfect-fourth"
                        height={300}
                        width={456}
                    />
                </Col>
                <Col sm="3" className="pt-3 pb-4" >
                <   div style={css_4} className="font-weight-bold text-center pb-1 text-dark">Humidity</div>
                <Doughnut
                        data={{
                            datasets: [
                              {
                                backgroundColor: avgHumidity < 25 ? ["#228B22", "#f4f3ef"] : ["#FF0000", "#f4f3ef"],
                                data: [avgHumidity, 100-avgHumidity]
                              }
                            ]
                          }}
                        options={{
                            elements: {
                                center: {
                                text: avgHumidity.toString(),
                                color: "#66615c", 
                                fontStyle: "Arial", 
                                sidePadding: 60 
                                }
                            },
                            tooltips: {
                                enabled: false
                            },
                            }}
                        className="ct-chart ct-perfect-fourth"
                        height={300}
                        width={456}
                    />
                </Col></>)
            
    }

    _renderDounts(){
        let css_3= {"fontSize":"0.9em"};
        let css_4 = {"color":"#252422"};
        let linkCss = {
            borderRadius: "5px",
        };

        return Array.from(this.state.batchIdSet).map((key,val)=>{
            let objectArray = this.state.batchObjectArray[key];
            objectArray = objectArray.sort(function(a,b){
                return new Date(b.timeCreated) - new Date(a.timeCreated);
              });
            
            
            return (<div className="pr-5 pl-5 pt-3 pb-3 col-md-12" key={key}>
                <Card>
                    <Col md="12">
                        <span style={css_3} className="text-muted font-weight-bold">HVAC Module {val+1} ID: {key}</span>
                    </Col>
                    <Row>
                        {this._renderData(objectArray,key)}
                        <Col sm="3" className="pt-3 pb-4">
                            <div style={css_4} className="font-weight-bold text-center pb-1 text-dark">No Of Installed Units In The Module</div>
                            <h1 className="font-weight-bold text-center text-dark pt-2">{this.state.batchIdSet.size}</h1>
                            <Link
                                style = {linkCss}
                                className="btn btn-primary ml-5 mr-5 pt-1 pb-1 pr-4 pl-4" 
                            to={{ pathname: '/admin/charts', 
                                    state: {      
                                        rowNumber:this.state.rowNumber, 
                                        usMapData:this.state.usMapData, 
                                        stateName:this.state.stateName, 
                                        stateCode:this.state.stateCode, 
                                        mapData: this.state.mapData, 
                                        batchIdSet : this.state.batchIdSet,
                                        batchObjectArray : objectArray,
                                        key:key
                                        } 
                                     }}>
                            <span className="text-center">See Details Of Module</span></Link>
                        </Col>
                    </Row>
                </Card>
            </div>)
        });
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
                                        <span style={css_2} className="text-muted font-weight-bold">Frenso HVAC Center</span>
                                    </Col>

                                    {this._renderDounts()}

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
