import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {
	Box as MuiBox,
	Avatar as MuiAvatar,
	styled,
	CardActionArea,
	Card,
	CardContent,
	Typography,
	Box,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Gender } from "../../../constants/Enums/Gender";
import { UserDataModel } from "../../../constants/Models/UserDataModel";

export const FlexBox = styled(MuiBox)`
	display: flex;
	align-items: center;
	justify-content: space-between; /* Changed to space-between to push content to edges */
	padding: 8px;
	text-align: left;
`;

export const Avatar = styled(MuiAvatar)`
	width: 50px;
	height: 50px;
	margin-right: 8px;
	border-radius: 50%;
`;

interface FriendCardProps {
	friend: UserDataModel;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
	const navigate = useNavigate();

	const getGenderIcon = (gender: Gender | null) => {
		switch (gender) {
			case Gender.Male:
				return <MaleIcon sx={{ color: "#1976d2", fontSize: 20 }} />;
			case Gender.Female:
				return <FemaleIcon sx={{ color: "#e91e63", fontSize: 20 }} />;
			default:
				return null;
		}
	};

	return (
		<Card sx={{ width: "100%", boxSizing: "border-box", boxShadow: 1, borderRadius: 2, overflow: "hidden" }}>
			<CardActionArea onClick={() => navigate(`/profile/${friend.uid}`)}>
				<FlexBox>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Avatar alt={`${friend.firstName} ${friend.lastName}`} src={friend.profilePictureUrl || ""} />
						<CardContent sx={{ padding: "0 !important" }}>
							<Typography variant='body1' fontWeight='bold' noWrap sx={{ maxWidth: "100%" }}>
								{`${friend.firstName || ""} ${friend.lastName || ""}`}
							</Typography>
							<Typography variant='body2' color='textSecondary' noWrap sx={{ maxWidth: "100%" }}>
								{friend.email || "No email provided"}
							</Typography>
						</CardContent>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{getGenderIcon(friend.gender as Gender)}
					</Box>
				</FlexBox>
			</CardActionArea>
		</Card>
	);
};

export default FriendCard;
