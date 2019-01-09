/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

export default function DataCenter(){
    let datacenters = this.state.dataCentersObject.map((datacenter,index)=>{
        return (
            <div className="text-left" key={index}>
                <div>
                    <span className="text-muted font-weight-bold">Data Centers - {datacenter.name}</span><br/>
                    <span>Lease Signed: {datacenter.leaseSigned}</span><br/>
                    <span>RTEG: {datacenter.rteg}</span><br/>
                    <span>DC Vendors: {datacenter.dcVendors.join(",")}</span><br/>
                    <span>Telco Vendors: {datacenter.telcoVendors.join(",")}</span>
                </div>
                <p></p>
                <div className="dropdown-divider"></div>
        </div>)
    });

    if (this.state.loading) {
        return null
    } else {
    return (<div className="ml-3 mt-2">
                {datacenters}
        </div>);
    }
}