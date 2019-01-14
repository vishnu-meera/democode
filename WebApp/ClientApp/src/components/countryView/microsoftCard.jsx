/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {Card,CardBody} from "reactstrap";
export default function Microsoft(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0];
    let mcio_2 = this.state.toolTipObject[this.state.countryCode]

    if (this.state.loading) {
        return null
    } else {
    return (<div className="col-md-3">
    <div className="card h-100">
        <CardBody>
            <div className="text-muted font-weight-bold mb-1">Microsoft</div>
            <div className="row">
                    <div className="col-md-8"><span>CAPEX Approved:</span></div>
                    <div className="col-md-4"><span className="float-right">{mcio.capex}</span></div>
            </div>
            <div className="row">
                    <div className="col-md-8"><span>Public Announcement:</span></div>
                    <div className="col-md-4"><span className="float-right"> {mcio_2.publicAnnouncement}</span></div>
            </div>
            <div className="row">
                    <div className="col-md-8"><span>Azure GA:</span></div>
                    <div className="col-md-4"><span className="float-right">{mcio_2.azureGa}</span></div>
            </div>
            <div className="row">
                    <div className="col-md-8"><span>Office GA:</span></div>
                    <div className="col-md-4"><span className="float-right">{mcio_2.officeGa}</span></div>
            </div>
            <div className="row">
                    <div className="col-md-8"><span>DCX Customers:</span></div>
                    <div className="col-md-4"><span className="float-right">{mcio.dcX_Customers}</span></div>
            </div>
        </CardBody>
    </div>
    </div>);
    }
}





