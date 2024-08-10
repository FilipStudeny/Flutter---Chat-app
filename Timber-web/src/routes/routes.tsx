import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import AppLayout from "../components/Layout/Layout";
import { AppRoutes } from "../constants/Enums/AppRoutes";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPasswordPage from "./ForgotenPasswordPage";

const routes = createBrowserRouter([
    { path: AppRoutes.Welcome, element: <WelcomePage /> },
    { path: AppRoutes.SignIn, element: <LoginPage /> },
    { path: AppRoutes.Register, element: <RegisterPage /> },
    { path: AppRoutes.ForgottenPassword, element: <ForgotPasswordPage /> },
    {
        element: <AppLayout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: AppRoutes.Home,
                        element: <HomePage />
                    },
                ]
            },
        ]
    }
]);

export default routes;
