import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./welcome";
import HomePage from "./home";
import LoginPage from "./sign-in";
import RegisterPage from "./sign-up";
import AppLayout from "../components/Layout/Layout";
import { AppRoutes } from "../constants/Enums/AppRoutes";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPasswordPage from "./forgotton-password";
import UserProfilePage from "./profile/[id]";

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
                    {
                        path: AppRoutes.Profile,
                        element: <UserProfilePage />
                    },
                ]
            },
        ]
    }
]);

export default routes;
