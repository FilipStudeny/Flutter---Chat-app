import { styled } from '@mui/system';
import { Card, CardContent, Box, Avatar, IconButton } from '@mui/material';
import { green, red } from '@mui/material/colors';

export const StyledCard = styled(Card)({
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    width: '280px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
});

export const HorizontalCard = styled(StyledCard)({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '150px',
});

export const ClickableCard = styled(StyledCard)({
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
    },
});

export const ClickableHorizontalCard = styled(HorizontalCard)({
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
    },
});

export const OnlineStatusOnline = styled(Avatar)({
    position: 'absolute',
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    border: '2px solid white',
    backgroundColor: green[500],
});

export const OnlineStatusOffline = styled(Avatar)({
    position: 'absolute',
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    border: '2px solid white',
    backgroundColor: red[500],
});

export const StyledCardContent = styled(CardContent)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '8px',
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
});

export const HorizontalCardContent = styled(StyledCardContent)({
    position: 'relative',
    background: 'none',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    width: 'calc(100% - 150px)',
});

export const UserInfo = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
});

export const FavoriteIconButton = styled(IconButton)({
    color: 'red',
});
