import React from "react";
import Utils from '../../utils/utils';
import { VectorMap } from "react-jvectormap";
import CountryTables from "views/table/countryTable.jsx";
// reactstrap components
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

const cardIconCssObj = {
    "Potential": "nc-icon nc-bulb-63", 
    "Approved": "nc-icon nc-check-2",
    "In-Progress": "nc-icon nc-cloud-download-93",
    "Live":"nc-icon nc-compass-05"
};
const textIconCssObj = {
    "Potential": "text-info",
    "Approved": "text-success",
    "In-Progress": "text-warning",
    "Live": "text-error"
};

//sample color cording scheme for country
//Potential==> number 4
//Live==> 1
//Approved==> 3
//InProgress==2

const mapData = {
    AU: 4,
    IN: 1,
    CA: 4,
    SA: 1,
    CN: 2,
    US: 3
};

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            loading : true,
            cardsStatus: {}
        };
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        if (this.state.loading) {
            let cardsStatus = await this.utils.getCountriesStatus();
            console.log(cardsStatus)
            this.setState({ cardsStatus ,loading:false})
        }
    }

    handleClick =()=>{

    }
    cards = () => {
        let keys = Object.keys(this.state.cardsStatus.countriesStatusList);
        console.log(this.state.cardsStatus.countriesStatusList)
        return (<Row>
            {
                keys.map((key) => {
                    let iconcss = `${cardIconCssObj[key]} ${textIconCssObj[key]}`;
                    let textcss = `text-left ${textIconCssObj[key]}`;
                    return (
                        <Col lg="3" md="4" sm="4" key={key}>
                            <Card className="card-stats">
                                <CardBody>
                                    <Row>
                                        <Col md="4" xs="5">
                                            <div className="icon-big text-center">
                                                <i className={iconcss}/>
                                            </div>
                                        </Col>
                                        <Col md="8" xs="7">
                                            <div className="numbers">
                                                <p className="card-category text-left">{key}</p>
                                                <CardTitle tag="p" className={textcss}>{this.state.cardsStatus.countriesStatusList[key]}</CardTitle>
                                                <p />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })
            }
        </Row>);
    }

    worldmap = () => {
        return (<Row>
            <Col md="12">
                <Card>
                    <CardBody>
                        <Row>
                            <Col className="ml-auto mr-auto" md="12">
                                <VectorMap
                                    map={"world_mill"}
                                    backgroundColor="transparent" //change it to blue !!!
                                    zoomOnScroll={false}
                                    containerStyle={{
                                        width: "100%",
                                        height: "300px"
                                    }}
                                    onRegionClick={this.handleClick}  //gets the country code
                                    containerClassName="map"
                                    regionStyle={{
                                        initial: {
                                            fill: "#e4e4e4",
                                            "fill-opacity": 0.9,
                                            stroke: "none",
                                            "stroke-width": 0,
                                            "stroke-opacity": 0
                                        },
							            hover: {
                                            "fill-opacity": 0.8,
                                            cursor: 'pointer'
                                        },
                                        selected: {
                                            fill: '#2938bc'  //what colour clicked country will be
                                        },
                                        selectedHover: {
                                        }
                                    }}
                                    regionsSelectable={true}
                                    series={{
                                        regions: [
                                            {
                                                values: mapData,  //this is your data
                                                scale: ["#CC99FF", "#66CC00", "#FF9933" ,"#00FFFF"],  //your color game's here
                                                normalizeFunction: "polynomial"
                                            }
                                        ]
                                    }}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>);
    }

    render() {
        if (this.state.loading) {
            return null
        } else {
            return (
                <>
                    <div className="content">
                        {this.cards()}
                        {this.worldmap()}
                        <CountryTables />
                    </div>
                </>
            );
        }
    }
}

export default Dashboard;
