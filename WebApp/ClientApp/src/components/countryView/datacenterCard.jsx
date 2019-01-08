/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {Card,CardBody} from "reactstrap";

export default function DataCenterCard() {
    let css_1 = {"height":"13rem"};
    let css_2 = {"cursor":"pointer"};

    let navTabItems = this.state.dataCentersObject.map((datacenter,index)=>{
        let id = `pills-${datacenter.dcCode}-tab`;
        let ariaControl = `pills-${datacenter.dcCode}`;
        let areaSelected = this.state.horizontalTabs === datacenter.dcCode ? true:false;
        let active = this.state.horizontalTabs === datacenter.dcCode? "active": null;
        let classActive = `nav-link ${active}`;
        return (<li className="nav-item"  key ={index}  
                    onClick={() =>{this.toggleDC(datacenter.dcCode,datacenter)}}
                    style={css_2}>
                    <a  className={classActive}
                        id={id} 
                        data-toggle="pill" 
                        role="tab" 
                        aria-controls={ariaControl} 
                        aria-selected={areaSelected}>{datacenter.name}</a>
              </li>);
    });

    let navTabContent = this.state.dataCentersObject.map((datacenter,index)=>{
        let id = `pills-${datacenter.dcCode}-tab`;
        let ariaControl = `pills-${datacenter.dcCode}`;
        let active = this.state.horizontalTabs === datacenter.dcCode? "active": "";
        let classActive = `tab-pane fade show ${active}`;
        return (
            <div key={index}
                className={classActive}
                id={ariaControl}
                role="tabpanel" 
                aria-labelledby={id}
            >
                <div className="ml-2">
                    <span>Lease Signed: {datacenter.leaseSigned}</span><br />
                    <span>RTEG: {datacenter.rteg}</span><br /><br />
                    <span>DC Vendors: {datacenter.dcVendors.join(",")}</span><br />
                    <span>Telco Vendors: {datacenter.telcoVendors.join(",")}</span><br />
                </div>
            </div>
        );
    });

    return(<div className="col-sm-4">
   <Card style={css_1}>
    <CardBody>
    <span className="text-muted font-weight-bold">Data Centers</span><br/>
        <ul className="nav nav-pills" id="pills-tab" role="tablist">
            {navTabItems}
        </ul>
        <div className="tab-content" id="pills-tabContent">
            {navTabContent}
        </div>
    </CardBody>
    </Card>
</div>);
};