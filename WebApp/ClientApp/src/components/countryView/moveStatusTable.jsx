/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import ReactTable from "react-table";

class MoveStatusTable extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data
        this.state = {
            data: this.data.map((prop, key) => {
                return {
                    id: key,
                    workLoadName: prop
                };
            }),
        };
       
    }

    render() {
        const header = this.props.workloadName;
        return (<div className="pb-1 pl-1 pr-1">
                <ReactTable
                        data={this.state.data}
                        columns={[
                            {
                                Header: header,
                                accessor: "workLoadName",
                                headerStyle: { textAlign: "center",backgroundColor:"grey"},
                                minWidth:200
                            }
                        ]}
                        sortable = {false}
                        showPageSizeOptions={false}
                       
                        showPagination={false}
                        defaultPageSize= {6}
                    />
        </div>);
    }
}

export default MoveStatusTable;
