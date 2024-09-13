import { AttachFile, Send } from "@mui/icons-material";
import { Box, TextField, Button, IconButton, Avatar, Typography, Dialog } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { UserDataModel, calculateAge, getFullName, genderToString } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import useSendMessage from "../../../hooks/useSendMessage";

interface Message {
	id: string;
	text: string;
	senderId: string;
	timestamp: Date;
	fileUrl?: string;
	fileName?: string;
	isImage?: boolean;
}

interface ChatRouteState {
	recipient: UserDataModel;
}

const ChatDetailPage: React.FC = () => {
	// Get recipient information from location state
	const location = useLocation();
	const state = location.state as ChatRouteState;
	const { recipient } = state;

	const { currentUser, userData } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);

	// Use useSendMessage hook to send messages
	const { sendMessageToUser, loading } = useSendMessage({
		sender: userData as UserDataModel,
		recipient, // Pass the correct recipient data
	});

	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		// Simulated initial fetch of messages
		const fetchedMessages: Message[] = [
			{
				id: "1",
				text: "Hey! How are you?",
				senderId: "123",
				timestamp: new Date(),
			},
			{
				id: "2",
				text: "I'm good! How about you?",
				senderId: currentUser?.uid || "456",
				timestamp: new Date(),
			},
		];
		setMessages(fetchedMessages);
		scrollToBottom();
	}, [currentUser]);

	const handleSendMessage = async () => {
		if (newMessage.trim() === "" && !selectedFile) return;

		const isImage = selectedFile ? selectedFile.type.startsWith("image/") : false;

		const newMessageObj: Message = {
			id: Date.now().toString(),
			text: newMessage,
			senderId: currentUser?.uid || "",
			timestamp: new Date(),
			fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
			fileName: selectedFile?.name,
			isImage,
		};

		// Call sendMessageToUser from the useSendMessage hook
		await sendMessageToUser(newMessage);

		// Append message locally to the chat
		setMessages((prevMessages) => [...prevMessages, newMessageObj]);
		setNewMessage("");
		setSelectedFile(null);
		scrollToBottom();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleImageClick = (imageUrl: string) => {
		setImagePreviewUrl(imageUrl);
	};

	const handleCloseImagePreview = () => {
		setImagePreviewUrl(null);
	};

	// Get recipient details
	const recipientName = getFullName(recipient);
	const recipientAge = calculateAge(recipient.dateOfBirth);
	const recipientGender = recipient.gender ? genderToString(recipient.gender) : "Not specified";

	// Function to render chat bubbles
	const renderChatBubble = (message: Message) => {
		const isSender = message.senderId === currentUser?.uid;

		// Show recipient's name, age, and gender in the chat bubbles when they send a message
		const displayName = isSender ? "You" : `${recipientName} (${recipientAge}, ${recipientGender})`;

		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: isSender ? "row-reverse" : "row",
					alignItems: "flex-end",
					mb: 2,
				}}
			>
				<Avatar
					sx={{
						bgcolor: isSender ? "#ff4081" : "grey",
						mr: isSender ? 0 : 2,
						ml: isSender ? 2 : 0,
					}}
					src={isSender ? (currentUser?.photoURL as string) : (recipient.profilePictureUrl as string)}
				>
					{!isSender && recipientName.charAt(0)}
				</Avatar>
				<Box
					sx={{
						backgroundColor: isSender ? "#ff4081" : "#f0f0f0",
						color: isSender ? "white" : "black",
						padding: 2,
						borderRadius: "12px",
						maxWidth: "70%",
						boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
					}}
				>
					<Typography variant='body1' sx={{ fontWeight: "bold" }}>
						{displayName}
					</Typography>
					<Typography variant='body1'>{message.text}</Typography>
					{message.isImage && message.fileUrl && (
						<Box
							component='img'
							src={message.fileUrl}
							alt={message.fileName}
							sx={{
								width: "auto",
								maxWidth: "100%",
								maxHeight: "200px",
								borderRadius: "8px",
								cursor: "pointer",
								"&:hover": {
									opacity: 0.9,
								},
							}}
							onClick={() => handleImageClick(message.fileUrl as string)}
						/>
					)}
					<Typography
						variant='caption'
						sx={{ display: "block", mt: 1, textAlign: isSender ? "right" : "left" }}
					>
						{formatDistanceToNow(message.timestamp, { addSuffix: true })}
					</Typography>
				</Box>
			</Box>
		);
	};

	if (!recipient) {
		return <Typography variant='h5'>No recipient data available</Typography>;
	}

	return (
		<Box
			display='flex'
			flexDirection='column'
			minHeight='100vh'
			maxWidth='800px'
			mx='auto'
			sx={{
				overflow: "visible",
			}}
		>
			{/* Chat Title */}
			<Box
				sx={{
					background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
					borderRadius: "10px 10px 0 0",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					padding: "16px",
					paddingTop: "8px",
					color: "white",
					borderBottom: "1px solid rgba(255,255,255,0.1)",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center", // Vertically center the avatar and text
						justifyContent: "center", // Center the entire box
					}}
				>
					<Avatar
						src={recipient.profilePictureUrl ?? undefined}
						sx={{ width: 56, height: 56, mr: 2 }} // Added margin-right to separate the avatar from the title
					/>
					<Typography variant='h5' fontWeight='bold'>
						Chat with {recipientName}
					</Typography>
				</Box>
			</Box>

			{/* Chat Messages Section */}
			<Box
				flexGrow={1}
				sx={{
					padding: 2,
					backgroundColor: "#f9f9f9",
					borderRadius: "10px",
					display: "flex",
					flexDirection: "column",
					flexWrap: "nowrap",
					overflow: "visible",
				}}
			>
				{messages.map((message) => (
					<React.Fragment key={message.id}>{renderChatBubble(message)}</React.Fragment>
				))}
				<div ref={messageEndRef} />
			</Box>

			{/* Message Input Section */}
			<Box
				display='flex'
				alignItems='center'
				p={2}
				borderTop='1px solid #ddd'
				sx={{
					position: "sticky",
					bottom: "50px",
					backgroundColor: "white",
					zIndex: 1000,
				}}
			>
				<IconButton component='label'>
					<AttachFile />
					<input type='file' hidden onChange={handleFileChange} />
				</IconButton>
				<TextField
					variant='outlined'
					fullWidth
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder='Type a message...'
					sx={{ marginLeft: 2, marginRight: 2 }}
				/>
				<Button
					variant='contained'
					color='primary'
					endIcon={<Send />}
					onClick={handleSendMessage}
					disabled={loading}
				>
					{loading ? "Sending..." : "Send"}
				</Button>
			</Box>

			{/* Image Preview Modal */}
			<Dialog
				open={!!imagePreviewUrl}
				onClose={handleCloseImagePreview}
				maxWidth='md'
				PaperProps={{
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				}}
			>
				<Box
					component='img'
					src={imagePreviewUrl || ""}
					alt='Preview'
					sx={{ width: "100%", maxHeight: "80vh", borderRadius: "8px" }}
				/>
			</Dialog>
		</Box>
	);
};

export default ChatDetailPage;
