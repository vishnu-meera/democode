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

    if (this.state.loading) {
        return null
    } else {
    return (
    <Col lg="3" md="5" sm="5">
    <Card className="card-stats">
        <CardBody>
            <Row>
                <Col md="8" xs="7">
                    <span><h5>{this.state.country}</h5></span>
                    <div><img src={this.state.imgUri} alt={this.state.country} /></div>
                </Col>
            </Row>
        </CardBody>
        <CardFooter>
            <div className="stats">
                <span>Status : </span><br />
                <span>
                    {
                        this.state.status
                    }
                    <span style={{
                        color: this.state.status === 'InProgress' ? '#FF9933'
                            : this.state.status === 'Live' ? '#6600CC'
                                : this.state.status === 'Potential' ? '#00FFFF'
                                    : this.state.status === 'Approved' ? '#00CC00' : "Black",
                        transition: 'all .5s ease'
                    }}>
                        &#x25cf;
</span>
                </span>
            </div>
        </CardFooter>
    </Card>
</Col>);
    }
}