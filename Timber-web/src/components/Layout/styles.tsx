import { SxProps, Theme } from "@mui/material/styles";

export const layoutContainerStyles: SxProps<Theme> = {
	width: "100%",
	flexGrow: 1,
	mt: "64px",
	mb: "56px",
	display: "flex",
	flexDirection: "row",
	position: "relative",
};

export const mainContentStyles: SxProps<Theme> = {
	flexGrow: 1,
	display: "flex",
	justifyContent: "center",
	p: 2,
};
