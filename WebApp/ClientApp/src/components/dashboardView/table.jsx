/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import React from "react";
import Utils from 'utils/utils';
import ReactTable from "react-table";
import CountryPanel from "components/dashboardView/panel";
import { 
    Card, Row, InputGroup,Input,InputGroupAddon,InputGroupText
} from "reactstrap";
import Select from "react-select";
import Spinner from "components/spinner/spin";

const getTableData =(tableData)=>{
    let data =  tableData.map((prop, key) => {
        let population = prop[1].split(" ")[0].trim().replace(/\,/g,'');
        let gdp = prop[2].split(" ")[0].trim().replace(/\,/g,'');
        population = parseInt(population,10);
        gdp = parseInt(gdp,10);
        return {
            id: key,
            country:prop[0],
            population: population,
            gdp: gdp,
            status: prop[3],
            name: prop[0]
        };
    });
    let country = tableData[0][0];
    let population = tableData[0][1].split(" ")[0];
    let gdp = tableData[0][2].split(" ")[0];
    let status = tableData[0][3];

    console.log("Population and gdp", population,gdp)

    return {data,country,population,gdp,status};
}

class CountryTables extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new Utils();
        this.data = this.props.data;
        this.state = {
            ...getTableData(this.data),
            loading:true,
            index:0,
            countrystatus:""
        };
        this.submitClick = this.submitClick.bind(this);
        this.searchChange = this.searchChange.bind(this);
    }

    searchChange = (e)=>{
        let countrystatus = this.state.countrystatus;
        let searchType = e.target.value;
        let data = JSON.parse(JSON.stringify(this.props.data));
        data = data.filter(x=>x[0].toLowerCase().search(searchType.toLowerCase()) !== -1);
        console.log("searchChange 2==>",data);
        if(data.length>0)
        {
            if(countrystatus==="All") this.setState({ ...getTableData(data),index:0});
            else this.setState({ ...getTableData(data.filter(x=>x.includes(countrystatus))),index:0 });
        }
        //this.setState({ ...getTableData(data),index:0});
    };

    async submitClick(rowInfo){
        console.log("onClickDropDown==>",rowInfo)
        let country = rowInfo.row.country;
        let population = rowInfo.row.population;
        let gdp = rowInfo.row.gdp
        let status = rowInfo.row.status
        let index =  rowInfo.index
        await this.setState({ country, population, gdp, status,index });
    }

    async componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.data = this.props.data;
            await this.setState({ ...getTableData(this.data) });
            await this.setState({ index:0});
        }
    }

    async componentDidMount() {
        if (this.state.loading) {
            await this.setState({loading: false})
        }
    }

    async onClickDropDown(e){
        //console.log("onClickDropDown==>",e)
        let countrystatus = e.value;
        if(countrystatus==="All") await this.setState({ ...getTableData(this.data)});
        else await this.setState({ ...getTableData(this.data.filter(x=>x.includes(countrystatus))) });
        await this.setState({ index:0,countrystatus});
    }

    render() {
        const self = this;
        let keys = [...new Set(this.data.map(obj=>obj[3]))];
        keys.push("All");
        let dropdownItems = keys.map(status => {return {value: status, label: status}});
        if(this.state.loading)
            return (
                <div className="content">
                    {Spinner.call(this)}
                </div>
            )
        else{

        return (
                    <div className="row row-eq-height">
                        <div className="col-sm-8">
                            <Card>
                                <Row>
                                    <InputGroup className="no-border col-md-4 mr-auto">
                                        <InputGroupAddon addonType="append">
                                                <InputGroupText>
                                                    <i className="nc-icon nc-zoom-split" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        <Input defaultValue="" placeholder="Search Country..." type="text" onChangeCapture={(e)=>this.searchChange(e)}/>
                                    </InputGroup>
                                    <Select
                                        className="react-select primary col-md-4 ml-auto"
                                        classNamePrefix="react-select"
                                        name="singleSelect"
                                        value={this.state.singleSelect}
                                        onChange={value =>this.onClickDropDown( value )}
                                        options={dropdownItems}
                                        placeholder="Single Select"
                                    />
                                </Row>
                                <ReactTable
                                    className = "card-stats"
                                    data={this.state.data}
                                    filterable
                                    columns={[
                                        {
                                            Header: "Country",
                                            accessor: "country",
                                            filterable:false
                                        },
                                        {
                                            Header: "Population (in million)",
                                            accessor: "population",
                                            filterable:false
                                        },
                                        {
                                            Header: "GDP (in billon USD)",
                                            accessor: "gdp",
                                            filterable:false
                                        },
                                        {
                                            Header: 'Status',
                                            accessor: 'status',
                                            filterable:false,
                                            headerClassName:"text-left",
                                            Cell: row => (
                                                <span>
                                                    <span style={{
                                                            color : this.utils.mapColorCodes[row.value],
                                                        transition: 'all .3s ease'
                                                    }}>
                                                        &#x25cf;
                                                    </span> {
                                                        row.value
                                                    }
                                                </span>
                                            )
                                        }
                                        ]}
                                    showPageSizeOptions = {false}
                                    defaultPageSize={10}
                                    showPaginationBottom
                                    showPageJump= {true}
                                    className="-highlight"
                                    getTrProps={(state, rowInfo) => {
                                        if (rowInfo && rowInfo.row) {
                                          return {
                                            onClick: (e) => {
                                                self.submitClick(rowInfo);
                                            } ,    
                                            style: {
                                                background: rowInfo.index === this.state.index ? '#D3D3D3' : 'white',
                                                color: rowInfo.index === this.state.index ? 'white' : 'black',
                                                cursor:"pointer"
                                            }
                                          }
                                        }else{
                                          return {}
                                        }
                                      }}
                                />
                            </Card>

                        </div>
                        <div className="col-sm-4">
                            <CountryPanel 
                                country={this.state.country} 
                                gdp={this.state.gdp} 
                                status={this.state.status} 
                                population={this.state.population} 
                                CountriesObject = {this.props.CountriesObject}
                                toolTipObject = {this.props.toolTipObject}
                                countryCode={this.utils.getCode(this.state.country)} 
                                />
                        </div>
                    </div>);
        }
    }
}

export default CountryTables;
