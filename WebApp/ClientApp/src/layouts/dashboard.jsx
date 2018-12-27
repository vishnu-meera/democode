// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import { Route, Switch } from "react-router-dom";
import DashBoardNav from "components/navbars/navbar";
import Sidebar from "components/sidebar/sidebar.jsx";
import dashboardRoutes from "routes/routes-dashboard";
import Auth from "utils/authhelper"

class DashboardLayout extends React.Component {
    constructor(props) {
        super(props);
        this.auth = new Auth();
        this.auth.clear();
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            sidebarMini: false,
            authenticated:false,
            errorMessage:null
        };
        this.loginToApp = this.loginToApp.bind(this);
    };

    getRoutes = dashboardRoutes => {
        return dashboardRoutes.map((prop, key) => {
            if (prop.collapse) {
                return this.getRoutes(prop.views);
            }

            // console.log("layout==>", prop.layout);
            // console.log("path==>",prop.path)
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    handleMiniClick = () => {
        if (document.body.classList.contains("sidebar-mini")) {
            this.setState({ sidebarMini: false });
        } else {
            this.setState({ sidebarMini: true });
        }
        document.body.classList.toggle("sidebar-mini");
    };

    loginToApp = async (toggleLogin)=>{
        let authenticated = false;
        if(!toggleLogin){
            console.log("toggleLogin==>",toggleLogin)
            let {accessToken,errorMessage}  = await this.auth.login();
            console.log("loginToApp==>",errorMessage);

            if(errorMessage){
                await this.setState({authenticated,errorMessage});
            }else if(accessToken){
                authenticated=true;
                await this.setState({authenticated});
                this.props.history.push("/admin/dashboard");
            };

        }else{
            let token  = await this.auth.logout();
            await this.setState({authenticated});
        }
    }

    render() {
        return (
            <div className="wrapper">
                <Sidebar
                    {...this.props}
                    routes={dashboardRoutes}
                    bgColor={this.state.backgroundColor}
                    activeColor={this.state.activeColor}
                />
                <div className="main-panel" ref="mainPanel">
                    <DashBoardNav  {...this.props} 
                            handleMiniClick={this.handleMiniClick} 
                            loginToApp={this.loginToApp} 
                            authenticated={this.state.authenticated}/>
                    <Switch>{this.getRoutes(dashboardRoutes)}</Switch>
                    {!this.state.authenticated?
                        <div className="content">
                        <div className="row">
                            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                                <div className="card card-signin my-5">
                                    <div className="card-body">
                                        <h6 className="card-title text-muted text-center">Please Login to see Azure Dashboard</h6>

                                        <button 
                                            className="btn btn-md btn-secondary btn-block" 
                                            onClick={()=>{this.loginToApp(this.state.authenticated)}}>Log in</button>
                                        <hr className="my-4" />
                                        {this.state.errorMessage?
                                            <div className="alert alert-light" role="alert">
                                                <span className="text-danger">{this.state.errorMessage}!!</span>
                                            </div>:null
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>:null
                    }
                </div>
            </div>
        );
    }
};

export default DashboardLayout;
