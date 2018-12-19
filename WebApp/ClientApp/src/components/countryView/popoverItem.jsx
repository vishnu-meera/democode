import React from 'react';
import { Row,Col, Popover, PopoverHeader, PopoverBody,TabContent,TabPane } from 'reactstrap';

class PopoverItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    let cssPopColor = {"backgroundColor":"#fbf3f3"}
    return (
      <span>
        <li     
            id={'Popover-' + this.props.id} onMouseOver={this.toggle} onMouseOut={this.toggle} 
            key ={this.props.keyprop}data-date={this.props.num.toString()} 
            className={this.props.css}>
            <div >{this.props.obj.Name}</div>
        </li>
        <Popover placement={'bottom'} isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle} style={cssPopColor}>
            <PopoverHeader className="text-center"><span className="text-muted font-weight-bold">{this.props.obj.Name}</span><br/></PopoverHeader>
            <PopoverBody>
                <div className="mt-1 mb-1">
                    <span>Planned Date: {this.props.obj["Planned Date"]}</span><br />
                    <span>Actual Date: {this.props.obj["Actual Date"]}</span><br />
                    <span>Risk Level: {this.props.obj["Risk Level"]}</span><br />
                    <span>Notes: </span><br />
                    {
                        
                        Object.values(this.props.obj.Notes).map((value,key)=><div key={key}><span>{value}</span><br /></div>)
                    }
                </div>
            </PopoverBody>
        </Popover>
      </span>
    );
  }
}

export default PopoverItem;