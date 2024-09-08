import { AttachFile, Send } from "@mui/icons-material";
import { Box, TextField, Button, IconButton, Avatar, Typography, Dialog, Backdrop } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../../context/AuthenticationContext";

interface Message {
	id: string;
	text: string;
	senderId: string;
	timestamp: Date;
	fileUrl?: string;
	fileName?: string;
	isImage?: boolean;
}

const ChatDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { currentUser } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
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
	}, [id, currentUser]);

	const handleSendMessage = () => {
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

	const renderChatBubble = (message: Message) => {
		const isSender = message.senderId === currentUser?.uid;
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
				>
					{isSender ? "You" : "U"}
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
			{/* Chat Title Integrated into List */}
			<Box
				sx={{
					background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
					borderRadius: "10px 10px 0 0",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					padding: "16px",
					paddingTop: "8px",
					textAlign: "center",
					color: "white",
					borderBottom: "1px solid rgba(255,255,255,0.1)",
				}}
			>
				<Typography variant='h5' fontWeight='bold'>
					Chat with User {id}
				</Typography>
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
				<Button variant='contained' color='primary' endIcon={<Send />} onClick={handleSendMessage}>
					Send
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
				BackdropComponent={Backdrop}
				BackdropProps={{
					style: {
						backgroundColor: "rgba(0, 0, 0, 0.8)",
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
