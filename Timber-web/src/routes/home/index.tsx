import { Container, Box, Typography, Divider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import NotificationsList from "../../components/Lists/NotificationsList";
import UserList from "../../components/Lists/UsersList";

const HomePage: React.FC = () => (
	<Container
		sx={{
			pt: 4,
			pb: 6,
			color: "text.primary",
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		}}
	>
		<Toaster position='top-right' reverseOrder={false} />
		{/* Notifications Section */}
		<Box sx={{ mb: 6, width: "100%" }}>
			<Typography variant='h5' align='center' sx={{ mb: 3, fontWeight: "bold", color: "text.secondary" }}>
				Notifications
			</Typography>
			<Divider sx={{ mb: 4 }} />

			<Box>
				<NotificationsList />
			</Box>
		</Box>

		{/* Friends List Section */}
		<Box sx={{ mb: 6, width: "100%" }}>
			<Typography variant='h5' align='center' sx={{ mb: 3, fontWeight: "bold", color: "text.secondary" }}>
				Friends
			</Typography>
			<Divider sx={{ mb: 4 }} />

			<Box>
				<UserList />
			</Box>
		</Box>
	</Container>
);

export default HomePage;
