// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import { Route, Switch } from "react-router-dom";
import DashBoardNav from "components/navbars/navbar";
import Sidebar from "components/sidebar/sidebar.jsx";
import dashboardRoutes from "routes/routes-dashboard";
import Auth from "utils/auth"

class DashboardLayout extends React.Component {
    constructor(props) {
        super(props);
        this.auth = new Auth();
        this.auth.clear();
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            sidebarMini: false,
            authenticated:false
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
            let token  = await this.auth.login();
            //console.log("loginToApp==>",token);
            if(token){
                authenticated=true;
            };
            await this.setState({authenticated});
            this.props.history.push("/admin/dashboard");
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
                </div>
            </div>
        );
    }
};

export default DashboardLayout;
