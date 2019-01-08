
/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import { Link } from "react-router-dom";
import { Card,CardBody,CardTitle} from "reactstrap";

import MCIO from "components/dashboardView/panelcards/mcioCard";
import NATIONAL from "components/dashboardView/panelcards/nationalCard";
import Opportunity from "components/dashboardView/panelcards/opportunityCard";
import MoveStatus from "components/dashboardView/panelcards/movestatusCard";
import DataCenter from "components/dashboardView/panelcards/datacenterCard";
import Spinner from "components/spinner/spin";

const componentStatusObject = {
    "Live":[NATIONAL,Opportunity,MCIO,MoveStatus],
    "InProgress":[NATIONAL,Opportunity,MCIO,DataCenter],
    "Approved":[NATIONAL,Opportunity,MCIO],
    "Potential":[NATIONAL,Opportunity,MCIO],
};

const countryButtonEnable = ["Live","InProgress"];
const getDCObject =(data,country)=>{
    let mcio = data.filter(x=>x.name === country)[0]
    let dataCentersObject = JSON.parse(mcio.dataCenters);
    let horizontalTab = dataCentersObject[0].dcCode
    return {dataCentersObject,horizontalTab};
}

class CountryPanel extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            country: this.props.country,
            status:this.props.status,
            verticalTabs: "info",
            pageTabs: "homePages",
            loading: true,
            openedCollapses: [""],
            redirect:false,
            moveStatusObject:{},
            ...getDCObject(this.props.CountriesObject,this.props.country)
            
        };
    };

    dataCenterNavClicked = async (e,dataCenterObj)=>{
       //console.log("dataCenterNavClicked==> ",dataCenterObj);
    }

    toggleDC(dcCode){
        let horizontalTabs ="";
        if(this.state.horizontalTabs !== dcCode){
            horizontalTabs = dcCode
        }
        this.setState({ horizontalTabs})
    }
    

    async componentDidMount() {
        if (this.state.loading) {
            if("Live"===this.props.status){
                let { moveStatusObject} = await this.utils.geMoveStatusObject(this.props.country);
                await this.setState({moveStatusObject});
            }
            await this.setState({loading: false});
        }
    }

    async componentDidUpdate(prevProps) {
        
        if (this.props.country !== prevProps.country) {
            await this.setState({ loading: true});
            if("Live"==this.props.status){
                let { moveStatusObject} = await this.utils.geMoveStatusObject(this.props.country);
                await this.setState({moveStatusObject});
            }else{
                await this.setState({...getDCObject(this.props.CountriesObject,this.props.country)})
            }

            await this.setState({ 
                country: this.props.country, 
                status: this.props.status ,
                loading:false
            });
        }
    }

    collapsesToggle = (collapse) => {
        let openedCollapses = this.state.openedCollapses;
        if (openedCollapses.includes(collapse)) {
            this.setState({
                openedCollapses: openedCollapses.filter(item => item !== collapse)
            });
        } else {
            openedCollapses.push(collapse);
            this.setState({
                openedCollapses: openedCollapses
            });
        }
    };

    render() {

        let panelComponents = componentStatusObject[this.props.status].map((x,k)=>{
            return (<div key={k}>{x.call(this)}</div>);
        });

        let linkCss = {
            borderRadius: "20px",
        };


        if(this.state.loading){
            return(
                <Card>
                <CardBody>
                {Spinner.call(this)}
                </CardBody>
            </Card>
            )
        }else{
            return (
                    <div
                        aria-multiselectable={true}
                        className="card"
                        id="accordion"
                        role="tablist">
                        <Link
                            style = {linkCss}
                            disabled={!countryButtonEnable.includes(this.props.status)}
                            className="btn btn-primary ml-5 mr-5 pt-1 pb-1 pr-4 pl-4" 
                            to={{ pathname: '/admin/country', 
                            state: { country: this.props.country, status: this.props.status, countriesObject:this.props.CountriesObject ,toolTipObject:this.props.toolTipObject,dataCentersObject:this.state.dataCentersObject} }}
                        ><span className="text-center">See Details</span></Link>
                        
                        <span className="text-left ml-3 mt-2"><h6>{this.props.country}</h6></span>
                        {panelComponents}

                        <Link
                            style = {linkCss}
                            disabled={!countryButtonEnable.includes(this.props.status)}
                            className="btn btn-primary ml-5 mr-5 pt-1 pb-1 pr-4 pl-4" 
                            to={{ pathname: '/admin/country', 
                            state: { country: this.props.country, status: this.props.status, countriesObject:this.props.CountriesObject ,toolTipObject:this.props.toolTipObject,dataCentersObject:this.state.dataCentersObject} }}
                        ><span className="text-center">See Details</span></Link>
                    </div>);
        }
    }
}

export default CountryPanel;