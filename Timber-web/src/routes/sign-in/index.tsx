import ParkIcon from "@mui/icons-material/Park";
import { FormControl, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginContainer, Logo, LogoContainer, SignInButton, StyledLink, StyledTextField, Title } from "./styles";
import AppRoutes from "../../constants/Enums/AppRoutes";
import { useAuth } from "../../context/AuthenticationContext";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [emailError, setEmailError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [loginError, setLoginError] = useState<string>("");
	const navigate = useNavigate();

	const { login } = useAuth();

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		let valid = true;

		if (!email) {
			setEmailError("Email is required");
			valid = false;
		} else if (!validateEmail(email)) {
			setEmailError("Enter a valid email");
			valid = false;
		} else {
			setEmailError("");
		}

		if (!password) {
			setPasswordError("Password is required");
			valid = false;
		} else {
			setPasswordError("");
		}

		if (valid) {
			const response = await login(email, password);

			if (response.success) {
				setLoginError("");
				navigate(AppRoutes.Home);
			} else {
				setLoginError(response.message || "Login failed. Please check your email and password and try again.");
			}
		}
	};

	return (
		<LoginContainer>
			<LogoContainer>
				<Logo>
					<ParkIcon style={{ fontSize: 60, color: "#FF4081" }} />
				</Logo>
				<Title variant='h5'>Timber - Sign in</Title>
			</LogoContainer>
			<FormControl component='form' onSubmit={handleSubmit} fullWidth>
				<StyledTextField
					label='Email'
					variant='outlined'
					fullWidth
					margin='normal'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={!!emailError}
					helperText={emailError}
				/>
				<StyledTextField
					label='Password'
					variant='outlined'
					fullWidth
					type='password'
					margin='normal'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					error={!!passwordError}
					helperText={passwordError}
				/>
				{loginError && (
					<Typography
						color='error'
						variant='body2'
						align='center'
						sx={{
							backgroundColor: "rgba(255,64,129,0.1)",
							border: "1px solid #FF4081",
							borderRadius: "5px",
							padding: "10px",
							margin: "10px 0",
							fontWeight: "bold",
							color: "#FF4081",
						}}
					>
						{loginError}
					</Typography>
				)}
				<Box display='flex' justifyContent='center'>
					<SignInButton type='submit' variant='contained'>
						Sign in
					</SignInButton>
				</Box>
			</FormControl>
			<StyledLink href={`${AppRoutes.Register}`} underline='none'>
				Don&apos;t have an account? <span>Create an account</span>{" "}
			</StyledLink>

			<StyledLink href={`${AppRoutes.ForgottenPassword}`} underline='none'>
				Forgot password? <span>Recover it</span>
			</StyledLink>
		</LoginContainer>
	);
};

export default LoginPage;
