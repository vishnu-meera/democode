/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

import DataCenterNavBars from "components/navtab/navtabs";

export default function DataCenter(){

    if (this.state.loading) {
        return null
    } else {
    return (<div className="ml-3 mt-2">
            <span className="text-muted font-weight-bold">Data Centers</span><br/>
            <div>   
                {DataCenterNavBars.call(this)}
            </div>

        </div>);
    }
}