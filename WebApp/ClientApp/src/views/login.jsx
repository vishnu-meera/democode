// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import Auth from "utils/authhelper"


export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.auth = new Auth();
        //this.auth.clear();
    }



    render(){
        if(!this.props.authenticated)
            return(<div className="content">
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                        <div className="card-body">
                            <h6 className="card-title text-muted text-center">Please Login to see Azure Dashboard</h6>

                            <button 
                                className="btn btn-md btn-secondary btn-block" 
                                onClick={()=>{this.props.loginToApp(this.props.authenticated)}}>Log in</button>
                            <hr className="my-4" />
                            {this.props.errorMessage?
                                <div className="alert alert-light" role="alert">
                                    <span className="text-danger">{this.state.errorMessage}!!</span>
                                </div>:null
                            }
                        </div>

                    </div>
                </div>
            </div>)
        </div>)
        else{
            return null;
        }
    }
}
