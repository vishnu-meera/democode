/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane,
} from "reactstrap";

export default function DataCenterCard() {
    console.log("DataCenterNavBars movestatusprogress", this.state.dataCentersObject)
    let datacenters = this.state.dataCentersObject.map((datacenter,index)=>{
        return (<div key ={index}>
                    <div className="nav-tabs-navigation">
                        <div className="nav-tabs-wrapper">
                            <Nav id="tabs" role="tablist" tabs>
                                <NavItem>
                                    <NavLink
                                        aria-expanded={this.state.horizontalTabs === datacenter.dcCode}
                                        data-toggle="tab"
                                        href="#"
                                        role="tab"
                                        className={
                                            this.state.horizontalTabs === datacenter.dcCode
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>{this.toggleDC(datacenter.dcCode)}}
                                    > <span className=" text-bold text-left">{datacenter.name}</span></NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                    </div>
                        <TabContent className="text-left" id="my-tab-content" activeTab={this.state.horizontalTabs}>
                            <TabPane 
                                tabId={datacenter.dcCode} role="tabpanel" 
                                className="card-stats"
                                onClick={(e)=>{this.dataCenterNavClicked(e,datacenter)}}>
                                <span>Lease Signed: {datacenter.leaseSigned}</span><br />
                                <span>RTEG: {datacenter.rteg}</span><br /><br />
                                <span>DC Vendors: {datacenter.dcVendors.join(",")}</span><br />
                                <span>Telco Vendors: {datacenter.telcoVendors.join(",")}</span><br />
                            </TabPane>
                        </TabContent>
                </div>);
    });
    // btn btn-none ==>set it on another page
    return(<div>
        {datacenters}
    </div>);
};