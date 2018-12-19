/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

export default function National(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0]
    let css_1 = {"backgroundColor":"white"}
    if (this.state.loading) {
        return null
    } else {
    return (
        <div className="col-sm-3">
            <div style={css_1}>
                <span className="text-muted font-weight-bold ml-2 mt-2">National View</span><br/>
                <span className="ml-2">Population: {mcio.population}</span><br />
                <span className="ml-2">GDP: {mcio.gdp}</span><br /><br />
                <span className="text-muted font-weight-bold ml-2 mt-2">Opportunity</span><br/>
                <span className="ml-2">TAM (Restricted) : {mcio.taM_Restricted}</span><br />
                <span className="ml-2">TAM (UnRestricted) : {mcio.taM_UNRestricted}</span><br />
                <span className="ml-2">Revenue Projection 3Y : {mcio.revenueProjection3Y}</span><br />
                <span className="ml-2">Revenue Projection 5Y : {mcio.revenueProjection5Y}</span>
            </div>
    </div>);
    }
}