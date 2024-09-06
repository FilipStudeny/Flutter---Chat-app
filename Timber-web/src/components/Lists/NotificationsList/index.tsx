import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import React from "react";

import SearchFilters from "./Filters";
import { StyledButton } from "./styles";
import useNotificationsListFetch from "../../../hooks/useGetNotificationsListFetch";
import NotificationCard from "../../Cards/NotificationCard";

interface NotificationsListProps {
	separateFilter?: boolean;
	userId?: string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ separateFilter, userId }: NotificationsListProps) => {
	const {
		notificationType,
		setNotificationType,
		loading,
		error,
		notifications,
		hasMore,
		noResultsFound,
		handleLoadMore,
		fetchNotifications,
	} = useNotificationsListFetch(userId);

	return (
		<>
			{/* Conditional Rendering of Filters */}
			{separateFilter && (
				<Box
					sx={{
						mb: 4,
						width: "100%",
						maxWidth: "900px",
						padding: 3,
						borderRadius: 2,
						boxShadow: 3,
						backgroundColor: "white",
						margin: "0 auto", // Center the search section
					}}
				>
					<SearchFilters
						notificationType={notificationType}
						setNotificationType={setNotificationType}
						loading={loading}
						fetchUsers={fetchNotifications} // Fetch notifications instead of users
					/>
				</Box>
			)}

			{/* Notifications List */}
			<Box
				sx={{
					width: "100%",
					maxWidth: "900px",
					textAlign: "center",
					backgroundColor: "white",
					borderRadius: 2,
					boxShadow: 1,
					p: 3,
					margin: "0 auto",
					marginTop: "24px",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 3,
					}}
				>
					<Typography variant='h6' align='left' sx={{ fontWeight: "medium", color: "text.secondary" }}>
						Notifications
					</Typography>

					{/* Render Filters Inline if separateFilter is false */}
					{!separateFilter && (
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<SearchFilters
								notificationType={notificationType}
								setNotificationType={setNotificationType}
								loading={loading}
								fetchUsers={fetchNotifications} // Fetch notifications instead of users
							/>
						</Box>
					)}
				</Box>

				{loading && notifications.length === 0 ? (
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
						<CircularProgress />
					</Box>
				) : noResultsFound ? (
					<Typography variant='body2' align='center' color='error'>
						No notifications found. Please adjust your search criteria.
					</Typography>
				) : (
					<>
						<Grid container spacing={3}>
							{notifications.map((notification) => (
								<Grid item xs={12} sm={6} md={4} key={notification.id}>
									<NotificationCard notification={notification} />
								</Grid>
							))}
						</Grid>

						{/* Load More Button */}
						{hasMore && (
							<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
								<StyledButton onClick={handleLoadMore} disabled={loading}>
									{loading ? <CircularProgress size={24} color='inherit' /> : "Load More"}
								</StyledButton>
							</Box>
						)}

						{/* No More Notifications Message */}
						{!hasMore && notifications.length > 0 && (
							<Typography variant='body2' align='center' color='textSecondary' sx={{ mt: 2 }}>
								No more notifications found.
							</Typography>
						)}
					</>
				)}

				{/* Error Message */}
				{error && (
					<Typography variant='body2' align='center' color='error'>
						{error}
					</Typography>
				)}
			</Box>
		</>
	);
};

export default NotificationsList;
