/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import Auth from 'utils/authhelper';
import CountryTables from "components/dashboardView/table";
import Cards from "components/dashboardView/cards";
import WorldMap from "components/dashboardView/worldmap";
import Spinner from "components/spinner/spin";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.auth = new Auth();
        this.toolTipRef = React.createRef();
        this.state = {
            loading : true,
            cardsStatus: {},
            mapData: {},
            tableData: {},
            mapFeedData : {},
            tableFeedData : {},
            tableFeedData_2:{},
            mapColorCode:this.utils.mapColorCode,
            mapLoading:false,
            cardActiveKey:"",
            activeCountryCode:"",
            toolTipObject: {},
            CountriesObject:{},
            toolTipShow:false,
            clientX:0,
            clientY:0,
            onMapCountryClicked:false,
            token:null
        };
        this.handleClick = this.handleClick.bind(this);
        this._onMapMouseOver = this._onMapMouseOver.bind(this)   
    }

    async componentDidMount() {
        this.utils.log("dashboard","componentDidMount method enter")
        let {authenticated,token} = await this.auth.isAuthenticated();
        if(authenticated){
            if (this.state.loading) {
                //getting data for card tiles
                let cardsStatus = await this.utils.getCardsData(token);
                //getting data for Map and table
                let { mapData, tableData,toolTipObject ,CountriesObject} = await this.utils.getMapData(token);
                let mapFeedData = this.utils.cloneObject(mapData);
                let tableFeedData = this.utils.cloneObject(tableData);
                this.setState({ mapFeedData,tableFeedData,cardsStatus, mapData,tableData,loading:false,toolTipObject,CountriesObject,token})
            }
        }else{
            this.props.history.push('/admin');
        }
        this.utils.log("dashboard","componentDidMount method exit")
    }

    handleClick =  async (event,code,tip)=>{

        this.utils.log("dashboard","handleClick method enter")

        event.preventDefault();
        let tipObjArr = document.body.getElementsByClassName("jvectormap-tip");
        Object.keys(tipObjArr).forEach(x=>tipObjArr[x].style.display="none")
        await this.setState({onMapCountryClicked:true});

        if (code in this.state.mapData) {
            await this.setState({mapLoading:true});
            if(this.state.activeCountryCode.length===0){
                let {mapFeedData,tableFeedData,mapColorCode} = this.utils.filterMapAndTable(code,this.state.mapData,this.state.tableData);
                await this.setState({mapFeedData,tableFeedData,mapColorCode,activeCountryCode:code});
            }else{
                if(this.state.cardActiveKey.length !==0){
                    let {mapFeedData,tableFeedData,mapColorCode} = this.utils.filterMapAndTableDataOnCard(this.state.cardActiveKey,this.state.mapData,this.state.tableData);
                    await this.setState({mapFeedData,tableFeedData,mapColorCode,activeCountryCode:""});
                }else{
                    let mapFeedData = this.state.mapData;
                    let tableFeedData=this.state.tableData;
                    let mapColorCode = this.utils.mapColorCode;
                    await this.setState({mapFeedData,tableFeedData,mapColorCode,activeCountryCode:""});
                }
            }
            await this.setState({mapLoading:false})
        }

        this.utils.log("dashboard","handleClick method exit")
    }

    async onCardClick(key){
        this.utils.log("dashboard","onCardClick method enter")

        if(key!==this.state.cardActiveKey){
            await this.setState({mapLoading:true,cardActiveKey:key,activeCountryCode:""});
            let {mapFeedData,tableFeedData,mapColorCode} = this.utils.filterMapAndTableDataOnCard(key,this.state.mapData,this.state.tableData);
            await this.setState({mapFeedData,tableFeedData,mapColorCode});
            await this.setState({mapLoading:false})
        }else{
            await this.setState({mapLoading:true,cardActiveKey:"",activeCountryCode:""});
            let mapFeedData = this.state.mapData;
            let tableFeedData=this.state.tableData;
            let mapColorCode = this.utils.mapColorCode;
            await this.setState({mapFeedData,tableFeedData,mapColorCode});
            await this.setState({mapLoading:false})
        }

        this.utils.log("dashboard","onCardClick method exit")
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async showCustomToolTip (event,tip,code){
		if (code in this.state.mapFeedData) {
            if(this.state.toolTipObject[code].Status===this.utils.statusToShowDc){
                tip.html(`<div className = 'btn btn-none' id="tooptipObject" ref=${this.toolTipRef}>
                <strong className="bold">${this.state.toolTipObject[code].Name}</strong><br/><br>
                <em>Population: ${this.state.toolTipObject[code].Population}</em><br/>
                <em>GDP: ${this.state.toolTipObject[code].Gdp}</em><br/><em>_________________</em><br/>
                <em>Status: ${this.state.toolTipObject[code].Status}</em><br/>
                </div>`); 
            }else{
                tip.html(`<div className = 'btn btn-none' id="tooptipObject">
                <strong className="bold">${this.state.toolTipObject[code].Name}</strong><br/><br>
                <em>Population: ${this.state.toolTipObject[code].Population}</em><br/>
                <em>GDP: ${this.state.toolTipObject[code].Gdp}</em><br/><em>_________________</em><br/>
                <em>Status: ${this.state.toolTipObject[code].Status}</em><br/>
                <em>Azure GA: ${this.state.toolTipObject[code].azureGa}</em><br/>
                <em>Office GA: ${this.state.toolTipObject[code].officeGa}</em><br/><em>_________________</em><br/>
                <em>Public Announcement: ${this.state.toolTipObject[code].publicAnnouncement}</em>
                </div>`); 
            }
		} else  {
            event.preventDefault();
		}
    }
    
     _onMapMouseOver = async (event)=>{
        let attributes = event.target.getAttributeNames();
        if(attributes.includes("data-code")){
            let code  = event.target.getAttribute("data-code");
            if (code in this.state.mapFeedData){
                await this.setState({clientX:event.clientX,clientY:event.clientY});
            }
        }
        //event.preventDefault();
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
                        {
                            (this.state.tableData&&this.state.mapData&&this.state.cardsStatus)?
                            (<div style={css_2}>
                                {Cards.call(this)}
                                {WorldMap.call(this,this.state.mapFeedData,this.state.mapColorCode)}
                                <CountryTables 
                                    data={this.state.tableFeedData} 
                                    tableData={this.state.tableData} 
                                    CountriesObject={this.state.CountriesObject}
                                    toolTipObject = {this.state.toolTipObject}/>
                            </div>):
                            (
                                <div style={css_2}>
                                <span className="text-muted font-weight-bold">
                                <h6>
                                    Please use datacapture to enter some data.
                                </h6>
                                </span>
                            </div>
                            )
                        }
                    </div>
                </div>
            );
        }
    }
}

export default Dashboard;
