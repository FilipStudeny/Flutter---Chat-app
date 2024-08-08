import { Container, Typography, TextField, Link } from '@mui/material';
import React from 'react';
import { Background, Logo, MainButton, Heading } from '../LoginPage/styles';

const LoginPage: React.FC = () => {
    return (
        <Background>
            <Container maxWidth="xs">
                <Logo>🌲</Logo>
                <Heading>
                    Timber - Sign in
                </Heading>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email"
                    type="email"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                />
                <MainButton variant="contained" fullWidth>
                    Sign in
                </MainButton>
                <Typography variant="body2" color="textSecondary">
                    Don't have an account?{' '}
                    <Link href="/register" color="secondary">
                        Create an account
                    </Link>
                </Typography>
            </Container>
        </Background>
    );
};

export default LoginPage;
