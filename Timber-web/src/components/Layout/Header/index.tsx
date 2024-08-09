import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, InputBase, Box, Button } from '@mui/material';
import { Search, Notifications, Settings, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    appBarStyles,
    toolbarStyles,
    profileButtonStyles,
    avatarStyles,
    searchBoxStyles,
    searchIconStyles,
    inputBaseStyles,
    buttonStyles,
    iconButtonStyles,
} from './styles'; 

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <AppBar position="fixed" sx={appBarStyles}>
            <Toolbar sx={toolbarStyles}>
                <Button color="inherit" onClick={handleProfileClick} sx={profileButtonStyles}>
                    <Avatar
                        alt="User Name"
                        src="https://randomuser.me/api/portraits/women/71.jpg"
                        sx={avatarStyles}
                    />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        nika
                    </Typography>
                </Button>

                <Box sx={searchBoxStyles}>
                    <Search sx={searchIconStyles} />
                    <InputBase placeholder="Search…" sx={inputBaseStyles} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button color="inherit" sx={buttonStyles}>
                        Sign In
                    </Button>
                    <Button color="inherit" sx={buttonStyles}>
                        Sign Up
                    </Button>
                    <IconButton color="inherit" sx={iconButtonStyles}>
                        <Settings />
                    </IconButton>
                    <IconButton color="inherit" sx={iconButtonStyles}>
                        <Person />
                    </IconButton>
                    <IconButton color="inherit" sx={iconButtonStyles}>
                        <Badge badgeContent={1} color="secondary">
                            <Notifications />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
