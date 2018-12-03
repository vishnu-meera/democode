import React from "react";
import Utils from '../../utils/utils';
import { VectorMap } from "react-jvectormap";
import CountryTables from "views/table/countryTable.jsx";
import { Card,CardBody,CardTitle,Row,Col} from "reactstrap";


//sample color cording scheme for country
//Potential==> number 4
//Live==> 1
//Approved==> 3
//InProgress==2

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            loading : true,
            cardsStatus: {},
            mapData: {},
            tableData: {}
        };
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        if (this.state.loading) {
            let cardsStatus = await this.utils.getCardsData();
            let { mapData, tableData } = await this.utils.getMapData();
            console.log(tableData)
            console.log("mapData==> ", mapData)
            this.setState({ cardsStatus, mapData,tableData,loading:false})
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
                    let iconcss = `${this.utils.cardIconCssObj[key]} ${this.utils.textIconCssObj[key]}`;
                    let textcss = `text-left ${this.utils.textIconCssObj[key]}`;
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
                                                values: this.state.mapData,  //this is your data
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
                        <CountryTables data={this.state.tableData} />
                    </div>
                </>
            );
        }
    }
}

export default Dashboard;
