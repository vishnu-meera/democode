/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import ProgressBar from "components/progressbar/progressbar";
import DataCenterCard from "components/navtab/navtabs";

class MovestatusDatacenter extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.state = {
            country: this.props.country,
            status:this.props.status,
            loading:false,
            moveStatusObject:this.props.moveStatusObject,
            dataCentersObject:this.props.dataCentersObject,
            horizontalTabs: "home",
        };
    }

    dataCenterNavClicked = async (e,dataCenterObj)=>{
        await this.props.getDataCenterObject(dataCenterObj);
    }

    toggleDC(dcCode){
        let horizontalTabs ="";
        if(this.state.horizontalTabs !== dcCode){
            horizontalTabs = dcCode
        }
        this.setState({ horizontalTabs})
    }
    

    async componentDidUpdate(prevProps) {
        if (this.props.moveStatusObject !== prevProps.moveStatusObject || this.props.dataCentersObject !== prevProps.dataCentersObject ) {
            await this.setState({loading:true});
            let dataCentersObject = this.props.dataCentersObject;
            let moveStatusObject = this.props.moveStatusObject;
            await this.setState({dataCentersObject, moveStatusObject,loading:false});
        }
    }
    _renderDCCard(){
        return(<>{DataCenterCard.call(this)}</>);
    };

    _renderMoveStatus(){
        return(<div>
                <span><h6>Move Status</h6></span>
                {ProgressBar.call(this)}
            </div>);
    };

    render(){
        if(this.props.status === "Live"){
        return(<div>
            {this._renderMoveStatus()}
            <br /><br />
            {this._renderDCCard()}
        </div>);
        }else if(this.props.status === "InProgress"){
            return(<div>
                {this._renderDCCard()}
            </div>);
        }else return null;
    }

}

export default MovestatusDatacenter;
