import { Card as MuiCard, Box as MuiBox, Avatar as MuiAvatar, styled } from "@mui/material";

export const Container = styled(MuiBox)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
`;

export const FiltersContainer = styled(MuiBox)`
	display: flex;
	gap: 16px;
`;

export const Card = styled(MuiCard)`
	border-radius: 12px;
	box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
	&:hover {
		box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
		transform: scale(1.03);
		transition: all 0.3s ease-in-out;
	}
`;

export const CardContent = styled(MuiBox)`
	padding: 0;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const FlexBox = styled(MuiBox)`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 16px;
	text-align: left;
`;

export const Avatar = styled(MuiAvatar)`
	width: 80px;
	height: 80px;
	margin-right: 16px;
	border-radius: 50%;
`;
