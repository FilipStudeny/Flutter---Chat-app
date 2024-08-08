// src/WelcomePage.styles.ts
import { styled } from '@mui/system';
import { Box, Button, Typography, Link } from '@mui/material';

export const WelcomeContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(0deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
});

export const LogoContainer = styled(Box)({
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

export const Logo = styled(Box)({
    width: 60,
    height: 60,
    marginBottom: '1rem',
});

export const Title = styled(Typography)({
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 'bold',
});

export const SignInButton = styled(Button)({
    marginBottom: '1.5rem',
    padding: '10px 20px',
    fontSize: '20px',
    backgroundColor: '#fff',
    color: '#FF4081',
    borderRadius: '25px',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
    width: '30%'
});

export const StyledLink = styled(Link)({
    color: '#fff',
    fontSize: '25px',
    margin: '1rem',
});
