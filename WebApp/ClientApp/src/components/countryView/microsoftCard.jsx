/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    Card,
    CardBody,
    Col,Row
} from "reactstrap";

export default function Microsoft(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0];
    let mcio_2 = this.state.toolTipObject[this.state.countryCode]
    if (this.state.loading) {
        return null
    } else {
    return (<Col lg="3" md="5" sm="5">
    <Card className="card-stats">
        <CardBody>
            <Row>
                <Col md="12" xs="12">
                    <span><h6>Microsoft</h6></span>
                    <span>CAPEX Status:Approved (Date) {mcio.capex} </span><br />
                    <span>Public Announcement: {mcio_2.publicAnnouncement} </span><br />
                    <span>Azure GA:{mcio_2.azureGa} </span><br />
                    <span>Office GA: {mcio_2.officeGa} </span><br />
                    <span>DCX Customers: {mcio.dcX_Customers} </span><br />
                </Col>
            </Row>
        </CardBody>
    </Card>
</Col>);
    }
}



