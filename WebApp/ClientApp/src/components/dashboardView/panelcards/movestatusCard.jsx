/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import ProgressBar from "components/progressbar/progressbar";

export default function MoveStatus(){

    if (this.state.loading) {
        return null
    } else {
    return (<div className="ml-3 mt-2">
            <span className="text-muted font-weight-bold">Move Status</span><br/>
            {ProgressBar.call(this)}
            <p></p>
            <div className="dropdown-divider"></div>
        </div>);
    }
}