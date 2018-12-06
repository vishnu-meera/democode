/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { Card,CardBody,CardTitle,Row,Col} from "reactstrap";

export default function Cards(){
    let keys = Object.keys(this.state.cardsStatus.countriesStatusList);
    
    let cardwithData = keys.map((key) => {
        let iconcss = `${this.utils.cardIconCssObj[key]} ${this.utils.textIconCssObj[key]}`;
        let textcss = `text-left ${this.utils.textIconCssObj[key]}`;
        let btnvcss = `card-stats btn btn-none ${this.state.cardActiveKey===key?'active':null}`;
        return (
            <Col lg="3" md="4" sm="4" key={key}>
                <Card 
                    className= {btnvcss}
                    onClick={()=>{this.onCardClick(key)}}>
                    <CardBody>
                        <Row>
                            <Col md="4" xs="5">
                                <div className="icon-big text-center">
                                    <i className={iconcss}/>
                                </div>
                            </Col>
                            <Col md="8" xs="7">
                                <div className="numbers">
                                    <h5 className="card-category text-left">{key}</h5>
                                    <CardTitle tag="p" className={textcss}>{this.state.cardsStatus.countriesStatusList[key]}</CardTitle>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        );
    });

    console.log("Cards===>",cardwithData);

    return (<Row>
        {cardwithData.filter(x=>x.key==="Live")} 
        {cardwithData.filter(x=>x.key==="InProgress")} 
        {cardwithData.filter(x=>x.key==="Approved")} 
        {cardwithData.filter(x=>x.key==="Potential")} 
    </Row>);
}