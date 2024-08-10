// src/components/form/styles.ts
import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

export const GenderButtonContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
});

export const GenderButton = styled(Button)({
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '25px',
    color: '#fff',
    backgroundColor: '#ccc',
    '&.selected': {
        backgroundColor: '#FF4081',
    },
    '&:not(.selected)': {
        backgroundColor: '#ccc',
    },
});

export const IconContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});
