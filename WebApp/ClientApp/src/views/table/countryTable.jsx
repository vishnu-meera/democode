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
    ["Tiger Nixon", "System Architect", "Edinburgh", "61"],
    ["Garrett Winters", "Accountant", "Tokyo", "63"],
    ["Ashton Cox", "Junior Technical Author", "San Francisco", "66"],
    ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "22"],
    ["Airi Satou", "Accountant", "Tokyo", "33"],
    ["Brielle Williamson", "Integration Specialist", "New York", "61"],
    ["Herrod Chandler", "Sales Assistant", "San Francisco", "59"],
    ["Rhona Davidson", "Integration Specialist", "Tokyo", "55"],
    ["Colleen Hurst", "Javascript Developer", "San Francisco", "39"],
    ["Sonya Frost", "Software Engineer", "Edinburgh", "23"],
    ["Jena Gaines", "Office Manager", "London", "30"],
    ["Quinn Flynn", "Support Lead", "Edinburgh", "22"],
    ["Charde Marshall", "Regional Director", "San Francisco", "36"],
    ["Haley Kennedy", "Senior Marketing Designer", "London", "43"],
    ["Tatyana Fitzpatrick", "Regional Director", "London", "19"],
    ["Michael Silva", "Marketing Designer", "London", "66"],
    ["Paul Byrd", "Chief Financial Officer (CFO)", "New York", "64"],
    ["Gloria Little", "Systems Administrator", "New York", "59"],
    ["Bradley Greer", "Software Engineer", "London", "41"],
    ["Dai Rios", "Personnel Lead", "Edinburgh", "35"],
    ["Jenette Caldwell", "Development Lead", "New York", "30"],
    ["Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "40"],
    ["Caesar Vance", "Pre-Sales Support", "New York", "21"],
    ["Doris Wilder", "Sales Assistant", "Sidney", "23"],
    ["Angelica Ramos", "Chief Executive Officer (CEO)", "London", "47"],
    ["Gavin Joyce", "Developer", "Edinburgh", "42"],
    ["Jennifer Chang", "Regional Director", "Singapore", "28"],
    ["Brenden Wagner", "Software Engineer", "San Francisco", "28"],
    ["Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "48"],
    ["Shou Itou", "Regional Marketing", "Tokyo", "20"],
    ["Michelle House", "Integration Specialist", "Sidney", "37"],
    ["Suki Burks", "Developer", "London", "53"],
    ["Prescott Bartlett", "Technical Author", "London", "27"],
    ["Gavin Cortez", "Team Leader", "San Francisco", "22"],
    ["Martena Mccray", "Post-Sales support", "Edinburgh", "46"],
    ["Unity Butler", "Marketing Designer", "San Francisco", "47"],
    ["Howard Hatfield", "Office Manager", "San Francisco", "51"],
    ["Hope Fuentes", "Secretary", "San Francisco", "41"],
    ["Vivian Harrell", "Financial Controller", "San Francisco", "62"],
    ["Timothy Mooney", "Office Manager", "London", "37"],
    ["Jackson Bradshaw", "Director", "New York", "65"],
    ["Olivia Liang", "Support Engineer", "Singapore", "64"]
];

class CountryTables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: dataTable.map((prop, key) => {
                return {
                    id: key,
                    country:prop[0],
                    population: prop[1],
                    gdp: prop[2],
                    status: prop[3],
                    name: prop[0]
                };
            })
        };
        this.submitClick = this.submitClick.bind(this);
    }

    submitClick = (e) => {
        console.log(e.row)
        this.showCountryCard(e.row)
    }

    showCountryCard = (obj) => {

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
                                                              color : row.value === 'InProgress' ? '#ff2e00'
                                                                    : row.value === 'Live' ? '#ffbf00'
                                                                    : row.value === 'Potenial' ? '#ffbf00'
                                                                    : '#57d500',
                                                            transition: 'all .3s ease'
                                                        }}>
                                                            &#x25cf;
                                                        </span> {
                                                            row.value === 'InProgress' ? 'InProgress'
                                                                : row.value === 'Live' ? 'Live'
                                                                    : row.value === 'Potenial' ? 'Potenial'
                                                                        : 'Approved'
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
                    </Row>
                </div>);
    }
}

export default CountryTables;
