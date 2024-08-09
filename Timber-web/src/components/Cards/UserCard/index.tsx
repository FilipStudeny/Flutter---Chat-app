import React from 'react';
import { CardMedia, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
    StyledCard,
    ClickableCard,
    HorizontalCard,
    ClickableHorizontalCard,
    OnlineStatusOnline,
    OnlineStatusOffline,
    StyledCardContent,
    HorizontalCardContent,
    FavoriteIconButton,
    UserInfo,
} from './styles';

interface UserCardProps {
    photoUrl: string;
    username: string;
    age: number;
    online: boolean;
    clickable?: boolean;
    onClick?: () => void;
    horizontal?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
    photoUrl,
    username,
    age,
    online,
    clickable = false,
    onClick,
    horizontal = false,
}) => {
    const CardComponent = clickable
        ? horizontal
            ? ClickableHorizontalCard
            : ClickableCard
        : horizontal
            ? HorizontalCard
            : StyledCard;

    const CardContentComponent = horizontal ? HorizontalCardContent : StyledCardContent;

    return (
        <CardComponent onClick={clickable ? onClick : undefined}>
            {online ? <OnlineStatusOnline /> : <OnlineStatusOffline />}
            <CardMedia
                component="img"
                height={horizontal ? '100%' : '200'}
                image={photoUrl}
                alt={username}
                sx={{ width: horizontal ? '150px' : '100%' }}
            />
            <CardContentComponent>
                <UserInfo>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                        {age} years
                    </Typography>
                </UserInfo>
                <FavoriteIconButton>
                    <FavoriteIcon />
                </FavoriteIconButton>
            </CardContentComponent>
        </CardComponent>
    );
};

export default UserCard;
