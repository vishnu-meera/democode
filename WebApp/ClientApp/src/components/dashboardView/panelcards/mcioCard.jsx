/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
export default function MCIO(){

    let mcio = this.props.CountriesObject.filter(x=>x.name === this.state.country)[0]
    let mcio_2 = this.props.toolTipObject[this.props.countryCode]
    let css = {
        "fontSize":"15px"
    };
    if (this.state.loading) {
        return null
    } else {
    return (
        <div className="ml-3 mt-2">
            <span className="text-muted font-weight-bold"  style={css}>Microsoft</span><br/>
            <span>CAPEX Status: Approved (Date) {mcio.capex}</span><br/>
            <span>Public Announcement: {mcio_2.publicAnnouncement}</span><br/>
            <span>Azure GA:{mcio_2.azureGa}</span><br/>
            <span>Office GA: {mcio_2.officeGa}</span><br/>
            <span>Revenue Projection 3Y:{mcio.revenueProjection3Y}</span><br/>
            <span>Revenue Projection 5Y: {mcio.revenueProjection5Y}</span><br/>
            <span>DCX Customers: {mcio.dcX_Customers}</span><p></p>
            <div className="dropdown-divider"></div>
        </div>);
    }
}