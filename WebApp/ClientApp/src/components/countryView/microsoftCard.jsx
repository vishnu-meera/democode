/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {Card,CardBody} from "reactstrap";
export default function Microsoft(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0];
    let mcio_2 = this.state.toolTipObject[this.state.countryCode]
    let css_1 = {"height":"13rem"}
    if (this.state.loading) {
        return null
    } else {
    return (<div className="col-sm-3">
    <Card style={css_1}>
        <CardBody>
            <div className="text-muted font-weight-bold">Microsoft</div>
            <div className="">CAPEX Approved &emsp;&emsp;: {mcio.capex} </div>
            <div className="">Public Announcement &emsp;&emsp;: {mcio_2.publicAnnouncement} </div>
            <div className="">Azure GA &emsp;&emsp;:{mcio_2.azureGa}</div>
            <div className="">Office GA&emsp;&emsp;: {mcio_2.officeGa} </div>
            <div className="">DCX Customers&emsp;&emsp;: {mcio.dcX_Customers} </div><br /><br/> <br/>
        </CardBody>
    </Card>
    </div>);
    }
}





