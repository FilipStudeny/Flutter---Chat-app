import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    sidebarContainerStyles,
    sidebarHeaderStyles,
    closeButtonStyles,
    rightCloseButtonStyles,
    headerTextStyles,
    sidebarToggleButtonStyles,
} from './styles';

interface SidebarProps {
    side: 'left' | 'right';
    borderPosition: 'left' | 'right';
    isOpen: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ side, borderPosition, isOpen, onToggle, children }) => {
    if (!isOpen) {
        return (
            <IconButton
                sx={{
                    ...sidebarToggleButtonStyles,
                    [side === 'left' ? 'left' : 'right']: 0,
                    borderRadius: side === 'left' ? '0 4px 4px 0' : '4px 0 0 4px',
                }}
                onClick={onToggle}
                aria-label={`open ${side} sidebar`}
            >
                {side === 'left' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        );
    }

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
                    <IconButton sx={closeButtonStyles} onClick={onToggle} aria-label="close">
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
                    Sidebar
                </Typography>
                {borderPosition === 'right' && (
                    <IconButton sx={rightCloseButtonStyles} onClick={onToggle} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            <Box sx={{ padding: 0 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;
