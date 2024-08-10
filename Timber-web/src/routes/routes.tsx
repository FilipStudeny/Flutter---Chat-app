import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./RootPge";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import AppLayout from "../components/Layout/Layout";
import { AppRoutes } from "../constants/Enums/AppRoutes";



const routes = createBrowserRouter([
    {path: AppRoutes.Welcome,element: <WelcomePage/>},
    {path: AppRoutes.SignIn,element: <LoginPage />},
    {path: AppRoutes.Register,element: <RegisterPage />},
    {
        element: <AppLayout/>,
        children: [
            {
                path: AppRoutes.Home,
                element: <HomePage />
            },
        ]
    }
   
]);

export default routes;