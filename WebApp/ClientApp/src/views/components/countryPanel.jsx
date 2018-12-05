import React from "react";
import Utils from '../../utils/utils';
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Collapse,
    Button
} from "reactstrap";

class CountryPanel extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            country: this.props.country,
            status:this.props.status,
            horizontalTabs: "home",
            verticalTabs: "info",
            pageTabs: "homePages",
            loading: true,
            openedCollapses: ["collapseOne"],
            microsoft: {},
            redirect:false
        };
    };

    async componentDidMount() {
        if (this.state.loading) {
            let microsoft = await this.utils.getMicrosoftObject(this.state.country);
            await this.setState({ microsoft, loading: false });
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.country !== prevProps.country) {
            let microsoft = await this.utils.getMicrosoftObject(this.props.country);
            await this.setState({ microsoft, country: this.props.country, status: this.props.status });
        }
    }

    collapsesToggle = (collapse) => {
        let openedCollapses = this.state.openedCollapses;
        if (openedCollapses.includes(collapse)) {
            this.setState({
                openedCollapses: openedCollapses.filter(item => item !== collapse)
            });
        } else {
            openedCollapses.push(collapse);
            this.setState({
                openedCollapses: openedCollapses
            });
        }
    };


    loadMicrosoftObject = () => {
        if (this.state.loading) {
            return null
        } else {
        return (<Card className="card-plain">
            <CardHeader role="tab">
                <Button
                    aria-expanded={this.state.openedCollapses.includes(
                        "collapseThree"
                    )}
                    data-parent="#accordion"
                    data-toggle="collapse"
                    onClick={() => this.collapsesToggle("collapseThree")}>Microsoft {" "}<i className="nc-icon nc-minimal-down" />
                </Button>
            </CardHeader>
            <Collapse
                role="tabpanel"
                isOpen={this.state.openedCollapses.includes(
                    "collapseThree"
                )}>
                <CardBody>
                    <p>CAPEX Status: Approved (Date) {this.state.microsoft.capex}</p>
                    <p>Public Announcement: {this.state.microsoft.publicAnnouncement}</p>
                    <p>Azure GA:{this.state.microsoft.azureGa}</p>
                    <p>Office GA: {this.state.microsoft.officeGa}</p>
                    <p>Revenue Projection 3Y:{this.state.microsoft.revenue3Y}</p>
                    <p>Revenue Projection 5Y: {this.state.microsoft.revenue5Y}</p>
                    <p>DCX Customers: {this.state.microsoft.dcxCustomers}</p>
                </CardBody>
            </Collapse>
         </Card>);
        }
    }

    loadMoveStatus = () => {
        if (this.state.loading) {
            return null
        } else {
            return (
                <Card className="card-plain">
                    <CardHeader role="tab">
                        <Button
                            aria-expanded={this.state.openedCollapses.includes(
                                "collapseFour"
                            )}
                            data-parent="#accordion"
                            data-toggle="collapse"
                            onClick={() => this.collapsesToggle("collapseFour")}>Move Status {" "}<i className="nc-icon nc-minimal-down" />
                        </Button>
                    </CardHeader>
                    <Collapse
                        role="tabpanel"
                        isOpen={this.state.openedCollapses.includes(
                            "collapseFour"
                        )}>
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
                    </Collapse>
                </Card>);
        }

    }
    render() {
            return (<Card>
                <CardBody>
                    <div
                        aria-multiselectable={true}
                        className="card-collapse"
                        id="accordion"
                        role="tablist"
                    >
                        <CardTitle tag="h5">{this.props.country}</CardTitle>
                        <Card className="card-plain">
                            <CardHeader role="tab">
                                <Button
                                    aria-expanded={this.state.openedCollapses.includes(
                                        "collapseOne"
                                    )}
                                    data-parent="#accordion"
                                    data-toggle="collapse"
                                    onClick={() => this.collapsesToggle("collapseOne")}>National View {" "}<i className="nc-icon nc-minimal-down" />
                                </Button>
                            </CardHeader>
                            <Collapse
                                role="tabpanel"
                                isOpen={this.state.openedCollapses.includes(
                                    "collapseOne"
                                )}>
                                <CardBody>
                                    <p>Population:{this.props.population}</p>
                                    <p>GDP: {this.props.gdp}</p>
                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card className="card-plain">
                            <CardHeader role="tab">
                                <Button
                                    aria-expanded={this.state.openedCollapses.includes(
                                        "collapseTwo"
                                    )}
                                    data-parent="#accordion"
                                    data-toggle="collapse"
                                    onClick={() => this.collapsesToggle("collapseTwo")}>Opportunity {" "}<i className="nc-icon nc-minimal-down" />
                                </Button>
                            </CardHeader>
                            <Collapse
                                role="tabpanel"
                                isOpen={this.state.openedCollapses.includes(
                                    "collapseTwo"
                                )}>
                                <CardBody>
                                    <p>TAM (Restricted) :</p>
                                    <p>TAM (UnRestricted) :</p>
                                </CardBody>
                            </Collapse>
                        </Card>
                        {this.loadMicrosoftObject()}
                        {this.loadMoveStatus()}
                        <Card className="card-plain text-center">
                            <Link
                                className="btn btn-primary text-center"
                                to={{ pathname: '/admin/country', state: { country: this.props.country, status: this.props.status} }}
                            >See Seats Updates</Link>
                        </Card>
                    </div>
                </CardBody>
            </Card>);
    }
}

export default CountryPanel;