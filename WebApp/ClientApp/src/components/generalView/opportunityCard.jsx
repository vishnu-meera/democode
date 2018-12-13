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

export default function Opportunity(){

    let mcio = this.props.CountriesObject.filter(x=>x.name === this.state.country)[0]

    if (this.state.loading) {
        return null
    } else {
    return (<Card className="card-plain">
    <CardHeader role="tab">
        <Button
            aria-expanded={this.state.openedCollapses.includes(
                "collapseTwo"
            )}
            data-parent="#accordion"
            data-toggle="collapse"
            onClick={() => this.collapsesToggle("collapseTwo")}>Opportunity {" "}<i className="nc-icon nc-minimal-down" />
        </Button>
    </CardHeader>
    <Collapse
        role="tabpanel"
        isOpen={this.state.openedCollapses.includes(
            "collapseTwo"
        )}>
        <CardBody>
            <p>TAM (Restricted) : {mcio.taM_Restricted}</p>
            <p>TAM (UnRestricted) : {mcio.taM_UNRestricted}</p>
        </CardBody>
    </Collapse>
</Card>);
    }
}