/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import {
    Card,
    CardHeader,
    Collapse,
    Button,
} from "reactstrap";

import ProgressBar from "components/progressbar/progressbar";

export default function MoveStatus(){

    if (this.state.loading) {
        return null
    } else {
    return (            <Card className="card-plain">
    <CardHeader role="tab">
        <Button
            aria-expanded={this.state.openedCollapses.includes(
                "collapseFour"
            )}
            data-parent="#accordion"
            data-toggle="collapse"
            onClick={() => this.collapsesToggle("collapseFour")}>Move Status {" "}<i className="nc-icon nc-minimal-down" />
        </Button>
    </CardHeader>
    <Collapse
        role="tabpanel"
        isOpen={this.state.openedCollapses.includes(
            "collapseFour"
        )}>
        {ProgressBar.call(this)}
    </Collapse>
</Card>);
    }
}