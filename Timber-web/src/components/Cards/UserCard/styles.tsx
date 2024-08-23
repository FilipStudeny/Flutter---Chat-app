import { Card, CardContent, Box } from "@mui/material";
import { styled } from "@mui/system";
import { Gender } from "../../../constants/Enums/Gender";

export const MinimalCard = styled(Card)({
	position: "relative",
	borderRadius: 8,
	overflow: "hidden",
	width: "240px",
	transition: "transform 0.2s ease-in-out",
	"&:hover": {
		transform: "scale(1.02)",
	},
	boxShadow: "none", // Flat design: no shadow
	border: "1px solid #e0e0e0", // Subtle border to define card edges
});

export const MinimalHorizontalCard = styled(MinimalCard)({
	display: "flex",
	flexDirection: "row",
	width: "100%",
	height: "140px",
});

export const MinimalClickableCard = styled(MinimalCard)({
	cursor: "pointer",
});

export const MinimalClickableHorizontalCard = styled(MinimalHorizontalCard)({
	cursor: "pointer",
});

export const MinimalOnlineStatus = styled(Box)({
	position: "absolute",
	top: 8,
	left: 8,
	width: 8,
	height: 8,
	backgroundColor: "#4caf50",
	borderRadius: "50%",
});

export const MinimalCardContent = styled(CardContent)({
	position: "relative",
	background: "transparent", // Transparent background
	padding: "12px",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	color: "#333",
});

export const MinimalHorizontalCardContent = styled(MinimalCardContent)({
	background: "transparent", // Transparent background
	padding: "12px",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	flexGrow: 1,
	width: "calc(100% - 120px)",
});

export const MinimalUserInfo = styled(Box)({
	display: "flex",
	alignItems: "center",
});

export const MinimalProfilePicture = styled("img")({
	borderRadius: "50%",
	width: "42px",
	height: "42px",
	marginRight: "8px",
	objectFit: "cover",
	border: "1px solid #e0e0e0", // Subtle border around the profile picture
});

export const MinimalUserDetails = styled(Box)({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
});

export const MinimalGenderIconWrapper = styled(Box)<{ gender: Gender }>(({ gender }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "42px",
	height: "42px",
	borderRadius: "50%",
	backgroundColor: "transparent", // Remove background for a minimalistic look
	color: gender === Gender.Male ? "#4379f0" : "#ff69b4",
}));
