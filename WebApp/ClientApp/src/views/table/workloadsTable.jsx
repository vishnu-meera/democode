/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from '../../utils/utils';
import ReactTable from "react-table";
import CountryPanel from "views/components/countryPanel.jsx";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Modal,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown
} from "reactstrap";


const getTableData =(tableData)=>{
    console.log("getTableData==>",tableData)
    let data =  tableData.map((obj, key) => {
        return {
            id:key,
            workload:obj["Workloads"],
            tam:obj["TAM Awarded"]["Status"] || "No Data Available",
            dockdate:obj["Dock Date (MCIO)"]["Status"] || "No Data Available",
            rtegdate:obj["RTEG Date (MCIO)"]["Status"] || "No Data Available",
            notes:obj["Notes"] || "No Data Available",
            calender:obj["Calendar Months/Days to Deploy"] || "No Data Available",
            engineering:obj["Engineering Readiness"]|| "No Data Available"
        };
    });
    console.log("getTableData==>",data)
    return {data};
}

class WorkLoadTable extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            ...getTableData(this.props.tableData),
            modalOpen:false
        };
        this.onCellClick = this.onCellClick.bind(this);
    }

    async onCellClick(row){
        console.log("onCellClick==>",row);
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    async componentDidUpdate(prevProps) {
        if (this.props.tableData !== prevProps.tableData) {
            await this.setState({ ...getTableData(this.props.tableData) });
        }
    }
    async onClickDropDown(status){

    }

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    };

    _renderWorkLoadModal(){
        return(

                <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
                    <div className="modal-header">
                        <button
                            aria-hidden={true}
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={this.toggleModal}><i className="nc-icon nc-simple-remove" />
                        </button>
                        <h5 className="modal-title text-left" id="myModalLabel">EXO</h5>
                    </div>
                    <div className="modal-body">

                                    <ReactTable
                                        data={this.state.data}
                                        filterable
                                        columns={[
                                            {
                                                Header: "Workloads",
                                                accessor: "workload", 
                                                filterable:false,
                                                sortable:false,
                                                Cell: row => (
                                                    <span
                                                        style={{cursor:"pointer"}}
                                                        onClick={() => this.onCellClick(row)}>
                                                        {row.value}
                                                    </span>
                                                )
                                            },
                                            {
                                                Header: "TAM Awarded",
                                                accessor: "tam",
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: "Dock Date (MCIO)",
                                                accessor: "dockdate",
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: "RTEG Date (MCIO)",
                                                accessor: "rtegdate",
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: 'Notes',
                                                accessor: 'notes',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Calender Months/Days to Deploy (in Months)',
                                                accessor: 'calender',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Engineering readiness',
                                                accessor: 'engineering',
                                                filterable:false,
                                                sortable:false
                                            }
                                            ]}
                                        showPageSizeOptions = {false}
                                        defaultPageSize={5}
                                        showPaginationBottom
                                        className="-striped -highlight"
                                    />

                    </div>
                </Modal>)
    }

    render() {

        return (<div className="content">
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>WorkLoads</CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.data}
                                        filterable
                                        columns={[
                                            {
                                                Header: "Workloads",
                                                accessor: "workload", 
                                                filterable:false,
                                                sortable:false,
                                                Cell: row => (
                                                    <span
                                                        style={{cursor:"pointer"}}
                                                        onClick={() => this.onCellClick(row)}>
                                                        {row.value}
                                                    </span>
                                                )
                                            },
                                            {
                                                Header: "TAM Awarded",
                                                accessor: "tam",
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: "Dock Date (MCIO)",
                                                accessor: "dockdate",
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: "RTEG Date (MCIO)",
                                                accessor: "rtegdate",
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: 'Notes',
                                                accessor: 'notes',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Calender Months/Days to Deploy (in Months)',
                                                accessor: 'calender',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Engineering readiness',
                                                accessor: 'engineering',
                                                filterable:false,
                                                sortable:false
                                            }
                                            ]}
                                        showPageSizeOptions = {false}
                                        defaultPageSize={5}
                                        showPaginationBottom
                                        className="-striped -highlight"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {this._renderWorkLoadModal()}
                </div>);
    }
}

export default WorkLoadTable;
