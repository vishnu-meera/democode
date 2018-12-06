import React from "react";


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

export default function ProgressBar() {
    //console.log("ProgressBar movestatusprogress", this.state.moveStatusObject)
    let movestatusprogress = Object.keys(this.state.moveStatusObject).map(key=>{
        //console.log(this.state.moveStatusObject[key].toString())
        return (<div key ={key}>
            <CardTitle tag="h6">{key}</CardTitle>
            <Progress max="100" value={this.state.moveStatusObject[key].toString()} barClassName="progress-bar-danger" />
            </div>
        );
    })

    return(<CardBody>{movestatusprogress}</CardBody>);
};