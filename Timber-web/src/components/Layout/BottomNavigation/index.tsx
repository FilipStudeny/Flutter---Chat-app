import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Person, Group, Settings } from '@mui/icons-material';

const BottomNav: React.FC = () => {
    const [value, setValue] = React.useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Profile" icon={<Person />} />
                <BottomNavigationAction label="Matches" icon={<Group />} />
                <BottomNavigationAction label="Settings" icon={<Settings />} />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;
