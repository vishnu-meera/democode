/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

export default function Microsoft(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0];
    let mcio_2 = this.state.toolTipObject[this.state.countryCode]
    let css_1 = {"backgroundColor":"white"}
    if (this.state.loading) {
        return null
    } else {
    return (<div className="col-sm-3">
        <div style={css_1}>
            <span className="text-muted font-weight-bold ml-2 mt-2">Microsoft</span><br/>
            <span className="ml-2">CAPEX Status:Approved (Date) {mcio.capex} </span><br />
            <span className="ml-2">Public Announcement: {mcio_2.publicAnnouncement} </span><br />
            <span className="ml-2">Azure GA:{mcio_2.azureGa}</span><br />
            <span className="ml-2">Office GA: {mcio_2.officeGa} </span><br />
            <span className="ml-2">DCX Customers: {mcio.dcX_Customers} </span><br /><br/><br/><br />
        </div>
    </div>);
    }
}





