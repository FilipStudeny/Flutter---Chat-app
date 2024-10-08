enum AppRoutes {
	Welcome = "/",
	Home = "/home",
	SignIn = "/sign-in",
	Register = "/register",
	Profile = "/profile/:id",
	UserFriends = "/profile/:id/friends",
	Messages = "/messages",
	Chats = "/chats",
	Notifications = "/notifications",
	SignOut = "/sign-out",
	Search = "/search",
	Settings = "/settings",
	ProfileSettings = "/profile/settings",
	ForgottenPassword = "/forgoten-password",
	Chat = "/chats/chat/:id",
}

export default AppRoutes;
