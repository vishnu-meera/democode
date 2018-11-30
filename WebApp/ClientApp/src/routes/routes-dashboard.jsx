//// views
import Dashboard from "views/Dashboard/PaperAdvDashboard.jsx";



var dashboardRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "nc-icon nc-bank",
        component: Dashboard,
        layout: "/admin"
    },
    { redirect: true, path: "/", pathTo: "/admin/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
