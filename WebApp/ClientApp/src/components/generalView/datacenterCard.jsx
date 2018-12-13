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

import DataCenterNavBars from "components/navtab/navtabs";

export default function DataCenter(){

    if (this.state.loading) {
        return null
    } else {
    return ( <Card className="card-plain">
    <CardHeader role="tab">
        <Button
            aria-expanded={this.state.openedCollapses.includes(
                "collapseFive"
            )}
            data-parent="#accordion"
            data-toggle="collapse"
            onClick={() => this.collapsesToggle("collapseFive")}>Data Centers{" "}<i className="nc-icon nc-minimal-down" />
        </Button>
    </CardHeader>
    <Collapse
        role="tabpanel"
        isOpen={this.state.openedCollapses.includes(
            "collapseFive"
        )}>
        {DataCenterNavBars.call(this)}
    </Collapse>
</Card>);
    }
}