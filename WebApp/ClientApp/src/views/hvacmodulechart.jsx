/* 
*  Copyright (c) Terawe. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import { Card,Row,Col} from "reactstrap";
import { Link } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import Spinner from "components/spinner/spin";

const options =  {
    legend: {
        display: false
    }
};

function _hh_mm_ss (date) {
    let now = new Date(date)
    let hour =  now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return hour + ":" + minute + ":" + second;
  }

  const chartExample4 = {
    data: {
      labels: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      datasets: [
        {
          label: "Temperature Alerts",
          borderColor: "#fcc468",
          fill: true,
          backgroundColor: "#fcc468",
          hoverBorderColor: "#fcc468",
          borderWidth: 8,
          data: [
            100,
            120,
            80,
            100,
            90,
            130,
            110,
            100,
            80,
            110,
            130,
            140,
            130,
            120,
            130,
            80,
            100,
            90,
            120,
            130
          ]
        },
        {
          label:"Pressure Alerts",
          borderColor: "#4cbdd7",
          fill: true,
          backgroundColor: "#4cbdd7",
          hoverBorderColor: "#4cbdd7",
          borderWidth: 8,
          data: [
            8,
            14,
            5,
            12,
            5,
            15,
            6,
            13,
            5,
            13,
            15,
            10,
            11,
            8,
            14,
            5,
            14,
            5,
            11,
            15
          ]
        },
        {
          label:"Humidity Alerts",
          borderColor: "#4cbdd7",
          fill: true,
          backgroundColor: "#4cbdd7",
          hoverBorderColor: "#4cbdd7",
          borderWidth: 8,
          data: [
            20,
            21,
            28,
            12,
            19,
            17,
            20,
            18,
            24,
            13,
            18,
            15,
            19,
            18,
            17,
            16,
            14,
            19,
            11,
            15
          ]
        }
      ]
    },
    options: {
      tooltips: {
        tooltipFillColor: "rgba(0,0,0,0.5)",
        tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        tooltipFontSize: 14,
        tooltipFontStyle: "normal",
        tooltipFontColor: "#fff",
        tooltipTitleFontFamily:
          "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        tooltipTitleFontSize: 14,
        tooltipTitleFontStyle: "bold",
        tooltipTitleFontColor: "#fff",
        tooltipYPadding: 6,
        tooltipXPadding: 6,
        tooltipCaretSize: 8,
        tooltipCornerRadius: 6,
        tooltipXOffset: 10
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "#9f9f9f",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 20
            },
            gridLines: {
              zeroLineColor: "transparent",
              display: true,
              drawBorder: false,
              color: "#9f9f9f"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 0.4,
            gridLines: {
              zeroLineColor: "white",
              display: false,
  
              drawBorder: false,
              color: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f",
              fontStyle: "bold"
            }
          }
        ]
      }
    }
  };

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
            batchObjectArray : this.props.location.state.batchObjectArray,
            key:this.props.location.state.key,

            pressureArray : this.props.location.state.batchObjectArray.slice(40).map(x=>x.pressure),

            temperatureArray : this.props.location.state.batchObjectArray.slice(40).map(x=>x.temperature),

            humidityArray : this.props.location.state.batchObjectArray.slice(40).map(x=>x.humidity),

            timeArray: this.props.location.state.batchObjectArray.slice(40).map(x=>_hh_mm_ss(x.timeCreated))
        };

        console.log("State unit :===>", this.state.batchObjectArray)
    }

    async componentDidMount() {
        let loading = false;
        this.utils.log("dashboard","componentDidMount method enter")

    }

    render() {
        let css_2= {"backgroundColor":"#F9F9FB","fontSize":"1.2em"};

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
                                        <span style={css_2} className="text-muted font-weight-bold">Frenso HVAC Center: Module 1</span>
                                    </Col>
                                    <div className="row pr-4 pl-5 pt-4 pb-4">
                                        <Card className="card-chart col-sm-6">
                                            <span className="text-muted font-weight-bold">Presure</span>
                                            <Line
                                                data={{
                                                    labels: this.state.timeArray,
                                                    datasets: [
                                                      {
                                                        borderColor: "#f17e5d",
                                                        pointBackgroundColor: "#f17e5d",
                                                        pointRadius: 3,
                                                        pointHoverRadius: 3,
                                                        fill: false,
                                                        data: this.state.pressureArray
                                                      }
                                                    ]
                                                  }}
                                                options={options}
                                            />
                                        </Card>
                                        <Card className="card-chart col-sm-6">
                                            <span className="text-muted font-weight-bold">Temperature</span>
                                            <Line
                                                data={{
                                                    labels: this.state.timeArray,
                                                    datasets: [
                                                      {
                                                        borderColor: "#f17e5d",
                                                        pointBackgroundColor: "#f17e5d",
                                                        pointRadius: 3,
                                                        pointHoverRadius: 3,
                                                        fill: false,
                                                        data: this.state.temperatureArray
                                                      }
                                                    ]
                                                  }}
                                                options={options}
                                            />
                                        </Card>
                                    </div>
                                    <div className="row pr-4 pl-5 pt-4 pb-4">
                                        <Card className="card-chart col-sm-6">
                                            <span className="text-muted font-weight-bold">Humidity</span>
                                            <Line
                                                data={{
                                                    labels: this.state.timeArray,
                                                    datasets: [
                                                      {
                                                        borderColor: "#f17e5d",
                                                        pointBackgroundColor: "#f17e5d",
                                                        pointRadius: 3,
                                                        pointHoverRadius: 3,
                                                        fill: false,
                                                        data: this.state.humidityArray
                                                      }
                                                    ]
                                                  }}
                                                options={options}
                                            />
                                        </Card>
                                        <Card className="card-chart col-sm-6">
                                            <span className="text-muted font-weight-bold">Alerts</span>
                                            <Bar
                                                data={chartExample4.data}
                                                options={chartExample4.options}
                                            />
                                        </Card>
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
