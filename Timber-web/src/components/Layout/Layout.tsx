import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNavigation';
import Header from './Header';
import FriendsSidebar from './FriendsSidebar';  // Import the new FriendsSidebar component
import {
    layoutContainerStyles,
    mainContentStyles,
} from './styles';

const AppLayout: React.FC = () => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

    return (
        <>
            <Header />

            <Box sx={layoutContainerStyles}>
                <FriendsSidebar
                    side="left"
                    borderPosition="right"
                    isOpen={leftSidebarOpen}
                    onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
                />

                <Box component="main" sx={mainContentStyles}>
                    <Outlet />
                </Box>
            </Box>

            <BottomNav />
        </>
    );
};

export default AppLayout;
