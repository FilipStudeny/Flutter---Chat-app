import { SxProps, Theme } from '@mui/material/styles';

export const appBarStyles: SxProps<Theme> = {
    background: 'linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)',
    boxShadow: 'none',
    padding: '0 30px',
};

export const toolbarStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

export const profileButtonStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: 'white',
        color: '#FF1744',
    },
};

export const avatarStyles: SxProps<Theme> = {
    mr: 1,
    width: 40,
    height: 40,
    backgroundColor: 'initial',
};

export const searchBoxStyles: SxProps<Theme> = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: '8px 16px',
    marginRight: 2,
    width: '100%',
    maxWidth: '400px',
    boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
};

export const searchIconStyles: SxProps<Theme> = {
    color: 'white',
    fontSize: '1.5rem',
};

export const inputBaseStyles: SxProps<Theme> = {
    color: 'white',
    ml: 2,
    width: '100%',
    fontSize: '1rem',
    '& .MuiInputBase-input::placeholder': {
        color: 'white',
        opacity: 1,
    },
};

export const buttonStyles: SxProps<Theme> = {
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: 'white',
        color: '#FF1744', 
    },
};

export const iconButtonStyles: SxProps<Theme> = {
    padding: '8px',
    '&:hover': {
        backgroundColor: 'white',
        color: '#FF1744', 
        borderRadius: '50%',
    },
};
