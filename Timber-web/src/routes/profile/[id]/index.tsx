import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Avatar,
    Grid,
    Modal,
    IconButton,
    CircularProgress,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { getUser } from '../../../services/DatabaseService/getUser';
import { UserDataModel } from '../../../constants/Models/UserDataModel';

const UserProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [openModal, setOpenModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [user, setUser] = useState<UserDataModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                const response = await getUser(id);
                if (response.success && response.data) {
                    setUser(response.data);
                } else {
                    setError(response.message || 'Failed to load user data.');
                }
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleOpenModal = (photoUrl: string) => {
        setPhotoUrl(photoUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDownloadPhoto = () => {
        if (photoUrl) {
            const link = document.createElement('a');
            link.href = photoUrl;
            link.download = 'photo.jpg'; // Customize the downloaded file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up the DOM by removing the link element
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Box display="flex" justifyContent="center" mt={4}>
                    <Typography variant="body1" color="error">
                        {error}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box display="flex" flexDirection="column" alignItems="center" pt={2}>
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        alt={user?.firstName + ' ' + user?.lastName}
                        src={user?.profilePictureUrl}
                        sx={{ width: 150, height: 150, borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => handleOpenModal(user?.profilePictureUrl || '')}
                        variant="square"
                    />
                    <Typography
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '0 0 8px 8px',
                        }}
                    >
                        {user?.username}, {user?.age}
                    </Typography>
                </Box>
                <Paper elevation={2} sx={{ mt: 2, p: 2, width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        User Info
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Name:</strong> {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Email:</strong> {user?.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Date of Birth:</strong>{' '}
                        {user?.dateOfBirth ? user.dateOfBirth.toLocaleDateString() : 'N/A'}
                    </Typography>
                </Paper>

                <Paper elevation={2} sx={{ mt: 4, p: 2, width: '100%' }}>
                    <Typography variant="h6">About Me</Typography>
                    <Typography variant="body1" mt={1}>
                        {user?.aboutMe}
                    </Typography>
                </Paper>

                <Paper elevation={2} sx={{ mt: 4, p: 2, width: '100%' }}>
                    <Typography variant="h6">Photos</Typography>
                    <Grid container spacing={2} mt={1}>
                        <Grid item>
                            <Avatar
                                alt={user?.username}
                                src={user?.profilePictureUrl}
                                sx={{ width: 100, height: 100, borderRadius: '8px', cursor: 'pointer' }}
                                onClick={() => handleOpenModal(user?.profilePictureUrl || '')}
                                variant="square"
                            />
                        </Grid>
                        {/* Add more photos as needed */}
                        <Grid item>
                            <Avatar
                                sx={{ width: 100, height: 100, backgroundColor: '#e0e0e0', borderRadius: '8px' }}
                                variant="square"
                            >
                                +
                            </Avatar>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black background
                    }}
                    onClick={handleCloseModal} // Close modal when clicking outside the image
                >
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'fixed',
                            top: '16px',
                            right: '16px',
                            color: 'white',
                            fontSize: '32px',
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        onClick={handleDownloadPhoto}
                        sx={{
                            position: 'fixed',
                            top: '16px',
                            left: '16px',
                            color: 'white',
                            fontSize: '32px',
                        }}
                    >
                        <DownloadIcon fontSize="inherit" />
                    </IconButton>
                    <img
                        src={photoUrl as string}
                        alt="User Photo"
                        style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', cursor: 'auto' }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
                    />
                </Box>
            </Modal>
        </Container>
    );
};

export default UserProfilePage;
