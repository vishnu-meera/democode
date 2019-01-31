/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import Dashboard from "views/dashboard";
import Country from "views/country";
import DataCapture from "views/datacapture";
import Timeline from "views/timeline";

const layout = "/admin";
var dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "nc-icon nc-bank",
        component: Dashboard,
        layout: layout
    },
    {
        path: "/country",
        name: "Country",
        icon: "nc-icon nc-chart-bar-32",
        component: Country,
        layout: layout
    },
    {
        path: "/enterdata",
        name: "DataCapture",
        icon: "nc-icon nc-chart-bar-32",
        component: DataCapture,
        layout: layout
    },
    {
        path: "/Timeline",
        name: "Timeline",
        icon: "nc-icon nc-chart-bar-32",
        component: Timeline,
        layout: layout
    }
];

export default dashboardRoutes;
