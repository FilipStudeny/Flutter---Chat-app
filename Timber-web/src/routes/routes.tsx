import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ChatsPage from "./chat";
import ChatDetailPage from "./chat/[id]";
import ForgotPasswordPage from "./forgotton-password";
import HomePage from "./home";
import UserProfilePage from "./profile/[id]";
import SearchPage from "./search";
import LoginPage from "./sign-in";
import RegisterPage from "./sign-up";
import WelcomePage from "./welcome";
import AppLayout from "../components/Layout/Layout";
import AppRoutes from "../constants/Enums/AppRoutes";

const routes = createBrowserRouter([
	{
		element: <PublicRoute />,
		children: [
			{ path: AppRoutes.Welcome, element: <WelcomePage /> },
			{ path: AppRoutes.SignIn, element: <LoginPage /> },
			{ path: AppRoutes.Register, element: <RegisterPage /> },
			{ path: AppRoutes.ForgottenPassword, element: <ForgotPasswordPage /> },
		],
	},
	{
		element: <AppLayout />,
		children: [
			{
				element: <ProtectedRoute />,
				children: [
					{ path: AppRoutes.Home, element: <HomePage /> },
					{ path: AppRoutes.Profile, element: <UserProfilePage /> },
					{ path: AppRoutes.Search, element: <SearchPage /> },
					{ path: AppRoutes.Chats, element: <ChatsPage /> },
					{ path: AppRoutes.Chat, element: <ChatDetailPage /> },
				],
			},
		],
	},
]);

export default routes;
