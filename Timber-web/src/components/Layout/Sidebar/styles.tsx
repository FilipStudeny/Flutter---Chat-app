import { SxProps, Theme } from '@mui/material/styles';

export const sidebarContainerStyles: SxProps<Theme> = {
    width: '250px', 
    p: 1,
    overflowY: 'auto',
    bgcolor: 'background.paper', 
    position: 'sticky',
    top: '64px', 
    height: 'calc(100vh - 64px)', 
    borderLeft: '1px solid #e0e0e0',
    borderRight: 'none',
};

export const sidebarHeaderStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
};

export const closeButtonStyles: SxProps<Theme> = {
    mr: 1,
};

export const rightCloseButtonStyles: SxProps<Theme> = {
    ml: 1,
};

export const headerTextStyles: SxProps<Theme> = {
    flexGrow: 1,
    textAlign: 'left',
};

export const sidebarToggleButtonStyles: SxProps<Theme> = {
    position: 'fixed',
    top: '80px',
    bgcolor: 'background.paper',
    borderRadius: '4px',
    boxShadow: 1,
    zIndex: 1000,
};
