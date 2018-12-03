//// views
import Dashboard from "views/Dashboard/dashboard.jsx";
import Country from "views/Dashboard/country.jsx"


var dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "nc-icon nc-bank",
        component: Dashboard,
        layout: "/admin"
    },
    {
        path: "/country",
        name: "Country",
        icon: "nc-icon nc-chart-bar-32",
        component: Country,
        layout: "/admin"
    }
];

export default dashboardRoutes;
