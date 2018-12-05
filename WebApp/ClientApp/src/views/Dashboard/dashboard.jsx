/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from '../../utils/utils';
import { VectorMap } from "react-jvectormap";
import CountryTables from "views/table/countryTable.jsx";
import { Card,CardBody,CardTitle,Row,Col} from "reactstrap";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            loading : true,
            cardsStatus: {},
            mapData: {},
            tableData: {},
            mapFeedData : {},
            tableFeedData : {},
            mapColorCode:this.utils.mapColorCode,
            mapLoading:false,
            cardActiveKey:"",
            toolTipObject: {}
        };
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        if (this.state.loading) {
            let cardsStatus = await this.utils.getCardsData();
            let { mapData, tableData,toolTipObject } = await this.utils.getMapData();
            console.log("toolTipObject==>",toolTipObject)
            let mapFeedData = this.utils.cloneObject(mapData);
            let tableFeedData = this.utils.cloneObject(tableData);
            this.setState({ mapFeedData,tableFeedData,cardsStatus, mapData,tableData,loading:false,toolTipObject})
        }
    }

    handleClick =(event,code)=>{
        event.preventDefault();
    };

    showCustomToolTip (event,tip,code){
		if (code in this.state.mapFeedData) {
            console.log("Tip===>",this.state.toolTipObject[code]);
            tip.html(`<div className = 'btn btn-none'>
            <strong className="bold">${this.state.toolTipObject[code].Name}</strong><br/><br>
            <em>Population: ${this.state.toolTipObject[code].Population}</em><br/>
            <em>GDP: ${this.state.toolTipObject[code].Gdp}</em><br/><em>_________________</em><br/>
            <em>Status: ${this.state.toolTipObject[code].Status}</em><br/>
            <em>Azure GA: ${this.state.toolTipObject[code].azureGa}</em><br/>
            <em>Office GA: ${this.state.toolTipObject[code].officeGa}</em><br/><em>_________________</em><br/>
            <em>Public Announcement: ${this.state.toolTipObject[code].publicAnnouncement}</em>
        </div>`); 
		} else  {
            event.preventDefault();
		}
    }

    async onCardClick(key){
        if(key!==this.state.cardActiveKey){
            await this.setState({mapLoading:true,cardActiveKey:key});
            let {mapFeedData,tableFeedData,mapColorCode} = this.utils.filterMapAndTableDataOnCard(key,this.state.mapData,this.state.tableData);
            await this.setState({mapFeedData,tableFeedData,mapColorCode});
            await this.setState({mapLoading:false})
        }else{
            await this.setState({mapLoading:true,cardActiveKey:""});
            let mapFeedData = this.state.mapData;
            let tableFeedData=this.state.tableData;
            let mapColorCode = this.utils.mapColorCode;
            await this.setState({mapFeedData,tableFeedData,mapColorCode});
            await this.setState({mapLoading:false})
        }
    }

    cards = () => {
        let keys = Object.keys(this.state.cardsStatus.countriesStatusList);
        console.log(this.state.cardsStatus.countriesStatusList)
        return (<Row>
            {
                keys.map((key) => {
                    let iconcss = `${this.utils.cardIconCssObj[key]} ${this.utils.textIconCssObj[key]}`;
                    let textcss = `text-left ${this.utils.textIconCssObj[key]}`;
                    let btnvcss = `card-stats btn btn-none ${this.state.cardActiveKey===key?'active':null}`;
                    return (
                        <Col lg="3" md="4" sm="4" key={key}>
                            <Card 
                                className= {btnvcss}
                                onClick={()=>{this.onCardClick(key)}}>
                                <CardBody>
                                    <Row>
                                        <Col md="4" xs="5">
                                            <div className="icon-big text-center">
                                                <i className={iconcss}/>
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <h5 className="card-category text-left">{key}</h5>
                                                <CardTitle tag="p" className={textcss}>{this.state.cardsStatus.countriesStatusList[key]}</CardTitle>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })
            }
        </Row>);
    }

    worldmap = (mapFeedData,mapColorCode) => {
        console.log("key onCardClick==>", mapFeedData,mapColorCode);
        if (this.state.mapLoading) {
            return null
        } else {
            return (
                <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <Row>
                                <Col className="ml-auto mr-auto" md="12">
                                    <VectorMap
                                        map={"world_mill"}
                                        backgroundColor="transparent" //change it to blue !!!
                                        zoomOnScroll={false}
                                        containerStyle={{
                                            width: "100%",
                                            height: "300px"
                                        }}
                                        onRegionClick={(e,code)=>{this.handleClick(e,code)}} 
                                        onRegionTipShow = {(e,tip,code)=>{this.showCustomToolTip(e,tip,code)}}
                                        containerClassName="map"
                                        regionStyle={{
                                            initial: {
                                                fill: "#e4e4e4",
                                                "fill-opacity": 0.9,
                                                stroke: "none",
                                                "stroke-width": 0,
                                                "stroke-opacity": 0
                                            },
                                            hover: {
                                                "fill-opacity": 0.8,
                                                cursor: 'pointer'
                                            }
                                        }}
                                        regionsSelectable={true}
                                        series={{
                                            regions: [
                                                {
                                                    values: mapFeedData,  //this is your data
                                                    scale: mapColorCode,  //your color game's here
                                                    normalizeFunction: "polynomial"
                                                }
                                            ]
                                        }}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>);
        }
    }

    render() {
        console.log("calling render....")
        if (this.state.loading) {
            return null
        } else {
            return (
                <>
                    <div className="content">
                        {this.cards()}
                        {this.worldmap(this.state.mapFeedData,this.state.mapColorCode)}
                        <CountryTables data={this.state.tableFeedData} tableData={this.state.tableData}/>
                    </div>
                </>
            );
        }
    }
}

export default Dashboard;
