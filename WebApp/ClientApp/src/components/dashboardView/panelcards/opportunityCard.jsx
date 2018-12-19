/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

export default function Opportunity(){

    let mcio = this.props.CountriesObject.filter(x=>x.name === this.state.country)[0]

    if (this.state.loading) {
        return null
    } else {
    return (
            <div className="ml-3 mt-2">
                <span className="text-muted font-weight-bold">Opportunity</span><br/>
                <span>TAM (Restricted) : {mcio.taM_Restricted}</span><br/>
                <span>TAM (UnRestricted) : {mcio.taM_UNRestricted}</span><p></p>
            <div className="dropdown-divider"></div>
        </div>);
    }
}