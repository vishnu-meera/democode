
/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import { Link } from "react-router-dom";
import { Card,CardBody,CardTitle} from "reactstrap";

import MCIO from "components/generalView/mcioCard";
import NATIONAL from "components/generalView/nationalCard";
import Opportunity from "components/generalView/opportunityCard";
import MoveStatus from "components/generalView/movestatusCard";
import DataCenter from "components/generalView/datacenterCard";

const componentStatusObject = {
    "Live":[NATIONAL,Opportunity,MCIO,MoveStatus,DataCenter],
    "InProgress":[NATIONAL,Opportunity,MCIO,DataCenter],
    "Approved":[NATIONAL,Opportunity,MCIO],
    "Potential":[NATIONAL,Opportunity,MCIO],
};

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
        console.log("CountryPanel render===>",this.props.CountriesObject);
        let panelComponents = componentStatusObject[this.props.status].map((x,k)=>{
            return (<div key={k}>{x.call(this)}</div>);
        });

        const disable = (this.props.status === "Live" || this.props.status==="InProgress")?false:true;
        if(this.state.loading){
            return null
        }else{
            return (<Card>
                <CardBody>
                    <div
                        aria-multiselectable={true}
                        className="card-collapse"
                        id="accordion"
                        role="tablist">

                        <CardTitle tag="h5">{this.props.country}</CardTitle>
                        {panelComponents}
                        <Card className="card-plain text-center">
                            <Link
                                disabled={disable}
                                className="btn btn-primary text-center"
                                to={{ pathname: '/country', 
                                state: { country: this.props.country, status: this.props.status, countriesObject:this.props.CountriesObject ,toolTipObject:this.props.toolTipObject,dataCentersObject:this.state.dataCentersObject} }}
                            >See Seats Updates</Link>
                        </Card>

                    </div>
                </CardBody>
            </Card>);
        }
    }
}

export default CountryPanel;