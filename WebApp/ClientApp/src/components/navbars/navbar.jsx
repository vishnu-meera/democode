//Microsoft Corporation.
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import classnames from "classnames";
import {
    Button,
    Collapse,
    Navbar,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    Nav,
    NavbarBrand,
    Container
} from "reactstrap";

import defaultavatar from "assests/img/defaultavatar.png"; //default picture

class DashBoardNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            color: "navbar-transparent",
            openAvatar: false,
            userName: props.userName || "defaultName",
            avatar: props.avatar || defaultavatar
        };
    };


    componentDidUpdate(e) {
        if (
            window.outerWidth < 993 &&
            e.history.location.pathname !== e.location.pathname &&
            document.documentElement.className.indexOf("nav-open") !== -1
        ) {
            document.documentElement.classList.toggle("nav-open");
        }
    };

    // this function opens and closes the sidebar on small devices
    toggleSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
    };

    // this function opens and closes the collapse on small devices
    // it also adds navbar-transparent class to the navbar when closed
    // ad bg-white when opened
    toggleCollapse = () => {
        let newState = {
            collapseOpen: !this.state.collapseOpen
        };
        if (!this.state.collapseOpen) {
            newState["color"] = "bg-white";
        } else {
            newState["color"] = "navbar-transparent";
        }
        this.setState(newState);
    };

    render() {
        return (
            <>
                <Navbar
                    className={classnames("navbar-absolute fixed-top", this.state.color)}
                    expand="lg"
                >
                    <Container fluid>
                        <div className="navbar-wrapper">
                            <div className="navbar-minimize">
                                <Button
                                    className="btn-icon btn-round"
                                    color="default"
                                    id="minimizeSidebar"
                                    onClick={this.props.handleMiniClick}>
                                    <i className="nc-icon nc-minimal-right text-center visible-on-sidebar-mini" />
                                    <i className="nc-icon nc-minimal-left text-center visible-on-sidebar-regular" />
                                </Button>
                            </div>
                            <div
                                className={classnames("navbar-toggle", {
                                    toggled: this.state.sidebarOpen
                                })}
                            >
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={this.toggleSidebar}
                                >
                                    <span className="navbar-toggler-bar bar1" />
                                    <span className="navbar-toggler-bar bar2" />
                                    <span className="navbar-toggler-bar bar3" />
                                </button>
                            </div>
                            <NavbarBrand>
                                <span className="d-none d-md-block">
                                    DashBoard
                </span>
                                <span className="d-block d-md-none">DashBoard</span>
                            </NavbarBrand>
                        </div>
                        <button
                            aria-controls="navigation-index"
                            aria-expanded={this.state.collapseOpen}
                            aria-label="Toggle navigation"
                            className="navbar-toggler"
                            // data-target="#navigation"
                            data-toggle="collapse"
                            type="button"
                            onClick={this.toggleCollapse}
                        >
                            <span className="navbar-toggler-bar navbar-kebab" />
                            <span className="navbar-toggler-bar navbar-kebab" />
                            <span className="navbar-toggler-bar navbar-kebab" />
                        </button>
                        <Collapse className="justify-content-end" navbar isOpen={this.state.collapseOpen}>
                            <Nav navbar>
                                <UncontrolledDropdown className="btn-rotate" nav>
                                    <DropdownToggle
                                        aria-haspopup={true}
                                        caret
                                        color="default"
                                        data-toggle="dropdown"
                                        id="navbarDropdownMenuLink"
                                        nav>
                                        <i className="nc-icon nc-settings-gear-65" />
                                        <p><span className="d-lg-none d-md-block">User Account</span></p>
                                    </DropdownToggle>
                                    <DropdownMenu aria-labelledby="navbarDropdownMenuLink" right>
                                        <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>Settings</DropdownItem>
                                        <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>Log Out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default DashBoardNav;

