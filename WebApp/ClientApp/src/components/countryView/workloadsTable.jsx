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
    Col
} from "reactstrap";

import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

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
            modelKey : "",
            isPaneOpen: false,
            isPaneOpenLeft: false
        };
        this.onCellClick = this.onCellClick.bind(this);
    }

    componentDidMount() {
        Modal.setAppElement(this.el);
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
            await this.setState({isPaneOpen: !this.state.isPaneOpen})
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

    render() {
        let css_1 = {"height":"100px"}
        return (<div className="content">
                    <div className="row">
                        <div className="col-sm-12">
                            <Card>
                                 <span className="text-muted font-weight-bold ml-2 mt-2">WorkLoads</span>
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
                                        defaultPageSize={10}
                                        showPaginationBottom
                                        className="-striped -highlight"
                                    />
                                    
                            </Card>
                        </div>
                    </div>
                    <div ref={ref => this.el = ref} className="mt-5">
                        <SlidingPane
                            style = {css_1}
                            className='mt-5'
                            isOpen={ this.state.isPaneOpen }
                            title={this.state.modelKey}
                            width='60%'
                            onRequestClose={ () => {
                                // triggered on "<" on left top click or on outside click
                                this.setState({ isPaneOpen: false });
                            } }>

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
                                        defaultPageSize={10}
                                        showPaginationBottom
                                        className="-striped -highlight"
                                    />


                    </SlidingPane>
                    </div>
                </div>);
    }
}

export default WorkLoadTable;
