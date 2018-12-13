/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Collapse,
    Button,
} from "reactstrap";

export default function MCIO(){

    let mcio = this.props.CountriesObject.filter(x=>x.name === this.state.country)[0]
    let mcio_2 = this.props.toolTipObject[this.props.countryCode]

    if (this.state.loading) {
        return null
    } else {
    return (<Card className="card-plain">
        <CardHeader role="tab">
            <Button
                aria-expanded={this.state.openedCollapses.includes(
                    "collapseThree"
                )}
                data-parent="#accordion"
                data-toggle="collapse"
                onClick={() => this.collapsesToggle("collapseThree")}>Microsoft {" "}<i className="nc-icon nc-minimal-down" />
            </Button>
        </CardHeader>
        <Collapse
            role="tabpanel"
            isOpen={this.state.openedCollapses.includes(
                "collapseThree"
            )}>
            <CardBody>
                <p>CAPEX Status: Approved (Date) {mcio.capex}</p>
                <p>Public Announcement: {mcio_2.publicAnnouncement}</p>
                <p>Azure GA:{mcio_2.azureGa}</p>
                <p>Office GA: {mcio_2.officeGa}</p>
                <p>Revenue Projection 3Y:{mcio.revenueProjection3Y}</p>
                <p>Revenue Projection 5Y: {mcio.revenueProjection5Y}</p>
                <p>DCX Customers: {mcio.dcX_Customers}</p>
            </CardBody>
        </Collapse>
     </Card>);
    }
}