import { Box, Button, Typography, Link, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";

export const RegisterContainer = styled(Box)({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	background: "#fff",
	textAlign: "center",
	width: "50%",
	height: "100%",
	padding: "0 20px",
	boxSizing: "border-box",
});

export const LogoContainer = styled(Box)({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
});

export const Logo = styled(Box)({
	width: 60,
	height: 60,
	marginBottom: "1rem",
});

export const Title = styled(Typography)({
	color: "#FF4081",
	fontSize: "30px",
	fontWeight: "bold",
	marginBottom: "20px",
});

export const StyledTextField = styled(TextField)({
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#ccc",
		},
		"&:hover fieldset": {
			borderColor: "#FF4081",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#FF4081",
		},
	},
	"& .MuiInputLabel-root.Mui-focused": {
		color: "#FF4081",
	},
});

export const SignInButton = styled(Button)({
	marginBottom: "1.5rem",
	padding: "10px 20px",
	fontSize: "1rem",
	background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
	color: "#fff",
	borderRadius: "25px",
	width: "50%",
	cursor: "pointer",
	"&:hover": {
		backgroundColor: "#FF4081",
	},
	"&:disabled": {
		background: "rgba(255,105,135, 0.5)",
		color: "rgba(255, 255, 255, 0.7)",
	},
});

export const StyledLink = styled(Link)({
	color: "#000",
	fontSize: "20px",
	"& span": {
		color: "#FF4081",
		textDecoration: "none",
	},
	textDecoration: "none",
});

export const StyledDatePicker = styled(DatePicker)({
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#ccc",
		},
		"&:hover fieldset": {
			borderColor: "#FF4081",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#FF4081",
		},
	},
	"& .MuiInputLabel-root.Mui-focused": {
		color: "#FF4081",
	},
});
