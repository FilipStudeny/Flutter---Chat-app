import React, { useState } from 'react';
import ParkIcon from '@mui/icons-material/Park';
import { FormControl, Box } from '@mui/material';
import { useAuth } from '../../context/AuthenticationContext';
import { AppRoutes } from '../../constants/Enums/AppRoutes';
import { LoginContainer, LogoContainer, Logo, StyledTextField, SignInButton, StyledLink, Title } from './styles';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { resetPassword } = useAuth(); 

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage('');

        if (!email) {
            setEmailError('Email is required');
        } else if (!validateEmail(email)) {
            setEmailError('Enter a valid email');
        } else {
            setEmailError('');
            try {
                await resetPassword(email); 
                setMessage('Check your email for further instructions.');
            } catch (error) {
                console.error('Failed to reset password:', error);
                setMessage('Failed to reset password. Please try again.');
            }
        }
    };

    return (
        <LoginContainer>
            <LogoContainer>
                <Logo>
                    <ParkIcon style={{ fontSize: 60, color: '#FF4081' }} />
                </Logo>
                <Title variant="h5">Timber - Forgot password</Title>
            </LogoContainer>
            <FormControl component="form" onSubmit={handleSubmit} fullWidth>
                <StyledTextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                />
                <Box display="flex" justifyContent="center">
                    <SignInButton type="submit" variant="contained">Reset Password</SignInButton>
                </Box>
                {message && <p>{message}</p>}
            </FormControl>
            <StyledLink href={`${AppRoutes.SignIn}`} underline="none">
                Remember your password? <span>Sign in</span>
            </StyledLink>
        </LoginContainer>
    );
};

export default ForgotPasswordPage;
