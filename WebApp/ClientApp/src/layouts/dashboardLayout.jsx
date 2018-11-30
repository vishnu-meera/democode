// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Sidebar from "../components/sidebar/sidebar";

class DashboardLayout extends Component {
    render() {
        return (
            <div className="wrapper">
                <Sidebar {...this.props} />
            </div>
        );
    }
}

export default DashboardLayout;