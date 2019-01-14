// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import { Route, Switch } from "react-router-dom";
import DashBoardNav from "components/navbars/navbar";
import Sidebar from "components/sidebar/sidebar.jsx";
import dashboardRoutes from "routes/routes-dashboard";
import Auth from "utils/authhelper";
import Login from "views/login";

class DashboardLayout extends React.Component {
    constructor(props) {
        super(props);
        this.auth = new Auth();
        this.auth.clear();
        this.state = {
            backgroundColor: "black",
            activeColor: "info",
            sidebarMini: false
        };
    };

    getRoutes = dashboardRoutes => {
        return dashboardRoutes.map((prop, key) => {
            if (prop.collapse) {
                return this.getRoutes(prop.views);
            }
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
                <Login  {...this.props}/>
            </div>
        );
    }
};

export default DashboardLayout;
