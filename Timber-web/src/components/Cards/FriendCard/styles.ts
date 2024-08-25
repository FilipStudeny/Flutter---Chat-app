import { Box as MuiBox, Avatar as MuiAvatar, styled } from "@mui/material";

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
