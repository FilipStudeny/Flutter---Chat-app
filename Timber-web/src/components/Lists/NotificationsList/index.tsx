import { Container, Box, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Paper } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

import NotificationType from "../../../constants/Enums/NotificationType";
import UserNotification from "../../../constants/Models/UserNotification";
import NotificationCard from "../../Cards/NotificationCard";

const NotificationsList = ({ notifications }: { notifications: UserNotification[] }) => {
	const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");

	const handleTypeFilterChange = (event: SelectChangeEvent<NotificationType | "">) => {
		setTypeFilter(event.target.value as NotificationType | "");
	};

	const filteredNotifications = notifications.filter((notification) => {
		const matchesType = typeFilter === "" || notification.type === typeFilter;
		return matchesType;
	});

	return (
		<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
			<Container>
				<Typography variant='h6' fontWeight='bold'>
					Notifications
				</Typography>

				{/* Filter Controls */}
				<Box display='flex' justifyContent='flex-start' alignItems='center' mb={2}>
					<FormControl sx={{ minWidth: 120 }} size='small'>
						<InputLabel id='type-filter-label'>Type</InputLabel>
						<Select
							labelId='type-filter-label'
							value={typeFilter}
							label='Type'
							onChange={handleTypeFilterChange}
						>
							<MenuItem value=''>All</MenuItem>
							<MenuItem value={NotificationType.MESSAGE}>Message</MenuItem>
							<MenuItem value={NotificationType.FRIEND_REQUEST}>Friend Request</MenuItem>
							<MenuItem value={NotificationType.GLOBAL_MESSAGE}>Global Message</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Container>

			<Box>
				{filteredNotifications.length > 0 ? (
					<Grid container spacing={3}>
						{filteredNotifications.map((notification: UserNotification) => (
							<Grid item xs={12} sm={6} key={notification.id}>
								<NotificationCard notification={notification} />
							</Grid>
						))}
					</Grid>
				) : (
					<Typography variant='body2' color='textSecondary'>
						No notifications found.
					</Typography>
				)}
			</Box>
		</Paper>
	);
};

export default NotificationsList;
