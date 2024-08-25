import { Box, Typography, ListItem, ButtonBase, styled } from "@mui/material";
import { green, red } from "@mui/material/colors";

export const LoadingContainer = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 16px;
`;

export const ErrorText = styled(Typography)`
	padding: 16px;
	color: red;
	text-align: center;
`;

export const StyledListItem = styled(ListItem)`
	padding: 0px;
	&:hover {
		background-color: rgba(0, 0, 0, 0.04);
	}
	transition: background-color 0.3s ease;
`;

export const StyledButtonBase = styled(ButtonBase)`
	padding: 2px;
	padding-left: 10px;
	width: 100%;
	text-align: left;
`;

export const UsernameText = styled(Typography)`
	font-weight: bold;
`;

export const OnlineStatusCircle = styled(Box)<{ online: boolean }>`
	position: absolute;
	bottom: -4px;
	right: -4px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	border: 2px solid white;
	background-color: ${({ online }) => (online ? green[500] : red[500])};
`;
