/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { Progress } from "reactstrap";
import {Card,CardBody} from "reactstrap";

export default function MoveStatus() {
    let css_1 = {"height":"13rem"};
    let movestatusprogress = Object.keys(this.state.moveStatusObject).map(key=>{
        //console.log(this.state.moveStatusObject[key].toString())
        let progress = {
            width: `${this.state.moveStatusObject[key].toString()}%`
          }
        return (
            <div key ={key}>
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
                <Card style={css_1}> 
                    <CardBody>
                    <span className="text-muted font-weight-bold">Move Status</span><br/>
                    {movestatusprogress}
                    </CardBody>
                </Card>
            </div>);
};