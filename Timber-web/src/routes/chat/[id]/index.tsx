import { AttachFile, Send } from "@mui/icons-material";
import { Box, TextField, Button, IconButton, Avatar, Typography, Stack } from "@mui/material";
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
}

const ChatDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>(); // Chat ID
	const { currentUser } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]); // Array to hold messages
	const [newMessage, setNewMessage] = useState<string>(""); // New message text
	const [selectedFile, setSelectedFile] = useState<File | null>(null); // File upload state
	const messageEndRef = useRef<HTMLDivElement>(null);

	// Function to scroll to the latest message
	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		// Load messages from server based on chat ID (in a real app, use a backend API)
		// Here we just use fake data for demonstration
		const fetchedMessages: Message[] = [
			{
				id: "1",
				text: "Hey! How are you?",
				senderId: "123", // Assume this is the recipient
				timestamp: new Date(),
			},
			{
				id: "2",
				text: "I'm good! How about you?",
				senderId: currentUser?.uid || "456", // Current user (sender)
				timestamp: new Date(),
			},
			// Add more fake messages if needed
		];
		setMessages(fetchedMessages);
		scrollToBottom();
	}, [id, currentUser]);

	const handleSendMessage = () => {
		if (newMessage.trim() === "" && !selectedFile) return; // Don't send empty messages

		// Create a new message object
		const newMessageObj: Message = {
			id: Date.now().toString(), // Unique ID based on timestamp
			text: newMessage,
			senderId: currentUser?.uid || "",
			timestamp: new Date(),
			fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
			fileName: selectedFile?.name,
		};

		setMessages((prevMessages) => [...prevMessages, newMessageObj]);
		setNewMessage("");
		setSelectedFile(null);
		scrollToBottom(); // Scroll to the latest message
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	return (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='space-between'
			height='100vh'
			p={2}
			maxWidth='800px'
			mx='auto'
		>
			{/* Chat Header */}
			<Box
				sx={{
					backgroundColor: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
					padding: 2,
					borderRadius: "10px",
					color: "white",
					marginBottom: 2,
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
					overflowY: "auto",
					padding: 2,
					backgroundColor: "#f5f5f5",
					borderRadius: "10px",
				}}
			>
				{messages.map((message) => (
					<Box
						key={message.id}
						sx={{
							display: "flex",
							flexDirection: message.senderId === currentUser?.uid ? "row-reverse" : "row",
							alignItems: "center",
							mb: 2,
						}}
					>
						<Avatar
							sx={{
								bgcolor: message.senderId === currentUser?.uid ? "#ff4081" : "grey",
								mr: message.senderId === currentUser?.uid ? 0 : 2,
								ml: message.senderId === currentUser?.uid ? 2 : 0,
							}}
						>
							{message.senderId === currentUser?.uid ? "You" : "U"}
						</Avatar>
						<Stack
							sx={{
								backgroundColor: message.senderId === currentUser?.uid ? "#ff4081" : "white",
								color: message.senderId === currentUser?.uid ? "white" : "black",
								padding: 2,
								borderRadius: "10px",
								boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
								maxWidth: "70%",
							}}
						>
							<Typography variant='body1'>{message.text}</Typography>
							{message.fileUrl && (
								<Typography
									component='a'
									href={message.fileUrl}
									download={message.fileName}
									sx={{ color: "inherit", mt: 1 }}
								>
									Download {message.fileName}
								</Typography>
							)}
							<Typography variant='caption' align='right'>
								{formatDistanceToNow(message.timestamp, { addSuffix: true })}
							</Typography>
						</Stack>
					</Box>
				))}
				<div ref={messageEndRef} />
			</Box>

			{/* Message Input Section */}
			<Box display='flex' alignItems='center' p={2} borderTop='1px solid #ddd'>
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
		</Box>
	);
};

export default ChatDetailPage;
