/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    Row,
    Col,
    CardBody,
    Card
} from "reactstrap";

export default function McioAndOpportunity(){

    let mcio = this.state.countriesObject.filter(x=>x.name === this.state.country)[0]

    if (this.state.loading) {
        return null
    } else {
    return (
        <Col lg="3" md="5" sm="5">
        <Card className="card-stats">
            <CardBody>
            <Row>
                <Col md="8" xs="7">
                    <span><h6>National View</h6></span><br />
                    <span>Population: {mcio.population}</span><br />
                    <span>GDP: {mcio.gdp}</span><br /><br />
                    <span><h6>Opportunity</h6></span><br />
                    <span>TAM (Restricted) : {mcio.taM_Restricted}</span><br />
                    <span>TAM (UnRestricted) : {mcio.taM_UNRestricted}</span><br />
                    <span>Revenue Projection 3Y: {mcio.revenueProjection3Y}</span><br />
                    <span>Revenue Projection 5Y: {mcio.revenueProjection5Y}</span><br />
                </Col>
                </Row>
            </CardBody>
        </Card>
    </Col>);
    }
}