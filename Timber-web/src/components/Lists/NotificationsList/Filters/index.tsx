import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";

import NotificationType from "../../../../constants/Enums/NotificationType";
import { StyledButton } from "../styles";

interface SearchFiltersProps {
	notificationType: NotificationType | "";
	setNotificationType: (type: NotificationType | "") => void;
	loading: boolean;
	fetchUsers: (initialLoad: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
	notificationType,
	setNotificationType,
	loading,
	fetchUsers,
}) => {
	const handleNotificationTypeChange = (event: SelectChangeEvent<NotificationType>) => {
		setNotificationType(event.target.value as NotificationType);
	};

	return (
		<>
			{/* Notification Type Filter Section */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: 2,
					flexWrap: "wrap",
				}}
			>
				{/* Notification Type Selection */}
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id='notification-type-label'>Notification Type</InputLabel>
					<Select
						labelId='notification-type-label'
						id='notification-type'
						value={notificationType}
						label='Notification Type'
						onChange={handleNotificationTypeChange}
					>
						<MenuItem value=''>All</MenuItem>
						<MenuItem value={NotificationType.MESSAGE}>Message</MenuItem>
						<MenuItem value={NotificationType.FRIEND_REQUEST}>Friend Request</MenuItem>
						<MenuItem value={NotificationType.GLOBAL_MESSAGE}>Global Message</MenuItem>
					</Select>
				</FormControl>

				{/* Search Button */}
				<StyledButton onClick={() => fetchUsers(true)} disabled={loading}>
					{loading ? <CircularProgress size={24} color='inherit' /> : "Search"}
				</StyledButton>
			</Box>
		</>
	);
};

export default SearchFilters;
