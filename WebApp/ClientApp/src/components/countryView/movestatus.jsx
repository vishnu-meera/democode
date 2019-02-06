/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { Progress } from "reactstrap";
import {Card,CardBody} from "reactstrap";

export default function MoveStatus() {

    let movestatusprogress = Object.keys(this.state.moveStatusObject).map(key=>{
        let progress = {
            width: `${this.state.moveStatusObject[key].toString()}%`
          }
        return (
            <div key ={key}>
                <div className="row">
                    <div className="col-md-6"><span className="text-muted">{key}</span></div>
                    <div className="col-md-6"><span className="text-muted float-right">In Progress ({this.state.moveStatusObject[key].toString()}%)</span></div>
                </div>
                <Progress max="100"  className="progress" style={progress}/>
                <p></p>
            </div>
        );
    })

    return(<div className="col-md-4">
                <div className="card h-100">
                    <CardBody>
                    <span className="text-muted font-weight-bold mb-1">Move Status</span><br/>
                    {movestatusprogress}
                    </CardBody>
                </div>
            </div>);
};