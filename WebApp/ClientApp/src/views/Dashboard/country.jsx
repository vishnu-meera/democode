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

class Country extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        const { country } = props.location.state
        console.log("Country Component==> :", country)
        this.state = {
            country :country,
            loading: true,
            countryCode: "",
            imgUri:""
        };
    }

    async componentDidMount() {
        if (this.state.loading) {
            let countryCode = await this.utils.getCode(this.state.country);
            let imgUri = `https://www.countryflags.io/${countryCode}/flat/64.png`;
            await this.setState({ imgUri,countryCode, loading: false })
        }
    }
    
    render() {
        if (this.state.loading) {
            return null
        } else {
            return (
            <>
            <div className="content">
                <Row> <Col md="12"><h5>Dashboard/{this.state.country}</h5></Col></Row>
                <Row>
                    <Col md="12">
                        <Card >
                            <Col md="3">   
                                <div>
                                    <div>{this.state.country}</div>
                                    <div><img src={this.state.imgUri} alt={this.state.country} /></div>
                                    <div>Status:Live</div>
                                </div>
                            </Col>
                            <Col md="3">
                            </Col>
                            <Col md="3">
                            </Col>
                            <Col md="3">
                            </Col>
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