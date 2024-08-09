import React, { useEffect, useState } from 'react';
import { Container, Button, Box, Typography, CircularProgress, Grid } from '@mui/material';
import UserCard from '../../components/Cards/UserCard';

interface User {
  photoUrl: string;
  username: string;
  age: number;
  gender: string;
  online: boolean;
}

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = () => {
      setLoading(true);
      setTimeout(() => {
        setUsers([
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },

          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },

          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },

          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },

          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },

          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },
          
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Emily', age: 24, gender: 'Female', online: true },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'John', age: 30, gender: 'Male', online: false },
          { photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', username: 'Anna', age: 22, gender: 'Female', online: true },
        ]);
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
        setUsers((prevUsers) => [
          ...prevUsers,
          { photoUrl: '/path/to/photo4.jpg', username: 'Chris', age: 28, gender: 'Male', online: true },
          { photoUrl: '/path/to/photo5.jpg', username: 'Sophia', age: 26, gender: 'Female', online: false },
        ]);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '16px',
        paddingBottom: '16px',
        width: '100%', // Ensures the container doesn't exceed the maxWidth
        height: '100%',
        justifyContent: 'flex-start', // Pushes content to start from the top
        overflowY: 'auto', // Enables scrolling within the container
      }}
      onScroll={handleScroll}
    >
      <Typography variant="h5" gutterBottom textAlign="center">
        User List
      </Typography>
      {users.length === 0 && !loading && (
        <Button variant="contained" color="secondary" onClick={handleRefresh} fullWidth>
          Refresh
        </Button>
      )}
      <Grid container spacing={2} justifyContent="center">
        {users.map((user, index) => (
          <Grid
            item
            key={index}
          >
            <UserCard
              photoUrl={user.photoUrl}
              username={user.username}
              age={user.age}
              online={user.online}
              clickable={true}
              horizontal={false}
            />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
