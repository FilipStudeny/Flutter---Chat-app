// StyledComponents.tsx
import { TextField, Slider, Button, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

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
	marginBottom: "16px",
});

export const GradientSlider = styled(Slider)({
	color: "#FF4081",
	"& .MuiSlider-track": {
		background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
		border: "none",
	},
	"& .MuiSlider-rail": {
		opacity: 0.5,
		backgroundColor: "#bfbfbf",
	},
	"& .MuiSlider-thumb": {
		backgroundColor: "#ffffff",
		border: "2px solid currentColor",
		"&:focus, &:hover, &$active": {
			boxShadow: "inherit",
		},
	},
	marginTop: "16px",
});

export const StyledButton = styled(Button)({
	borderRadius: "30px",
	background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
	color: "white",
	textTransform: "none",
	padding: "10px 30px",
	fontWeight: "bold",
	transition: "background-color 0.3s ease",
	"&:hover": {
		background: "linear-gradient(45deg, rgba(255,105,135,1) 0%, rgba(255,64,129,1) 100%)",
	},
});

export const StyledIconButton = styled(IconButton)({
	borderRadius: "50%",
	margin: "0 8px",
	transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
	border: "2px solid transparent",
	"&:hover": {
		backgroundColor: "rgba(255, 64, 129, 0.1)",
	},
	"&.selected": {
		backgroundColor: "#FF4081",
		borderColor: "#FF4081",
		color: "#ffffff",
	},
});
