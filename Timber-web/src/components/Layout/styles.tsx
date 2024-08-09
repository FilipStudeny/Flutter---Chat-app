import { SxProps, Theme } from '@mui/material/styles';

export const sidebarToggleButtonStyles: SxProps<Theme> = {
    position: 'fixed',
    top: '80px', 
    bgcolor: 'background.paper',
    borderRadius: '4px',
    boxShadow: 1,
    zIndex: 1000,
};

export const layoutContainerStyles: SxProps<Theme> = {
    width: '100%',
    flexGrow: 1,
    mt: '64px',
    mb: '56px',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
};

export const mainContentStyles: SxProps<Theme> = {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 2,
};
