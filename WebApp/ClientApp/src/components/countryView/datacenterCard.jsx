/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {Card,CardBody} from "reactstrap";

export default function DataCenterCard() {
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
                <div className="mt-2">
                    <div className="row">
                            <div className="col-md-4"><span>Lease Signed:</span></div>
                            <div className="col-md-8"><span className="float-right">{datacenter.leaseSigned}</span></div>
                    </div>
                    <div className="row">
                            <div className="col-md-4"><span>RTEG:</span></div>
                            <div className="col-md-8"><span className="float-right">{datacenter.rteg}</span></div>
                    </div>
                    <div className="row">
                            <div className="col-md-4"><span>DC Vendors:</span></div>
                            <div className="col-md-8"><span className="float-right">{datacenter.dcVendors.join(",")}</span></div>
                    </div>
                    <div className="row">
                            <div className="col-md-6"><span>Telco Vendors:</span></div>
                            <div className="col-md-6"><span className="float-right">{datacenter.telcoVendors.join(",")}</span></div>
                    </div>
                </div>
            </div>
        );
    });

    return(<div className="col-sm-4">
   <Card className="h-100">
    <CardBody>
    <span className="text-muted font-weight-bold mb-1">Data Centers</span><br/>
        <ul className="nav nav-pills flex-column flex-md-row" id="pills-tab" role="tablist">
            {navTabItems}
        </ul>
        <div className="tab-content" id="pills-tabContent">
            {navTabContent}
        </div>
    </CardBody>
    </Card>
</div>);
};