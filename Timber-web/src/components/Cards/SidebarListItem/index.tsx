import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Badge, Avatar } from '@mui/material';

interface SidebarUserItemProps {
    user: {
        id: number;
        name: string;
        avatar: string;
        online: boolean;
    };
}

const SidebarUserItem: React.FC<SidebarUserItemProps> = ({ user }) => {
    return (
        <ListItem
            sx={{
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Change background color on hover
                    cursor: 'pointer', // Add a pointer cursor on hover
                },
            }}
        >
            <ListItemAvatar>
                <Badge
                    color={user.online ? 'success' : 'error'}
                    overlap="circular"
                    badgeContent=" "
                    variant="dot"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                >
                    <Avatar alt={user.name} src={user.avatar} />
                </Badge>
            </ListItemAvatar>
            <ListItemText primary={user.name} />
        </ListItem>
    );
};

export default SidebarUserItem;
