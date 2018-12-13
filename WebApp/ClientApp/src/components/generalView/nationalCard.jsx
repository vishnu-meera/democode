/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Collapse,
    Button,
} from "reactstrap";

export default function NATIONAL(){

    let mcio = this.props.CountriesObject.filter(x=>x.name === this.state.country)[0]

    if (this.state.loading) {
        return null
    } else {
    return (<Card className="card-plain">
    <CardHeader role="tab">
        <Button
            aria-expanded={this.state.openedCollapses.includes(
                "collapseOne"
            )}
            data-parent="#accordion"
            data-toggle="collapse"
            onClick={() => this.collapsesToggle("collapseOne")}>National View {" "}<i className="nc-icon nc-minimal-down" />
        </Button>
    </CardHeader>
    <Collapse
        role="tabpanel"
        isOpen={this.state.openedCollapses.includes(
            "collapseOne"
        )}>
        <CardBody>
            <p>Population:{mcio.population}</p>
            <p>GDP: {mcio.gdp}</p>
        </CardBody>
    </Collapse>
    </Card>);
    }
}



