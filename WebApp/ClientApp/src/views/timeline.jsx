/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import PopoverItem from "components/countryView/popoverItem"
import Utils from 'utils/utils';
import Auth from 'utils/authhelper';
import Spinner from "components/spinner/spin";
import { Link } from "react-router-dom";
import {
    Card
} from "reactstrap";

class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.auth = new Auth();
        this.counter =0;
        this.state = {
            loading:true,
            ruleTable:[],
            timelinelist:null
        };
    }

    async componentDidMount() {
        let {authenticated,token} = await this.auth.isAuthenticated();
        if(authenticated){
            if (this.state.loading) {
                let ruleTable = await this.utils.getRuleTable(token);
                let timelinelist = await this.utils.getAllTimelineList(token);
                await this.setState({timelinelist,ruleTable });
            }
            await this.setState({loading: false });
        }else{
            console.log("timeline===> not authenticated");
            this.props.history.push("/admin");
        }
    }

    timeline = (timeLine)=>{
        let rules = this.state.ruleTable.ruleTable;
        let length = timeLine.length;
        let lastelementcss = false;
        const timeLineArray = timeLine.map((obj,key)=>{
            console.log("key====>",++this.counter)
            if(length===key+1)
                lastelementcss = true;
            let rule = rules.filter(x=>x.ruleName===obj.Name.replace(/\s/g,'').toLocaleLowerCase())[0];
            return (<PopoverItem key={++this.counter} 
                                id={++this.counter} 
                                keyprop={key} obj={obj} 
                                rules = {rule?JSON.parse(rule.impact):null} 
                                lastelementcss={lastelementcss} notshowbottombox={true}/>);   
              
        });

        return timeLineArray;
    }

    _renderTimeLineAndPopOver(){

        let timelineListArray = this.state.timelinelist.timelineListObject;
    
        const timeLineArray = timelineListArray.map((obj,key)=>{
            console.log("firstObject===>",obj,key)
            return(<div key={key}>
                    <span className="text-muted font-weight-bold ml-2 mt-3">{obj["countryName"]}</span>
                    <div className='htimeline ml-5'>
                        {this.timeline(JSON.parse(obj["timelineObject"]))}
                    </div>
                </div>);
        });

        return timeLineArray;
    };

    render() {
        let css_2= {"backgroundColor":"#F9F9FB"};
        if (this.state.loading) {
            return (<div className="content">
            {Spinner.call(this)}
        </div>)
        } else {
            return (
                <div className="content pt-2 pb-2 ml-5 mr-5">
                    <div className="row"> 
                        <div className="col-sm-12">
                            <span className="text-muted font-weight-bold">
                                <h6>
                                    <Link to={{ pathname: '/admin/dashboard' }}>Dashboard</Link>
                                </h6>
                            </span>
                        </div>
                    </div>
                    <div className="row"> 
                        <div className="col-sm-12">
                            <span className="text-muted font-weight-bold">
                                <h6>
                                    Timelines of In Progress Countries
                                </h6>
                            </span>
                        </div>
                    </div>
                    <div className="row mt-1" style={css_2}>
                        <div className="col-sm-12">
                            <Card className="stats">
                            {this._renderTimeLineAndPopOver()}
                            </Card>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Timeline;