import React, { FormEvent, useState } from 'react';
import { Box, FormControl } from '@mui/material';
import { Logo, LogoContainer, SignInButton, StyledLink, Title, StyledTextField, RegisterContainer } from './styles';
import ParkIcon from '@mui/icons-material/Park';
import ImagePicker from '../../components/form/ImagePicker';

const RegisterPage: React.FC = () => {
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const handleImageCropped = (croppedImage: string) => {
        setCroppedImage(croppedImage);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form Submitted', { croppedImage });
    };

    return (
        <RegisterContainer maxWidth="sm" sx={{ mt: 5 }}>
            <LogoContainer>
                <Logo>
                    <ParkIcon style={{ fontSize: 60, color: '#FF4081' }} />
                </Logo>
                <Title variant="h5">Timber - Register</Title>
            </LogoContainer>
            <FormControl component="form" onSubmit={handleSubmit} fullWidth>
                <StyledTextField fullWidth label="First Name" margin="normal" />
                <StyledTextField fullWidth label="Last Name" margin="normal" />
                <StyledTextField fullWidth label="Username" margin="normal" />
                <StyledTextField fullWidth label="Email" margin="normal" />
                <StyledTextField fullWidth label="Password" type="password" margin="normal" />
                <StyledTextField fullWidth label="Repeat Password" type="password" margin="normal" />
                <StyledTextField fullWidth label="About Me" multiline rows={4} margin="normal" />
                <StyledTextField
                    fullWidth
                    label="Select Date of Birth"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <ImagePicker onImageCropped={handleImageCropped} />
                <Box display="flex" justifyContent="center">
                    <SignInButton type="submit" variant="contained">Create account</SignInButton>
                </Box>
            </FormControl>

            <StyledLink href="/login" underline="none">
                Already have an account? <span>Sign in</span>
            </StyledLink>
        </RegisterContainer>
    );
};

export default RegisterPage;
