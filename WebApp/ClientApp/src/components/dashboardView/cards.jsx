/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { Card,Row,Col} from "reactstrap";
//    font-size: 20px;
export default function Cards(){
    let keys =0;


        keys = Object.keys(this.state.cardsStatus.countriesStatusList);

        let cardwithData = keys.map((key) => {
            let iconcss = `${this.utils.cardIconCssObj[key]} ${this.utils.textIconCssObj[key]}`;
            let textcss = `text-left ${this.utils.textIconCssObj[key]} numbers`;
            let btnvcss = `card-stats btn btn-none ${this.state.cardActiveKey===key?'active':null}`;
            let cardName = key;
            cardName = (cardName==="InProgress")?"In Progress":cardName;
            return (
                <div className="col-sm"key={key} >
                    <Card 
                        className= {btnvcss}
                        onClick={()=>{this.onCardClick(key)}}>

                            <Row>
                                <Col md="4" xs="5">
                                    <div className="icon-big text-center">
                                        <i className={iconcss}/>
                                    </div>
                                </Col>
                                <Col md="8" xs="7">
                                    <h6 className="text-left text-muted">{cardName}</h6>
                                    <h6 className={textcss}>{this.state.cardsStatus.countriesStatusList[key]}</h6>
                                </Col>
                            </Row>

                    </Card>
                </div>
            );
        });
        

        return (<div className="row">
            {cardwithData.filter(x=>x.key==="Live")} 
            {cardwithData.filter(x=>x.key==="InProgress")} 
            {cardwithData.filter(x=>x.key==="Approved")} 
            {cardwithData.filter(x=>x.key==="Potential")} 
        </div>);
    
}