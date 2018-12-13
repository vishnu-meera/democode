/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import ReactTable from "react-table";
import {
    Card,
    CardBody
} from "reactstrap";


const dataTable = [
    ["Move Deadline"],
    ["Internal EXO Target Deadline"],
    ["EXO Enrolled Tenants"],
    ["EXO Enrolled Tenant Competetion "],
    ["Migration From Regional To Local"],
    ["EXO Capacity Distribution GoLocal vs Regional"]
];

class MoveStatusTable extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data
        this.state = {
            data: dataTable.map((prop, key) => {
                return {
                    id: key,
                    workLoadName: prop[0]
                };
            }),
        };
        this.submitClick = this.submitClick.bind(this);
    }

    async submitClick(e) {

    }


    render() {
        const header = this.props.workloadName;
        return (<Card>
                <CardBody>
                    <ReactTable
                        data={this.state.data}
                        columns={[
                            {
                                Header: header,
                                accessor: "workLoadName",
                                headerStyle: { textAlign: "center",backgroundColor:"grey"}
                            }
                        ]}
                        sortable = {false}
                        showPageSizeOptions={false}
                        showPagination={false}
                        defaultPageSize= {6}
                    />
                </CardBody>
            </Card>);
    }
}

export default MoveStatusTable;
