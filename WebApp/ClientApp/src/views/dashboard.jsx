/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import CountryTables from "components/dashboardView/table";
import Cards from "components/dashboardView/cards";
import WorldMap from "components/dashboardView/worldmap";
import Spinner from "components/spinner/spin";

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
            toolTipObject: {},
            CountriesObject:{}
        };
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        if (this.state.loading) {
            //getting data for card tiles
            let cardsStatus = await this.utils.getCardsData();
            //getting data for Map
            let { mapData, tableData,toolTipObject ,CountriesObject} = await this.utils.getMapData();
            let mapFeedData = this.utils.cloneObject(mapData);
            let tableFeedData = this.utils.cloneObject(tableData);
            this.setState({ mapFeedData,tableFeedData,cardsStatus, mapData,tableData,loading:false,toolTipObject,CountriesObject})
        }
    }

    handleClick =(event,code)=>{
        event.preventDefault();
    };

    //TODO: Will move this code to funcational component
    showCustomToolTip (event,tip,code){
		if (code in this.state.mapFeedData) {
            console.log("Tip===>",this.state.toolTipObject[code]);
            if(this.state.toolTipObject[code].Status===this.utils.statusToShowDc){
                tip.html(`<div className = 'btn btn-none'>
                <strong className="bold">${this.state.toolTipObject[code].Name}</strong><br/><br>
                <em>Population: ${this.state.toolTipObject[code].Population}</em><br/>
                <em>GDP: ${this.state.toolTipObject[code].Gdp}</em><br/><em>_________________</em><br/>
                <em>Status: ${this.state.toolTipObject[code].Status}</em><br/>
                </div>`); 
            }else{
                tip.html(`<div className = 'btn btn-none'>
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
    //TODO: Will move this code to funcational component
    
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

    render() {
        if (this.state.loading) {
            return (
                <div className="content">
                    {Spinner.call(this)}
                </div>
            );
        } else {
            return (
                <div className="content">
                    {Cards.call(this)}
                    {WorldMap.call(this,this.state.mapFeedData,this.state.mapColorCode)}
                    <CountryTables 
                        data={this.state.tableFeedData} 
                        tableData={this.state.tableData} 
                        CountriesObject={this.state.CountriesObject}
                        toolTipObject = {this.state.toolTipObject}/>
                </div>
            );
        }
    }
}

export default Dashboard;
