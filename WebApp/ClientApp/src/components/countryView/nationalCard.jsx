/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {Card,CardBody} from "reactstrap";
export default function National(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0]

    if (this.state.loading) {
        return null
    } else {
    return (
        <div className="col-md-3">
           <div className="card h-100">
           <CardBody>
                <div className="text-muted font-weight-bold mb-1">National View</div>
                <div className="row">
                        <div className="col">Population:</div>
                        <div className="col float-md-right">{mcio.population}</div>
                </div>
                <div className="row mb-2">
                        <div className="col"><span>GDP:</span></div>
                        <div className="col"><span className="float-right"> </span>{mcio.gdp}</div>
                </div>
                <div className="text-muted font-weight-bold mb-1">Opportunity</div>
                <div className="row">
                        <div className="col-md-8"><span>TAM (Restricted):</span></div>
                        <div className="col-md-4"><span className="float-right"></span>{mcio.taM_Restricted}</div>
                </div>
                <div className="row">
                        <div className="col-md-8"><span>TAM (UnRestricted):</span></div>
                        <div className="col-md-4"><span className="float-right"></span>{mcio.taM_UNRestricted}</div>
                </div>
                <div className="row">
                        <div className="col-md-8"><span>Revenue Projection 3Y:</span></div>
                        <div className="col-md-4"><span className="float-right">{mcio.revenueProjection3Y}</span></div>
                </div>
                <div className="row">
                        <div className="col-md-8"><span>Revenue Projection 5Y:</span></div>
                        <div className="col-md-4"><span className="float-right"> {mcio.revenueProjection5Y}</span></div>
                </div>
            </CardBody>
        </div>
    </div>);
    }
}

