import ParkIcon from "@mui/icons-material/Park";
import { Box, FormControl, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Logo, LogoContainer, SignInButton, StyledLink, Title, RegisterContainer, StyledTextField } from "./styles";
import GenderSelector from "../../components/form/GenderSelector";
import { ImagePicker } from "../../components/form/ImageSelector";
import AppRoutes from "../../constants/Enums/AppRoutes";
import { Gender } from "../../constants/Enums/Gender";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";

const RegisterPage: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [selectedGender, setSelectedGender] = useState<Gender[]>([]);
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [repeatPassword, setRepeatPassword] = useState<string>("");
	const [aboutMe, setAboutMe] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [signUpError, setsignUpError] = useState<string>("");
	const navigate = useNavigate();

	const { signup } = useAuth();

	useEffect(() => {
		const checkFormValidity = () => {
			const isValid =
				!errors.firstName &&
				!errors.lastName &&
				!errors.username &&
				!errors.email &&
				!errors.password &&
				!errors.repeatPassword &&
				!errors.aboutMe &&
				!errors.dateOfBirth &&
				!errors.gender &&
				!errors.selectedImage &&
				Boolean(firstName) &&
				Boolean(lastName) &&
				Boolean(username) &&
				Boolean(email) &&
				Boolean(password) &&
				Boolean(repeatPassword) &&
				Boolean(aboutMe) &&
				Boolean(dateOfBirth) &&
				selectedGender.length > 0 &&
				Boolean(selectedImage);

			setIsFormValid(isValid);
		};

		checkFormValidity();
	}, [
		errors,
		firstName,
		lastName,
		username,
		email,
		password,
		repeatPassword,
		aboutMe,
		dateOfBirth,
		selectedGender,
		selectedImage,
	]);

	const handleImageSelected = (file: File) => {
		setSelectedImage(file);
	};

	const handleGenderSelect = (genders: Gender[]) => {
		setSelectedGender(genders);
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!firstName) newErrors.firstName = "First Name is required";
		if (!lastName) newErrors.lastName = "Last Name is required";
		if (!username) newErrors.username = "Username is required";
		if (!email) newErrors.email = "Email is required";
		if (!password) newErrors.password = "Password is required";
		if (!repeatPassword) newErrors.repeatPassword = "Repeat Password is required";
		if (password !== repeatPassword) newErrors.repeatPassword = "Passwords do not match";
		if (!aboutMe) newErrors.aboutMe = "About Me is required";

		if (!dateOfBirth) {
			newErrors.dateOfBirth = "Date of Birth is required";
		} else {
			const today = dayjs();
			const age = today.diff(dateOfBirth, "year");
			if (age < 18) {
				newErrors.dateOfBirth = "You must be at least 18 years old";
			}
		}

		if (selectedGender.length === 0) newErrors.gender = "Gender is required";
		if (!selectedImage) newErrors.selectedImage = "Profile Picture is required";

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (validateForm()) {
			const newUser: UserDataModel = {
				uid: "",
				profilePictureUrl: "",
				username,
				firstName,
				lastName,
				email,
				gender: selectedGender[0],
				dateOfBirth: dateOfBirth?.toDate(),
				phoneNumber: null,
				friends: [],
				aboutMe,
			};

			const response = await signup(newUser, password, selectedImage);
			if (response.success) {
				setsignUpError("");
				navigate(AppRoutes.SignIn);
			} else {
				setsignUpError(response.message || "Signup failed. Please try again.");
			}
		}
	};

	return (
		<RegisterContainer maxWidth='sm' sx={{ mt: 5 }}>
			<LogoContainer>
				<Logo>
					<ParkIcon style={{ fontSize: 60, color: "#FF4081" }} />
				</Logo>
				<Title variant='h5'>Timber - Register</Title>
			</LogoContainer>
			<FormControl component='form' onSubmit={handleSubmit} fullWidth>
				<StyledTextField
					fullWidth
					label='First Name'
					margin='normal'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					error={!!errors.firstName}
					helperText={errors.firstName}
				/>
				<StyledTextField
					fullWidth
					label='Last Name'
					margin='normal'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					error={!!errors.lastName}
					helperText={errors.lastName}
				/>
				<StyledTextField
					fullWidth
					label='Username'
					margin='normal'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					error={!!errors.username}
					helperText={errors.username}
				/>
				<StyledTextField
					fullWidth
					label='Email'
					margin='normal'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					error={!!errors.email}
					helperText={errors.email}
				/>
				<StyledTextField
					fullWidth
					label='Password'
					type='password'
					margin='normal'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					error={!!errors.password}
					helperText={errors.password}
				/>
				<StyledTextField
					fullWidth
					label='Repeat Password'
					type='password'
					margin='normal'
					value={repeatPassword}
					onChange={(e) => setRepeatPassword(e.target.value)}
					error={!!errors.repeatPassword}
					helperText={errors.repeatPassword}
				/>
				<StyledTextField
					fullWidth
					label='About Me'
					multiline
					rows={4}
					margin='normal'
					value={aboutMe}
					onChange={(e) => setAboutMe(e.target.value)}
					error={!!errors.aboutMe}
					helperText={errors.aboutMe}
				/>

				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						label='Select Date of Birth'
						value={dateOfBirth}
						onChange={(date) => setDateOfBirth(date)}
						slotProps={{
							textField: {
								error: !!errors.dateOfBirth,
								helperText: errors.dateOfBirth,
								fullWidth: true,
								margin: "normal",
							},
						}}
					/>
				</LocalizationProvider>

				<Box mb={2}>
					<GenderSelector onGenderSelect={handleGenderSelect} />
					{errors.gender && <Typography color='error'>{errors.gender}</Typography>}
				</Box>
				<Box mb={2} display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
					<ImagePicker onImageSelected={handleImageSelected} />
					{errors.selectedImage && (
						<Typography color='error' sx={{ textAlign: "center" }}>
							{errors.selectedImage}
						</Typography>
					)}
				</Box>

				<Box display='flex' justifyContent='center'>
					<SignInButton type='submit' variant='contained' disabled={!isFormValid}>
						Create account
					</SignInButton>
				</Box>
				{signUpError && (
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
						{signUpError}
					</Typography>
				)}
			</FormControl>

			<StyledLink mb={2} href={`${AppRoutes.SignIn}`} underline='none'>
				Already have an account? <span>Sign in</span>
			</StyledLink>
		</RegisterContainer>
	);
};

export default RegisterPage;
