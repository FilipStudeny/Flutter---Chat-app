import React, { useState } from 'react';
import ParkIcon from '@mui/icons-material/Park';
import { FormControl, Box } from '@mui/material';
import { LoginContainer, Logo, LogoContainer, SignInButton, StyledLink, StyledTextField, Title } from './styles';
import { AppRoutes } from '../../constants/Enums/AppRoutes';
import { useAuth } from '../../context/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
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
            setEmailError('Email is required');
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Enter a valid email');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (valid) {
            try {
                await login(email, password); // Call the login function with email and password
                console.log('Logged in successfully');
                // Redirect or show a success message after successful login

                navigate(AppRoutes.Home);
            } catch (error) {
                console.error('Login failed:', error);
                // Handle login errors, e.g., show a notification or set an error state
            }
        }
    };

    return (
        <LoginContainer>
            <LogoContainer>
                <Logo>
                    <ParkIcon style={{ fontSize: 60, color: '#FF4081' }} />
                </Logo>
                <Title variant="h5">Timber - Sign in</Title>
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
                <StyledTextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                />
                <Box display="flex" justifyContent="center">
                    <SignInButton type="submit" variant="contained">Sign in</SignInButton>
                </Box>
            </FormControl>
            <StyledLink href={`${AppRoutes.Register}`} underline="none">
                Don't have an account? <span>Create an account</span>
            </StyledLink>

            <StyledLink href={`${AppRoutes.ForgottenPassword}`} underline="none">
                Forgot password ? <span>Recover it</span>
            </StyledLink>
        </LoginContainer>
    );
};

export default LoginPage;
