// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

import DashboardLayout from "../layouts/dashboardLayout";
//import PagesLayout from "../layouts/pageLayout";
// Import CSS & SCSS
import "assests/sass/dashboardscss";

//    { path: "/pages", name: "Pages", component: PagesLayout },
const indexRoutes = [
    { path: "/", name: "Home", component: DashboardLayout }
];

export default indexRoutes;
