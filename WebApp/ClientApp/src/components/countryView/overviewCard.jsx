/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    Card,
    Col,
    CardBody,
    Row,
    CardFooter,
} from "reactstrap";

export default function Overview(){
    let css_1 = {"width":"50%"};
    let css_2 = {fontSize:"1rem"}

    if (this.state.loading) {
        return null
    } else {
    return (
        <div className="col-md-2">

                <span className="text-muted font-weight-bold h5">{this.state.country}</span><br/>
                <img src={this.state.imgUri} alt={this.state.country} style={css_1}/><br/>
                <span style={css_2}>{this.state.status}
                    <span style={{
                        color: this.state.status === 'InProgress' ? '#FF9933'
                            : this.state.status === 'Live' ? '#6600CC'
                                : this.state.status === 'Potential' ? '#00FFFF'
                                    : this.state.status === 'Approved' ? '#00CC00' : "Black",
                        transition: 'all .10s ease',
                        fontSize:"1.5rem"
                    }}> 
                        &#x25cf;
                    </span>
                </span>

        </div>);
    }
}