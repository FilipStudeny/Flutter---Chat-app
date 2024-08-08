import { styled } from '@mui/system';
import { Box, Button, Typography, Link, TextField } from '@mui/material';

export const RegisterContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    textAlign: 'center',
    width: '50%',
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
    color: '#FF4081',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '20px',
});

export const StyledTextField = styled(TextField)({
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#ccc',
        },
        '&:hover fieldset': {
            borderColor: '#FF4081',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FF4081',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#FF4081',
    },
});

export const SignInButton = styled(Button)({
    marginBottom: '1.5rem',
    padding: '10px 20px',
    fontSize: '1rem',
    background: 'linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)',
    color: '#fff',
    borderRadius: '25px',
    '&:hover': {
        backgroundColor: '#FF4081',
    },
    width: '50%'
});


export const StyledLink = styled(Link)({
    color: '#000',
    fontSize: '20px',
    '& span': {
        color: '#FF4081',
        textDecoration: 'none',
    },
    textDecoration: 'none',
});
