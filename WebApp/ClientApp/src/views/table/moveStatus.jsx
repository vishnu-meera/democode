import React from "react";

// react component for creating dynamic tables
import ReactTable from "react-table";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col
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
