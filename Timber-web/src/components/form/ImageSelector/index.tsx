import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AvatarEditor from 'react-avatar-edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import styled from '@emotion/styled';

const StyledIconButtonWrapper = styled('div')({
    background: 'linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)',
    borderRadius: '50%',
    padding: '5px',
    display: 'inline-block',
});

interface ImageCropperProps {
    onImageCropped: (croppedImage: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onImageCropped }) => {
    const [src, setSrc] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onClose = () => {
        setSrc(null);
        setPreview(null);
        onImageCropped(''); // Notify the parent that no image was selected
    };

    const onCrop = (view: string) => {
        setPreview(view);
        onImageCropped(view);
    };

    const onBeforeFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size > 716800) {
            alert("File is too big!");
            event.target.value = "";
        }
    };

    const onFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                <label htmlFor="upload-button">
                    <StyledIconButtonWrapper>
                        <IconButton color="primary" component="span">
                            <PhotoCamera sx={{ color: 'white' }} />
                        </IconButton>
                    </StyledIconButtonWrapper>
                </label>
                <input
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={onFileLoad}
                />
            </Box>
            {src && (
                <Box mt={2}>
                    <Typography variant="h6">Crop Your Picture</Typography>
                    <AvatarEditor
                        width={390}
                        height={295}
                        onCrop={onCrop}
                        onClose={onClose}
                        onBeforeFileLoad={onBeforeFileLoad}
                        src={src}
                    />
                </Box>
            )}
            {preview && (
                <Box mt={2} textAlign="center">
                    <Typography variant="h6">Cropped Image Preview:</Typography>
                    <img src={preview} alt="Cropped Image" style={{ width: 100, height: 100, borderRadius: '50%' }} />
                </Box>
            )}
        </>
    );
};

interface ImagePickerProps {
    onImageSelected: (file: File) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelected }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const onFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Display the selected image
            onImageSelected(file); // Pass the file to the parent component
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                <label htmlFor="upload-button">
                    <StyledIconButtonWrapper>
                        <IconButton color="primary" component="span">
                            <PhotoCamera sx={{ color: 'white' }} />
                        </IconButton>
                    </StyledIconButtonWrapper>
                </label>
                <input
                    type="file"
                    id="upload-button"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={onFileLoad}
                />
            </Box>
            {selectedImage && (
                <Box mt={2} textAlign="center">
                    <Typography variant="h6">Selected Image Preview:</Typography>
                    <img src={selectedImage} alt="Selected Image" style={{ width: 100, height: 100, borderRadius: '50%' }} />
                </Box>
            )}
        </>
    );
};

export { ImagePicker, ImageCropper };
