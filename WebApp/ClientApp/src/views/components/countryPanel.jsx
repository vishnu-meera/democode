import React from "react";
import Utils from '../../utils/utils';
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Collapse,
    Button,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    FormGroup,
    Progress,
    Row,
    Col
} from "reactstrap";

import ProgressBar from "views/components/progressbar.jsx"
import DataCenterNavBars from "views/components/navtabs.jsx"

class CountryPanel extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        console.log("datacentersobject==>", this.props.dataCentersObject)
        this.state = {
            country: this.props.country,
            status:this.props.status,
            horizontalTabs: "home",
            verticalTabs: "info",
            pageTabs: "homePages",
            loading: true,
            openedCollapses: ["collapseOne"],
            microsoft: {},
            redirect:false,
            moveStatusObject:{},
            dataCentersObject:{}
            
        };
    };

    dataCenterNavClicked = async (e,dataCenterObj)=>{
        //console.log("dataCenterNavClicked==> ",e);
       console.log("dataCenterNavClicked==> ",dataCenterObj);
    }

    async componentDidMount() {
        if (this.state.loading) {
            console.log("DATA CENTER OBJECT.....$$$",this.props.status,this.utils.statusToShowDc);
            let microsoft = await this.utils.getMicrosoftObject(this.state.country);
            console.log("componentDidMount===>",this.props.status)
            if(this.utils.statusToShowDc!==this.props.status){
                let { moveStatusObject} = await this.utils.geMoveStatusObject(this.props.country);
                await this.setState({moveStatusObject});
            }else{
                console.log("DATA CENTER OBJECT.....$$$");
                let dataCentersObject  =await this.utils.getDataCenterObject(this.props.country);
                console.log("DATA CENTER OBJECT....$$$.", dataCentersObject);
                await this.setState({dataCentersObject,horizontalTabs:dataCentersObject[0].dcCode});
            }

            await this.setState({ microsoft,loading: false});
        }
    }

    async componentDidUpdate(prevProps) {
        
        if (this.props.country !== prevProps.country) {
            await this.setState({ loading: true});
            console.log("DATA CENTER OBJECT.....$$$##",this.props.status,this.utils.statusToShowDc);
            let microsoft = await this.utils.getMicrosoftObject(this.props.country);

            if(this.utils.statusToShowDc!==this.props.status){
                let { moveStatusObject} = await this.utils.geMoveStatusObject(this.props.country);
                await this.setState({moveStatusObject});
            }else{
                console.log("DATA CENTER OBJECT.....$$$##");
                let dataCentersObject  =await this.utils.getDataCenterObject(this.props.country);
                console.log("DATA CENTER OBJECT.....$$$##", dataCentersObject);
                await this.setState({dataCentersObject,horizontalTabs:dataCentersObject[0].dcCode});
            }

            await this.setState({ 
                microsoft, 
                country: this.props.country, 
                status: this.props.status ,
                loading:false
            });
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

    loadDataCenters = () =>{
        return (this.state.status!==this.utils.statusToShowDc)?null :
         (
            <Card className="card-plain">
                <CardHeader role="tab">
                    <Button
                        aria-expanded={this.state.openedCollapses.includes(
                            "collapseFour"
                        )}
                        data-parent="#accordion"
                        data-toggle="collapse"
                        onClick={() => this.collapsesToggle("collapseFour")}>Data Centers{" "}<i className="nc-icon nc-minimal-down" />
                    </Button>
                </CardHeader>
                <Collapse
                    role="tabpanel"
                    isOpen={this.state.openedCollapses.includes(
                        "collapseFour"
                    )}>
                    {DataCenterNavBars.call(this)}
                </Collapse>
            </Card>);
    };

    loadMoveStatus = () => {
        return (this.state.status===this.utils.statusToShowDc)?null :
         (
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
                    {ProgressBar.call(this)}
                </Collapse>
            </Card>);
    }
    

    render() {
        console.log("CountryPanel render===>",this.props.status);
        if(this.state.loading){
            return null
        }else{
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
                        {this.loadDataCenters()}
                        <Card className="card-plain text-center">
                            <Link
                                className="btn btn-primary text-center"
                                to={{ pathname: '/country', state: { country: this.props.country, status: this.props.status} }}
                            >See Seats Updates</Link>
                        </Card>
                    </div>
                </CardBody>
            </Card>);
        }
    }
}

export default CountryPanel;