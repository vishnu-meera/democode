/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/

import DASHBOARD from "views/generalmap";
import STATEMAP from "views/statemap";
import MODULES from "views/hvacmodules";
import CHARTS from "views/hvacmodulechart";

const layout = "/admin";

var dashboardRoutes = [
    {
        path: "/generalmap",
        name: "DASHBOARD",
        icon: "nc-icon nc-bullet",
        component: DASHBOARD,
        layout: layout
    },
    {
        path: "/state",
        name: "STATEMAP",
        icon: "nc-icon nc-grid",
        component: STATEMAP,
        layout: layout
    },
    {
        path: "/modules",
        name: "MODULES",
        icon: "nc-icon nc-grid",
        component: MODULES,
        layout: layout
    },
    {
        path: "/charts",
        name: "CHARTS",
        icon: "nc-icon nc-grid",
        component: CHARTS,
        layout: layout
    }
];

export default dashboardRoutes;
