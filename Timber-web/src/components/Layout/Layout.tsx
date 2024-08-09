import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNavigation';
import Header from './Header';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Sidebar from './Sidebar';
import {
    sidebarToggleButtonStyles,
    layoutContainerStyles,
    mainContentStyles,
} from './styles';

const users = [
    { id: 1, name: 'John Doe', avatar: '/path/to/avatar1.jpg', online: true },
    { id: 2, name: 'Jane Smith', avatar: '/path/to/avatar2.jpg', online: false },
];

const AppLayout: React.FC = () => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    return (
        <>
            <Header />
            {leftSidebarOpen ? null : (
                <IconButton
                    sx={{
                        ...sidebarToggleButtonStyles,
                        left: 0,
                        borderRadius: '0 4px 4px 0',
                    }}
                    onClick={() => setLeftSidebarOpen(true)}
                    aria-label="open left sidebar"
                >
                    <ChevronRightIcon />
                </IconButton>
            )}

            {rightSidebarOpen ? null : (
                <IconButton
                    sx={{
                        ...sidebarToggleButtonStyles,
                        right: 0,
                        borderRadius: '4px 0 0 4px',
                    }}
                    onClick={() => setRightSidebarOpen(true)}
                    aria-label="open right sidebar"
                >
                    <ChevronLeftIcon />
                </IconButton>
            )}

            <Box sx={layoutContainerStyles}>
                {leftSidebarOpen && (
                    <Sidebar
                        users={users}
                        onClose={() => setLeftSidebarOpen(false)}
                        side="left"
                        borderPosition="right"
                    />
                )}

                <Box component="main" sx={mainContentStyles}>
                    <Outlet />
                </Box>

                {rightSidebarOpen && (
                    <Sidebar
                        users={users}
                        onClose={() => setRightSidebarOpen(false)}
                        side="right"
                        borderPosition="left"
                    />
                )}
            </Box>
            <BottomNav />
        </>
    );
};

export default AppLayout;
