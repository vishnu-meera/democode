/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { Progress } from "reactstrap";

export default function MoveStatus() {
    let css_1 = {"backgroundColor":"white"};
    let movestatusprogress = Object.keys(this.state.moveStatusObject).map(key=>{
        //console.log(this.state.moveStatusObject[key].toString())
        let progress = {
            width: `${this.state.moveStatusObject[key].toString()}%`
          }
        return (
            <div key ={key} className="ml-2 mr-2 mb-2" style={css_1}>
                <div className="row">
                    <div className="col-sm-6"><span className="text-muted">{key}</span></div>
                    <div className="col-sm-6"><span className="text-muted float-right">In Progress ({this.state.moveStatusObject[key].toString()}%)</span></div>
                </div>
                <Progress max="100"  className="progress" style={progress}/>
                <p></p>
            </div>
        );
    })

    return(<div className="col-sm-4">
                <div style={css_1}> 
                    <span className="text-muted font-weight-bold ml-2 mt-2">Move Status</span><br/>
                    {movestatusprogress}
                </div>
            </div>);
};
    