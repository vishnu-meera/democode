/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {Card,CardBody} from "reactstrap";
export default function National(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0]
    let css_1 = {"height":"13rem"}
    if (this.state.loading) {
        return null
    } else {
    return (
        <div className="col-sm-3">
            <Card style={css_1}>
                <CardBody>
                    <div className="text-muted font-weight-bold">National View</div>
                    <div className="">Population&emsp;&emsp;: {mcio.population}</div>
                    <div className="">GDP&emsp;&emsp;: {mcio.gdp}</div>
                    <p></p>
                    <div className="text-muted font-weight-bold">Opportunity</div>
                    <div className="">TAM (Restricted)&emsp;&emsp;: {mcio.taM_Restricted}</div>
                    <div className="">TAM (UnRestricted)&emsp;&emsp;: {mcio.taM_UNRestricted}</div>
                    <div className="">Revenue Projection 3Y &emsp;&emsp;: {mcio.revenueProjection3Y}</div>
                    <div className="">Revenue Projection 5Y &emsp;&emsp;: {mcio.revenueProjection5Y}</div>
                </CardBody>
            </Card>
    </div>);
    }
}

