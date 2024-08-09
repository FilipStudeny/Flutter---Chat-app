import React from 'react';
import { Box, Typography, IconButton, List } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SidebarUserItem from '../../Cards/SidebarListItem';
import {
    sidebarContainerStyles,
    sidebarHeaderStyles,
    closeButtonStyles,
    rightCloseButtonStyles,
    headerTextStyles,
} from './styles'; 

interface SidebarProps {
    users: Array<{
        id: number;
        name: string;
        avatar: string;
        online: boolean;
    }>;
    onClose: () => void; 
    side: 'left' | 'right'; 
    borderPosition: 'left' | 'right'; 
}

const Sidebar: React.FC<SidebarProps> = ({ users, onClose, side, borderPosition }) => {
    return (
        <Box
            sx={{
                ...sidebarContainerStyles,
                borderLeft: borderPosition === 'left' ? '1px solid #e0e0e0' : 'none',
                borderRight: borderPosition === 'right' ? '1px solid #e0e0e0' : 'none',
                order: side === 'left' ? -1 : 1,
            }}
        >
            <Box
                sx={{
                    ...sidebarHeaderStyles,
                    justifyContent: borderPosition === 'left' ? 'flex-start' : 'flex-end',
                }}
            >
                {borderPosition === 'left' && (
                    <IconButton sx={closeButtonStyles} onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                )}
                <Typography
                    variant="h6"
                    sx={{
                        ...headerTextStyles,
                        textAlign: borderPosition === 'left' ? 'left' : 'right',
                    }}
                >
                    Online Users
                </Typography>
                {borderPosition === 'right' && (
                    <IconButton sx={rightCloseButtonStyles} onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            <List>
                {users.map((user) => (
                    <SidebarUserItem key={user.id} user={user} />
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
