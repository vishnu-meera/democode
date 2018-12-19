/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";

import {
    CardBody,
    Progress
} from "reactstrap";

export default function ProgressBar() {
    //console.log("ProgressBar movestatusprogress", this.state.moveStatusObject)
    let movestatusprogress = Object.keys(this.state.moveStatusObject).map(key=>{
        //console.log(this.state.moveStatusObject[key].toString())
        let progress = {
            width: `${this.state.moveStatusObject[key].toString()}%`
          }
        return (<div key ={key}>
            <div className="row">
                <div className="col-sm-6"><span className="text-muted">{key}</span></div>
                <div className="col-sm-6"><span className="text-muted float-right">In Progress ({this.state.moveStatusObject[key].toString()}%)</span></div>
            </div>
            <Progress max="100"  className="progress" style={progress}/>
            <p></p>
            </div>
        );
    })

    return(<CardBody>{movestatusprogress}</CardBody>);
};