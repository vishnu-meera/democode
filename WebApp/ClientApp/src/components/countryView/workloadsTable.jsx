/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import ReactTable from "react-table";

import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Modal
} from "reactstrap";


const getTableData =(tableData)=>{
    console.log("getTableData==>",tableData)
    let data =  tableData.map((obj, key) => {
        return {
            id:key,
            category:obj["Workloads"].split(" ")[0] || "No Category",
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

const getWorkLoadData =(tableData)=>{
    
    let data =  tableData.map((obj, key) => {
        return {
            id:key,
            Phase: obj["Phase"] || "No available data",
            PlannedDuration: obj["Planned Duration"] || "No available data",
            PlannedFinish: obj["Planned Finish"] || "No available data",
            PlannedStart: obj["Planned Start"] || "No available data",
            Remarks: obj["Remarks"] || "No available data",
            RevisedDuration: obj["Revised Duration"] || "No available data",
            RevisedFinish: obj["Revised Finish"] || "No available data",
            RevisedStart:  obj["Revised Start"] || "No available data",
            Status: obj["Status"] || "No available data"
        };
    });
    console.log("getWorkLoadData==>",data)
    return data;
}

class WorkLoadTable extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            ...getTableData(this.props.tableData),
            modalOpen:false,
            modelData:[],
            modelKey : ""
        };
        this.onCellClick = this.onCellClick.bind(this);
    }

    async onCellClick(e){
        let modelKey  =  e.row.category;
        let workloadObj = this.props.workloadobject.countryWorkLoads;
        console.log("onCellCLick==>", workloadObj)
        let phases  = workloadObj.filter(x=>x.workLoadName===modelKey);
        if(phases.length>0){
            console.log("onCellCLick==>", getWorkLoadData(JSON.parse(phases[0].phases)))
            let modelData = getWorkLoadData(JSON.parse(phases[0].phases))
            await this.setState({modelData,modelKey});
            await this.setState({            modalOpen: !this.state.modalOpen,})
        }
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

                <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal} size={"lg"}>
                    <div className="modal-header">
                        <button
                            aria-hidden={true}
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={this.toggleModal}><i className="nc-icon nc-simple-remove" />
                        </button>
                        <h5 className="modal-title text-left" id="myModalLabel">{this.state.modelKey}</h5>
                    </div>
                    <div className="modal-body">
                                    <ReactTable
                                        data={this.state.modelData}
                                        filterable
                                        columns={[
                                            {
                                                Header: "Phase",
                                                accessor: "Phase", 
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: "Planned Duration",
                                                accessor: "PlannedDuration",
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: "Planned Finish",
                                                accessor: "PlannedFinish",
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: "Planned Start",
                                                accessor: "PlannedStart",
                                                filterable:false,
                                                sortable:false,
                                            },
                                            {
                                                Header: 'Remarks',
                                                accessor: 'Remarks',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Revised Duration',
                                                accessor: 'RevisedDuration',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Revised Finish',
                                                accessor: 'RevisedFinish',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Revised Start',
                                                accessor: 'RevisedStart',
                                                filterable:false,
                                                sortable:false
                                            },
                                            {
                                                Header: 'Status',
                                                accessor: 'Status',
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
                                                Header: "Worload Category",
                                                accessor: "category", 
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
                                                Header: "Workloads",
                                                accessor: "workload", 
                                                filterable:false,
                                                sortable:false
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
