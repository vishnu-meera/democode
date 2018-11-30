// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
////import { hot } from "react-hot-loader";
import indexRoutes from "routes/routes";
import registerServiceWorker from "./registerServiceWorker";

//const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");
const hist = createBrowserHistory();

class App extends React.Component {
  render() {
    return (<Router history={hist}>
        <Switch>
          {indexRoutes.map((prop, key) => {
            if (prop.redirect) {
              return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
            }
            return <Route path={prop.path} key={key} component={prop.component} />;
          })}
        </Switch>
      </Router>
  );}
}

//const AppWithHot = hot(module)(App);

ReactDOM.render(<App name="WebApp" />, rootElement);

registerServiceWorker();