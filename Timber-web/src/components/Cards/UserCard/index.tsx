import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { CardMedia, Typography, Box } from "@mui/material";
import React from "react";

import {
	MinimalCard,
	MinimalClickableCard,
	MinimalHorizontalCard,
	MinimalClickableHorizontalCard,
	MinimalOnlineStatus,
	MinimalCardContent,
	MinimalHorizontalCardContent,
	MinimalUserInfo,
	MinimalProfilePicture,
	MinimalUserDetails,
	MinimalGenderIconWrapper,
} from "./styles";
import { Gender } from "../../../constants/Enums/Gender";

interface UserCardProps {
	photoUrl: string;
	name: string;
	username: string;
	age: number;
	gender: Gender;
	online: boolean;
	clickable?: boolean;
	onClick?: () => void;
	horizontal?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
	photoUrl,
	name,
	username,
	age,
	gender,
	online,
	clickable = false,
	onClick,
	horizontal = false,
}) => {
	const CardComponent = clickable
		? horizontal
			? MinimalClickableHorizontalCard
			: MinimalClickableCard
		: horizontal
			? MinimalHorizontalCard
			: MinimalCard;

	const CardContentComponent = horizontal ? MinimalHorizontalCardContent : MinimalCardContent;

	return (
		<CardComponent onClick={clickable ? onClick : undefined}>
			<Box sx={{ position: "relative" }}>
				{online && <MinimalOnlineStatus />}
				<CardMedia
					component='img'
					height={horizontal ? "100%" : "140"}
					image={photoUrl}
					alt={name}
					sx={{ width: horizontal ? "120px" : "100%", borderRadius: "8px 8px 0 0" }}
				/>
			</Box>
			<CardContentComponent>
				<MinimalUserInfo>
					<MinimalProfilePicture src={photoUrl} alt={name} />
					<MinimalUserDetails>
						<Typography
							variant='subtitle1'
							sx={{ fontWeight: 500, color: "#333", fontSize: "1rem", lineHeight: 1.2 }}
						>
							{name}
						</Typography>
						<Typography variant='body2' sx={{ color: "#666", fontSize: "0.875rem" }}>
							@{username}
						</Typography>
						<Typography variant='body2' sx={{ color: "#333", fontSize: "0.875rem", marginTop: "4px" }}>
							{age} years
						</Typography>
					</MinimalUserDetails>
				</MinimalUserInfo>
				<MinimalGenderIconWrapper gender={gender}>
					{gender === Gender.Male ? (
						<MaleIcon sx={{ color: "#4379f0", fontSize: "2rem" }} />
					) : (
						<FemaleIcon sx={{ color: "#ff69b4", fontSize: "2rem" }} />
					)}
				</MinimalGenderIconWrapper>
			</CardContentComponent>
		</CardComponent>
	);
};

export default UserCard;
