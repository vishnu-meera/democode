//Microsoft Corporation.
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";

class Sidebar extends React.Component {
    // this function creates the links and collapses that appear in the sidebar (left menu)
    createLinks = routes => {
        return routes.map((prop, key) => {

            return (
                <li className={this.activeRoute(prop.layout + prop.path)} key={key}>
                    <NavLink to={prop.layout + prop.path} activeClassName="">
                        {prop.icon !== undefined ? (
                            <>
                                <i className={prop.icon} />
                                <p>{prop.name}</p>
                            </>
                        ) : (
                                <>
                                    <span className="sidebar-mini-icon">{prop.mini}</span>
                                    <span className="sidebar-normal">{prop.name}</span>
                                </>
                            )}
                    </NavLink>
                </li>
            );
        });
    };

    // verifies if routeName is the one active (in browser input)
    activeRoute = routeName => {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };

    render() {
        return (
            <div className="sidebar" data-color={this.props.bgColor} data-active-color={this.props.activeColor}>
                <div className="logo">
                    <a href="/admin/dashboard" className="simple-text logo-mini">

                    </a>
                    <a href="/admin/dashboard" className="simple-text logo-normal"> GOLOCAL </a>
                </div>
                <div className="sidebar-wrapper" ref="sidebar">
                    <Nav>{this.createLinks(this.props.routes)}</Nav>
                </div>
            </div>
        );
    }
}

export default Sidebar;
