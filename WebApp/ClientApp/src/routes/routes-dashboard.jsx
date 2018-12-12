//// views
import Dashboard from "views/Dashboard/dashboard";
import Country from "views/Dashboard/country";
import InputView from "views/Dashboard/inputView";

var dashboardRoutes = [
    {
        path: "dashboard",
        name: "Dashboard",
        icon: "nc-icon nc-bank",
        component: Dashboard,
        layout: "/"
    },
    {
        path: "country",
        name: "Country",
        icon: "nc-icon nc-chart-bar-32",
        component: Country,
        layout: "/"
    },
    {
        path: "enterdata",
        name: "InputData",
        icon: "nc-icon nc-chart-bar-32",
        component: InputView,
        layout: "/"
    }
];

export default dashboardRoutes;
