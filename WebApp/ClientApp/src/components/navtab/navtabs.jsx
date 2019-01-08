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


const test =  {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "black",
    boxShadow: "0px 10px 0px black, 0px 20px 0px black"
    };

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
                                                : "active"
                                        }
                                        onClick={() =>{this.toggleDC(datacenter.dcCode)}}
                                    > 
                                        <div className="row">
                                            <div className="col-xs-6">
                                                {datacenter.name}
                                            </div>
                                            <div className="col-xs-3">
                                                <div style={test} className="ml-1 pl-1"></div>
                                            </div>
                                        </div>
                                    </NavLink>
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