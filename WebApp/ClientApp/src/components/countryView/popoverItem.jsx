/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/


import React from 'react';
import { Popover, PopoverHeader, PopoverBody} from 'reactstrap';

class PopoverItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
      popoverTopOpen:this.props.obj.rgb==="red"? true : false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {

    let cssPopColor = {"backgroundColor":"#fbf3f3"};
    let cssNotHide = {"display":"none"};
    let cssToBottomPopOver = this.props.notshowbottombox ? cssNotHide :cssPopColor;
    let css = `step col-sm-1 ${(this.props.obj.rgb === "none"?"none":this.props.obj.rgb)}`; //TODO ..the logic is with respect to
    let num = this.props.keyprop +1;
    let displayBlock = {"display":"block",};
    let displayNone = {"display":"none"};
    let stylecss={ };

    if(this.props.lastelementcss)
        stylecss={  borderTopStyle: "none",borderTopWidth: "0" };

    let element = <span>
        <li     
            id={'Popover-' + this.props.id} onMouseOver={this.toggle} onMouseOut={this.toggle} 
            key ={this.props.keyprop}data-date={num.toString()} 
            className={css}
            style={stylecss}>
            <div>
                <div>
                    {this.props.obj.Name}
                    <span 
                        className = "font-italic font-weight-bold"
                        style={this.props.obj.ShowTimeLineDate?displayBlock:displayNone}>
                            {this.props.obj["Actual Date"].replace("**","")}
                    </span>
                </div>
            </div>
        </li>
        <Popover placement={'top'} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle} style={cssPopColor}>
            <PopoverHeader className="text-center"><span className="text-muted font-weight-bold">{this.props.obj.Name}</span><br/></PopoverHeader>
            <PopoverBody>
                <div className="mt-1 mb-1">
                    <div>Planned Date: {this.props.obj["Planned Date"].replace("**","")}</div>
                    <div>Actual Date: {this.props.obj["Actual Date"].replace("**","")}</div>
                    <div>Notes: </div><br />
                    {
                        
                        Object.values(this.props.obj.Notes).map((value,key)=><div key={key}><li>{value}</li></div>)
                    }
                </div>
            </PopoverBody>
        </Popover>
        <Popover 
                placement={'bottom'} 
                isOpen={this.state.popoverOpen && this.state.popoverTopOpen} 
                target={'Popover-' + this.props.id} 
                toggle={this.toggle} style={cssToBottomPopOver}>
            <PopoverHeader className="text-center"><span className="text-muted font-weight-bold">Impact</span><br/></PopoverHeader>
            <PopoverBody>
                <div className="mt-1 mb-1">
                    {
                      (Array.isArray(this.props.rules))?this.props.rules.map((value,key)=><div key={key}>{value}</div>):"No rules added for this phase."
                    } 
                </div>
            </PopoverBody>
        </Popover>
      </span>;
      return element;
  }
}

export default PopoverItem;