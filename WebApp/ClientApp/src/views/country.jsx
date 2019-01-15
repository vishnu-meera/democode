/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { Link } from "react-router-dom";
import Utils from 'utils/utils';
import Auth from 'utils/authhelper';
import Spinner from "components/spinner/spin";
import DataCenterView from "views/datacenters.jsx"
import MoveStatus from "components/countryView/movestatus";
import DataCenter from "components/countryView/datacenterCard"
import National from "components/countryView/nationalCard";
import Overview from "components/countryView/overviewCard";
import Microsoft from "components/countryView/microsoftCard";

class Country extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.auth = new Auth();
        const { country ,status ,countriesObject,dataCentersObject,toolTipObject} = props.location.state

        this.state = {
            country: country,
            horizontalTabs:"Country",
            countryCode:this.utils.getCode(country),
            countriesObject:countriesObject,
            toolTipObject:toolTipObject,
            status:status,
            loading: true,
            loadingDC: false,
            imgUri: "",
            moveStatusObject:{},
            moveStatusItems:{},
            dataCentersObject:dataCentersObject,
            dataCenterTimeLineObj:{},
            workloadobject:{},
            ruleTable:[]
        };
    }

    async componentDidMount() {
        let {authenticated,token} = await this.auth.isAuthenticated();
        if(authenticated){
            if (this.state.loading) {
                let countryCode = await this.utils.getCode(this.state.country);
                let imgUri = `https://www.countryflags.io/${countryCode}/shiny/64.png`;

                let ruleTable = await this.utils.getRuleTable(token);
                
                await this.setState({ imgUri, countryCode,ruleTable })
                if("InProgress"===this.state.status){
                    let dataCenterTimeLineObj = await this.utils.getDataCenterObjectWithDCCode(this.state.country,this.state.dataCentersObject[0].dcCode,token);
                    let workloadobject = await this.utils.geAlltWorkloadObjects(this.state.country,this.state.dataCentersObject[0].dcCode,token)
                    await this.setState({horizontalTabs:this.state.dataCentersObject[0].dcCode,dataCenterTimeLineObj,workloadobject});
                }else if("Live"===this.state.status){
                    let  {moveStatusObject,moveStatusItems }= await this.utils.geMoveStatusObject(this.state.country);
                    await this.setState({moveStatusObject,moveStatusItems});
                }
                await this.setState({loading: false });
            }
        }else{
            console.log("dashboard===> not authenticated");
            this.props.history.push("/admin");
        }
    }

    toggleDC = async (dcCode,dataCenterObj)=>{
        let horizontalTabs ="";
        if(this.state.horizontalTabs !== dcCode){
            horizontalTabs = dcCode
        }
        await this.setState({ horizontalTabs,loadingDC: true });
        await this.getDataCenterObject(dataCenterObj);
    }
    
    getDataCenterObject = async(dataCenterObj)=>{
        let dataCenterTimeLineObj = await this.utils.getDataCenterObjectWithDCCode(this.state.country,dataCenterObj.dcCode);
        console.log("dataCenterTimeLineObj===>",dataCenterTimeLineObj)
        await this.setState({dataCenterTimeLineObj,loadingDC: false});
    }

    _renderMoveOrDC(){
        if(this.state.status === "Live"){
            return(<>
                {MoveStatus.call(this)}
            </>);
        }else{
            return(<>{DataCenter.call(this)}</>);
        }
    };

    render() {
        let css_2= {"backgroundColor":"#F9F9FB"};
        if (this.state.loading) {
            return (                <div className="content">
            {Spinner.call(this)}
        </div>)
        } else {
            return (
            <>
            <div className="content pt-2 pb-2 ml-5 mr-5">
                <div className="row"> 
                    <div className="col-sm-12">
                        <span className="text-muted font-weight-bold">
                            <h6>
                                <Link to={{ pathname: '/admin/dashboard' }}>Dashboard/</Link>
                                {this.state.country}
                            </h6>
                        </span>
                    </div>
                </div>
                <div className="row mb-3" style={css_2}>
                    <div  className="col-sm-12">
                            <div className="row"><span className="text-muted font-weight-bold ml-3 mt-2"><h6>Overview</h6></span></div>
                            <div className="row row-flex mb-2">
                                {Overview.call(this)}
                                {National.call(this)}
                                {Microsoft.call(this)}
                                {this._renderMoveOrDC()}
                            </div>
                    </div>
                </div>
                <div className="row mt-1" style={css_2}>
                    <div className="col-sm-12">
                        {
                            (this.state.loadingDC)?<div>{Spinner.call(this)}</div>:
                            <DataCenterView 
                            status={this.state.status} 
                            dataCenterTimeLineObj={this.state.dataCenterTimeLineObj} 
                            workloadobject = {this.state.workloadobject}
                            ruleTable= {this.state.ruleTable}
                            moveStatusItems = {this.state.moveStatusItems}/>
                        }
                    </div>
                </div>
            </div>
            </>
            );
        }
    }
}

export default Country;