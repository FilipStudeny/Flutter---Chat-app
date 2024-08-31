import {
	Typography,
	Grid,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	SelectChangeEvent,
	Box,
	Paper,
} from "@mui/material";
import React, { useState } from "react";

import { Gender } from "../../../constants/Enums/Gender";
import { UserDataModel } from "../../../constants/Models/UserDataModel";
import UserCard from "../../Cards/UserCard";

interface FriendsListProps {
	friendsList?: UserDataModel[]; // Make this prop optional to handle undefined cases
	hideTitle?: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({ friendsList = [], hideTitle = false }) => {
	const [nameFilter, setNameFilter] = useState("");
	const [genderFilter, setGenderFilter] = useState<Gender | "">("");

	const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(event.target.value);
	};

	const handleGenderFilterChange = (event: SelectChangeEvent<Gender | "">) => {
		setGenderFilter(event.target.value as Gender | "");
	};

	const filteredFriends = friendsList.filter((friend) => {
		const matchesName = `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(nameFilter.toLowerCase());
		const matchesGender = genderFilter === "" || friend.gender === genderFilter;
		return matchesName && matchesGender;
	});

	return (
		<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: hideTitle ? "flex-end" : "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				{!hideTitle && (
					<Typography variant='h6' fontWeight='bold'>
						Friends
					</Typography>
				)}

				<Box sx={{ display: "flex", gap: 2 }}>
					<TextField
						label='Filter by Name'
						variant='outlined'
						size='small'
						value={nameFilter}
						onChange={handleNameFilterChange}
					/>

					<FormControl sx={{ minWidth: 120 }} size='small'>
						<InputLabel id='gender-filter-label'>Gender</InputLabel>
						<Select
							labelId='gender-filter-label'
							value={genderFilter}
							label='Gender'
							onChange={handleGenderFilterChange}
						>
							<MenuItem value=''>All</MenuItem>
							<MenuItem value={Gender.Male}>Male</MenuItem>
							<MenuItem value={Gender.Female}>Female</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</Box>

			<Box>
				{filteredFriends.length > 0 ? (
					<Grid container spacing={3}>
						{filteredFriends.map((friend: UserDataModel) => (
							<Grid item xs={12} sm={6} key={friend.uid}>
								<UserCard user={friend} />
							</Grid>
						))}
					</Grid>
				) : (
					<Typography variant='body2' color='textSecondary'>
						No friends found.
					</Typography>
				)}
			</Box>
		</Paper>
	);
};

export default FriendsList;
