import React from "react";

// react component for creating dynamic tables
import ReactTable from "react-table";
import CountryPanel from "views/components/countryPanel.jsx";
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

class CountryTables extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.data
        this.state = {
            data: this.data.map((prop, key) => {
                return {
                    id: key,
                    country:prop[0],
                    population: prop[1],
                    gdp: prop[2],
                    status: prop[3],
                    name: prop[0]
                };
            }),
            country: this.data[0][0],
            population: this.data[0][1],
            gdp: this.data[0][2],
            status: this.data[0][3]
        };
        this.submitClick = this.submitClick.bind(this);
    }

    async submitClick(e){
        console.log(e.row)
        let country = e.row.country;
        let population = e.row.population;
        let gdp = e.row.gdp
        let status = e.row.status
        await this.setState({ country, population, gdp, status });
    }


    render() {
        return (<div className="content">
                    <Row>
                        <Col md="8">
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h5">Go Local Country Table</CardTitle>
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
                                                sortable:false
                                            },
                                            {
                                                Header: "GDP",
                                                accessor: "gdp",
                                                sortable: false
                                            },
                                            {
                                                Header: 'Status',
                                                accessor: 'status',
                                                Cell: row => (
                                                    <span>
                                                        <span style={{
                                                              color : row.value === 'InProgress' ? '#FF9933'
                                                                    : row.value === 'Live' ? '#6600CC'
                                                                    : row.value === 'Potential' ? '#00FFFF'
                                                                    : row.value === 'Approved' ? '#00CC00' :"Black",
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
                                        className="-striped -highlight"
                                    />
                                </CardBody>
                            </Card>
                </Col>
                        <Col md="4">
                    <CountryPanel country={this.state.country} gdp={this.state.gdp} status={this.state.status} population={this.state.population} />
                        </Col>
                    </Row>
                </div>);
    }
}

export default CountryTables;
