/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from '../../utils/utils';
import ReactTable from "react-table";

import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane,
    UncontrolledTooltip
} from "reactstrap";

import ProgressBar from "views/components/progressbar.jsx"
import DataCenterNavBars from "views/components/navtabs.jsx"
class CountryTabPanel extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            country: this.props.country,
            status:this.props.status,
            loading:false,
            moveStatusObject:this.props.moveStatusObject,
            dataCentersObject:this.props.dataCentersObject,
            horizontalTabs: "home",
        };
    }

    dataCenterNavClicked = async (e,dataCenterObj)=>{
        //console.log("dataCenterNavClicked==> ",e);
       // console.log("dataCenterNavClicked==> ",dataCenterObj);
        await this.props.getDataCenterObject(dataCenterObj);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.moveStatusObject !== prevProps.moveStatusObject || this.props.dataCentersObject !== prevProps.dataCentersObject ) {
            await this.setState({loading:true});
            let dataCentersObject = this.props.dataCentersObject;
            let moveStatusObject = this.props.moveStatusObject;
            await this.setState({dataCentersObject, moveStatusObject,loading:false});
        }
    }
    _renderDCCard(){
        return(<>{DataCenterNavBars.call(this)}</>);
    };

    _renderMoveStatus(){
        return(<div>
                <span><h6>Move Status</h6></span>
                {ProgressBar.call(this)}
            </div>);
    };

    render(){
        return (this.state.loading)?null:((this.state.status===this.utils.statusToShowDc)? this._renderDCCard() : this._renderMoveStatus());
    }

}

export default CountryTabPanel;
