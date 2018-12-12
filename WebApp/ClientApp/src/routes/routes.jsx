// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import DashboardLayout from "layouts/dashboardLayout";

// Import CSS & SCSS
import "bootstrap/dist/css/bootstrap.css";
import "assests/sass/paper-adv-dashboard.css";

//    { path: "/pages", name: "Pages", component: PagesLayout }, 
const indexRoutes = [
    { path: "/", component: DashboardLayout }
];

export default indexRoutes;


