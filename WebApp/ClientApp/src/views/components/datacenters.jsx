import React from "react";
import Utils from '../../utils/utils';

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    FormGroup,
    Progress,
    Row,
    Col
} from "reactstrap";

import MoveStatusTable from "views/table/moveStatus.jsx";
import HorizontalTimeline from 'react-horizontal-timeline';
const VALUES = ['01/01/1994', '08/31/1996', '05/02/2002']

export default class DataCentersProgress extends React.Component {

    constructor(props){
        super(props);
        this.utils = new Utils();
        this.state = {
            status:this.props.status,
            loading:true,
            value : 0,
            previous: 0
        };
    }

    async componentDidUpdate(prevProps) {
        if (this.props.status !== prevProps.status) {
            let status =this.props.status;
            await this.setState({status});
        }
    }


    render(){
        console.log("DataCentersProgress==>", this.state.status)
        return (this.state.status===this.utils.statusToShowDc)?
        (
            <Row>
                <Col sm="12">
                    <Card className="card-stats">
                        <CardHeader><h6>Overview</h6></CardHeader>
                        <CardBody>
                            <HorizontalTimeline
                                index={this.state.value}
                                indexClick={(index) => {
                                    this.setState({ value: index, previous: this.state.value });
                                }}
                                values={ VALUES }/>
            \
                            <div className='text-center'>
                                <p>iubasiububsBouyvaoUYV7wtvBUYSB7YVYV</p>  
                                {this.state.value}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        ):
        (<div>
           <CardHeader>Move Status</CardHeader>
           <CardBody>
               <Row>
                   <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"SPO"}/></Col>
                   <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"Exo"}/></Col>
                   <Col lg="4" md="5" sm="5"><MoveStatusTable workloadName={"Teams"}/></Col>
               </Row>
           </CardBody>
        </div>);
    }
};