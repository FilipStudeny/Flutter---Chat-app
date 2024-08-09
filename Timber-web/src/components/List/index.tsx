// src/components/UserList.tsx
import React, { useState, useEffect } from 'react';
import { Button, Container, List, ListItem, ListItemText } from '@mui/material';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simulate API call to fetch users
        const fetchUsers = () => {
            setLoading(true);
            setTimeout(() => {
                setUsers([...users, 'User 1', 'User 2', 'User 3']); // Add more users
                setLoading(false);
            }, 1000);
        };

        fetchUsers();
    }, []);

    const handleRefresh = () => {
        setUsers([]);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
            // Load more users when scrolled to bottom
            setLoading(true);
            setTimeout(() => {
                setUsers([...users, 'User 4', 'User 5', 'User 6']);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <Container sx={{ mt: 2, mb: 10 }} onScroll={handleScroll} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {users.length === 0 && (
                <Button variant="contained" color="secondary" onClick={handleRefresh} fullWidth>
                    Refresh
                </Button>
            )}
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={user} />
                    </ListItem>
                ))}
            </List>
            {loading && <div>Loading...</div>}
        </Container>
    );
};

export default UserList;
