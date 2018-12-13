/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import ReactTable from "react-table";
import CountryPanel from "components/dashboardView/panel";
import { 
    Card, CardHeader, CardBody, CardTitle, Row, Col, DropdownToggle, DropdownMenu,
    DropdownItem, UncontrolledDropdown 
} from "reactstrap";
import Spinner from "components/spinner/spin";

const getTableData =(tableData)=>{
    let data =  tableData.map((prop, key) => {
        return {
            id: key,
            country:prop[0],
            population: prop[1],
            gdp: prop[2],
            status: prop[3],
            name: prop[0]
        };
    });
    let country = tableData[0][0];
    let population = tableData[0][1];
    let gdp = tableData[0][2];
    let status = tableData[0][3];

    return {data,country,population,gdp,status};
}

class CountryTables extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.data = this.props.data;
        this.state = {
            ...getTableData(this.data),
            loading:true
        };
        this.submitClick = this.submitClick.bind(this);
    }

    async submitClick(e){
        let country = e.row.country;
        let population = e.row.population;
        let gdp = e.row.gdp
        let status = e.row.status
        await this.setState({ country, population, gdp, status });
    }

    async componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.data = this.props.data;
            await this.setState({ ...getTableData(this.data) });
        }
    }

    async componentDidMount() {
        if (this.state.loading) {
            await this.setState({loading: false})
        }
    }

    async onClickDropDown(status){
        if(status==="All") await this.setState({ ...getTableData(this.data)});
        else await this.setState({ ...getTableData(this.data.filter(x=>x.includes(status))) });
    }

    render() {
        let keys = [...new Set(this.data.map(obj=>obj[3]))];
        keys.push("All");
        let dropdownItems = keys.map(status => {
            return (<DropdownItem key={status} onClick={()=>{this.onClickDropDown(status)}}>{status}</DropdownItem>);
        });
        if(this.state.loading)
            return (
                <div className="content">
                    {Spinner.call(this)}
                </div>
            )
        else{
        return (<div className="content">
                    <Row>
                        <Col md="8">
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <CardTitle className ="col-md-4 mr-auto" tag="h6">
                                            <UncontrolledDropdown>
                                                <DropdownToggle data-toggle="dropdown" type="button">
                                                    Go Local Country Table
                                                </DropdownToggle>
                                            </UncontrolledDropdown>
                                        </CardTitle>
                                        <CardTitle className ="col-md-4 ml-auto" tag="h6">
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    aria-expanded={false}
                                                    aria-haspopup={true}
                                                    caret
                                                    data-toggle="dropdown"
                                                    id="dropdownMenuButton"
                                                    type="button">
                                                    Go Local Dropdown
                                                </DropdownToggle>
                                                <DropdownMenu aria-labelledby="dropdownMenuButton" right>
                                                    {dropdownItems}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </CardTitle>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                                        data={this.state.data}
                                        filterable
                                        columns={[
                                            {
                                                Header: "Country",
                                                accessor: "country",
                                                Cell: row => (
                                                    <span
                                                        style={{cursor:"pointer"}}
                                                        onClick={() => this.submitClick(row)}>
                                                        {row.value}
                                                    </span>
                                                )
                                            },
                                            {
                                                Header: "Population",
                                                accessor: "population",
                                                filterable:false
                                            },
                                            {
                                                Header: "GDP",
                                                accessor: "gdp",
                                                filterable:false
                                            },
                                            {
                                                Header: 'Status',
                                                accessor: 'status',
                                                filterable:false,
                                                headerClassName:"text-left",
                                                Cell: row => (
                                                    <span>
                                                        <span style={{
                                                              color : this.utils.mapColorCodes[row.value],
                                                            transition: 'all .3s ease'
                                                        }}>
                                                            &#x25cf;
                                                        </span> {
                                                            row.value
                                                        }
                                                    </span>
                                                )
                                            }
                                            ]}
                                        showPageSizeOptions = {false}
                                        defaultPageSize={5}
                                        showPaginationBottom
                                        showPageJump= {true}
                                        className="-striped -highlight"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4">
                            <CountryPanel 
                                country={this.state.country} 
                                gdp={this.state.gdp} 
                                status={this.state.status} 
                                population={this.state.population} 
                                CountriesObject = {this.props.CountriesObject}
                                toolTipObject = {this.props.toolTipObject}
                                countryCode={this.utils.getCode(this.state.country)} 
                                />
                        </Col>
                    </Row>
                </div>);
        }
    }
}

export default CountryTables;
