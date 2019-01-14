/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

export default function NATIONAL(){
    let mcio = this.props.CountriesObject.filter(x=>x.name === this.state.country)[0]
    let css = {
        "fontSize":"15px"
    };
    if (this.state.loading) {
        return null
    } else {
    return ( 
        <div className="ml-3 mt-2">
            <span className="text-muted font-weight-bold"  style={css}>National View</span><br/>
            <span>Population:{mcio.population}</span><br/>
            <span>GDP: {mcio.gdp}</span><p></p>
            <div className="dropdown-divider"></div>
        </div>
    );
    }
}



