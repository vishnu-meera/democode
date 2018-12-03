import React from "react";
import Utils from '../../utils/utils';
import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip
} from "reactstrap";

import MoveStatusTable from "views/table/moveStatus.jsx";

class Country extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        const { country ,status} = props.location.state
        console.log("Country Component==> :", country)
        this.state = {
            country: country,
            status:status,
            loading: true,
            countryCode: "",
            imgUri: "",
            overViewObject:{ }
        };
    }

    async componentDidMount() {
        if (this.state.loading) {
            let countryCode = await this.utils.getCode(this.state.country);
            let imgUri = `https://www.countryflags.io/${countryCode}/flat/64.png`;
            let overViewObject = await this.utils.getOverViewObject(this.state.country)
            await this.setState({ imgUri, countryCode, loading: false, overViewObject })
        }
    }
    
    render() {
        if (this.state.loading) {
            return null
        } else {
            return (
            <>
            <div className="content">
                <Row> <Col md="12"><h6>Dashboard/{this.state.country}</h6></Col></Row>
                <Row>
                    <Col sm="12">
                        <Card className="card-stats">
                            <CardHeader>Overview</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg="3" md="5" sm="5">
                                            <Card className="card-stats">
                                                <CardBody>
                                                    <Row>
                                                        <Col md="8" xs="7">
                                                            <span><h5>{this.state.country}</h5></span>
                                                            <div><img src={this.state.imgUri} alt={this.state.country} /></div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                                <CardFooter>
                                                    <div className="stats">
                                                        <span>Status : </span><br />
                                                        <span>
                                                            {
                                                                this.state.status
                                                            }
                                                            <span style={{
                                                                color: this.state.status === 'InProgress' ? '#FF9933'
                                                                    : this.state.status === 'Live' ? '#6600CC'
                                                                        : this.state.status === 'Potential' ? '#00FFFF'
                                                                            : this.state.status === 'Approved' ? '#00CC00' : "Black",
                                                                transition: 'all .5s ease'
                                                            }}>
                                                                &#x25cf;
                                    </span>
                                                        </span>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </Col>
                                        <Col lg="3" md="5" sm="5">
                                            <Card className="card-stats">
                                                <CardBody>
                                                    <Row>
                                                        <Col md="8" xs="7">
                                                            <span><h6>National View</h6></span><br />
                                                            <span>Population:{this.state.overViewObject.nationalView.population}</span><br />
                                                            <span>GDP: {this.state.overViewObject.nationalView.gdp}</span><br /><br />
                                                            <span><h6>Opportunity</h6></span><br />
                                                            <span>TAM (Restricted) :</span><br />
                                                            <span>TAM (UnRestricted) :</span><br />
                                                            <span>Revenue Projection 3Y:</span><br />
                                                            <span>Revenue Projection 5Y:</span><br />
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg="3" md="5" sm="5">
                                            <Card className="card-stats">
                                                <CardBody>
                                                    <Row>
                                                        <Col md="12" xs="12">
                                                            <span><h6>Microsoft</h6></span>
                                                            <span>CAPEX Status:Approved (Date) {this.state.overViewObject.microsoft.capex} </span><br />
                                                            <span>Public Announcement: {this.state.overViewObject.microsoft.publicAnnouncement} </span><br />
                                                            <span>Azure GA:{this.state.overViewObject.microsoft.azureGa} </span><br />
                                                            <span>Office GA: {this.state.overViewObject.microsoft.officeGa} </span><br />
                                                            <span>DCX Customers: {this.state.overViewObject.microsoft.dcxCustomers} </span><br />
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col lg="3" md="5" sm="5">
                                            <Card className="card-stats">
                                                <CardBody>
                                                    <span><h6>Move Status</h6></span><br />
                                                    <span>SPO</span><br />
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div><br />
                                                    <span>EXO</span><br />
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div><br />
                                                    <span>Teams</span><br />
                                                    <div className="progress">

                                                        <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div><br />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12">
                    <Card className="card-stats">
                        <CardHeader>Move Status</CardHeader>
                        <CardBody>
                            <Row>
                                <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"SPO"}/></Col>
                                <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"Exo"}/></Col>
                                <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"Teams"}/></Col>
                            </Row>
                        </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            </>
            );
        }
    }
}

export default Country;