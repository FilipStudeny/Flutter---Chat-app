import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {
	CardActionArea,
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
import { useNavigate } from "react-router-dom";

import { Avatar, Card, CardContent, Container, FiltersContainer, FlexBox } from "./styles";
import { Gender } from "../../../constants/Enums/Gender";
import { UserDataModel } from "../../../constants/Models/UserDataModel";

interface FriendsListProps {
	friendsList?: UserDataModel[]; // Make this prop optional to handle undefined cases
	hideTitle?: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({ friendsList = [], hideTitle = false }) => {
	const navigate = useNavigate();
	const [nameFilter, setNameFilter] = useState("");
	const [genderFilter, setGenderFilter] = useState<Gender | "">("");

	const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(event.target.value);
	};

	const handleGenderFilterChange = (event: SelectChangeEvent<Gender | "">) => {
		setGenderFilter(event.target.value as Gender | "");
	};

	const getGenderIcon = (gender: Gender | null) => {
		switch (gender) {
			case Gender.Male:
				return <MaleIcon sx={{ color: "#1976d2", ml: 1, fontSize: 28 }} />;
			case Gender.Female:
				return <FemaleIcon sx={{ color: "#e91e63", ml: 1, fontSize: 28 }} />;
			default:
				return null;
		}
	};

	const filteredFriends = friendsList.filter((friend) => {
		const matchesName = `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(nameFilter.toLowerCase());
		const matchesGender = genderFilter === "" || friend.gender === genderFilter;
		return matchesName && matchesGender;
	});

	return (
		<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
			<Container
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

				<FiltersContainer sx={{ display: "flex", gap: 2 }}>
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
				</FiltersContainer>
			</Container>

			<Box>
				{filteredFriends.length > 0 ? (
					<Grid container spacing={3}>
						{filteredFriends.map((friend: UserDataModel) => (
							<Grid item xs={12} sm={6} key={friend.uid}>
								<Card>
									<CardActionArea onClick={() => navigate(`/profile/${friend.uid}`)}>
										<FlexBox>
											<Avatar
												alt={`${friend.firstName} ${friend.lastName}`}
												src={friend.profilePictureUrl || ""}
											/>
											<CardContent>
												<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
													<Typography variant='h6' fontWeight='bold'>
														{`${friend.firstName || ""} ${friend.lastName || ""}`}
													</Typography>
													{getGenderIcon(friend.gender as Gender)}
												</Box>
												<Typography variant='body2' color='textSecondary'>
													{friend.email || "No email provided"}
												</Typography>
											</CardContent>
										</FlexBox>
									</CardActionArea>
								</Card>
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
