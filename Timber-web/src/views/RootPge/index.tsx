// src/WelcomePage.tsx
import React from 'react';
import ParkIcon from '@mui/icons-material/Park';
import { Logo, LogoContainer, SignInButton, StyledLink, Title, WelcomeContainer } from './styles';

const WelcomePage: React.FC = () => {
    return (
        <WelcomeContainer>
            <LogoContainer>
                <Logo>
                    <ParkIcon style={{ fontSize: 60, color: '#fff' }} />
                </Logo>
                <Title variant="h4">Timber</Title>
            </LogoContainer>
            <SignInButton href='/login' variant="contained">Sign into your account</SignInButton>
            <StyledLink href="/register" underline="none">
                Create a New Account
            </StyledLink>
            
            <StyledLink href="#" underline="none">
                Trouble Logging In?
            </StyledLink>
        </WelcomeContainer>
    );
};

export default WelcomePage;
