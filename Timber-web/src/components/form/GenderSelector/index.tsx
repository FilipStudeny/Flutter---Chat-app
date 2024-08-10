// src/components/form/GenderSelector.tsx
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { Gender } from '../../../constants/Enums/Gender';
import { GenderButtonContainer, GenderButton, IconContainer } from './styles';
interface GenderSelectorProps {
    onGenderSelect: (genders: Gender[]) => void;
    selectableAll?: boolean;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ onGenderSelect, selectableAll = false }) => {
    const [selectedGenders, setSelectedGenders] = useState<Gender[]>([]);

    const handleGenderSelect = (gender: Gender) => {
        let updatedGenders: Gender[];

        if (selectableAll) {
            if (selectedGenders.includes(gender)) {
                updatedGenders = selectedGenders.filter((g) => g !== gender);
            } else {
                updatedGenders = [...selectedGenders, gender];
            }
        } else {
            updatedGenders = [gender];
        }

        setSelectedGenders(updatedGenders);
        onGenderSelect(updatedGenders);
    };

    return (
        <GenderButtonContainer>
            <Typography variant="h6" color="textSecondary" mr={2}>
                Gender:
            </Typography>
            <GenderButton
                className={selectedGenders.includes(Gender.Male) ? 'selected' : ''}
                onClick={() => handleGenderSelect(Gender.Male)}
            >
                <IconContainer>
                    <MaleIcon />
                    <Typography variant="body1">Male</Typography>
                </IconContainer>
            </GenderButton>
            <GenderButton
                className={selectedGenders.includes(Gender.Female) ? 'selected' : ''}
                onClick={() => handleGenderSelect(Gender.Female)}
            >
                <IconContainer>
                    <FemaleIcon />
                    <Typography variant="body1">Female</Typography>
                </IconContainer>
            </GenderButton>
        </GenderButtonContainer>
    );
};

export default GenderSelector;
