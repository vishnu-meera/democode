/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import { VectorMap } from "react-jvectormap";
import { Card,CardBody,Row,Col} from "reactstrap";
import Spinner from "components/spinner/spin";

export default function WorldMap(mapFeedData,mapColorCode){
  
    if (this.state.mapLoading) {
        return (
            <div className="row">
                {Spinner.call(this)}
            </div>
        );
    } else {
        return (
            <div className="row">
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
                                    onRegionClick={(e,code)=>{this.handleClick(e,code)}} 
                                    onRegionTipShow = {(e,tip,code)=>{this.showCustomToolTip(e,tip,code)}}
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
                                        }
                                    }}
                                    regionsSelectable={true}
                                    series={{
                                        regions: [
                                            {
                                                values: mapFeedData,  //this is your data
                                                scale: mapColorCode,  //your color game's here
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
        </div>);
    }
}