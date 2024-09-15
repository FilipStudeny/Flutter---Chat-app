// ChatDetailPage.tsx

import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	TextField,
	Button,
	IconButton,
	Avatar,
	Typography,
	Dialog,
	styled,
	Badge,
} from "@mui/material";
import { AttachFile, Send } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router-dom";

import { Message } from "../../../constants/Models/Message";
import { UserDataModel, getFullName } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import useUserStatus from "../../../hooks/useGetUserStatus";
import useSendMessage from "../../../hooks/useSendMessage";
import { loadMessages, loadMoreMessages } from "../../../services/MessagingService/loadMessages";

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		width: "12px",
		height: "12px",
		borderRadius: "50%",
		"&::after": {
			position: "absolute",
			transform: "translate(-50%, -50%)",
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "ripple 1.2s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}));

// ChatDetailPage component
const ChatDetailPage: React.FC = () => {
	const location = useLocation();
	const state = location.state as { recipient: UserDataModel };
	const { recipient } = state;

	const { currentUser, userData } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [newMessage, setNewMessage] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const messageEndRef = useRef<HTMLDivElement>(null);

	const { sendMessageToUser, loading } = useSendMessage({
		sender: userData as UserDataModel,
		recipient,
	});

	const { status, loading: statusLoading, error } = useUserStatus(recipient.uid as string);

	// Scroll to the bottom of the messages
	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Load messages using the loadMessages function
	useEffect(() => {
		// Initialize unsubscribe to a no-op function
		let unsubscribe = () => { };

		if (currentUser && recipient.uid) {
			const limit = 10; // Set your desired limit here
			unsubscribe = loadMessages(
				currentUser.uid,
				recipient.uid,
				limit, // Use the limit variable
				(fetchedMessages) => {
					setMessages(fetchedMessages);
					setHasMoreMessages(fetchedMessages.length >= limit); // Use the same limit
					scrollToBottom();
				},
				(error) => {
					console.error("Error loading messages:", error);
				}
			);
		}

		return () => {
			unsubscribe();
		};
	}, [currentUser, recipient.uid]);

	// Handle loading more messages
	const handleLoadMoreMessages = async () => {
		if (!currentUser || !recipient.uid || messages.length === 0) return;

		setLoadingMore(true);

		try {
			const lastMessage = messages[0]; // Get the oldest message currently loaded
			const limit = 10; // Number of messages to load each time
			const olderMessages = await loadMoreMessages(
				currentUser.uid,
				recipient.uid,
				lastMessage,
				limit
			);

			if (olderMessages.length === 0) {
				setHasMoreMessages(false); // No more messages to load
			} else {
				setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
				setHasMoreMessages(olderMessages.length >= limit);
			}
		} catch (error) {
			console.error("Error loading more messages:", error);
		} finally {
			setLoadingMore(false);
		}
	};

	// Handle sending a new message
	const handleSendMessage = async () => {
		if (newMessage.trim() === "" && !selectedFile) return;

		// Implement file upload if selectedFile is present
		// For now, we'll assume sendMessageToUser handles the message sending

		await sendMessageToUser(newMessage);

		setNewMessage("");
		setSelectedFile(null);
		scrollToBottom();
	};

	// Handle file attachment
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	// Handle image click for preview
	const handleImageClick = (imageUrl: string) => {
		setImagePreviewUrl(imageUrl);
	};

	const handleCloseImagePreview = () => {
		setImagePreviewUrl(null);
	};

	// Get recipient details
	const recipientName = getFullName(recipient);

	// Render chat bubbles
	const renderChatBubble = (message: Message) => {
		const isSender = message.senderId === currentUser?.uid;

		return (
			<Box
				key={message.id}
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
					src={isSender ? currentUser?.photoURL ?? undefined : recipient.profilePictureUrl ?? undefined}
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
						{message.username}
					</Typography>
					<Typography variant='body1'>{message.text}</Typography>
					{message.file && message.file.url && (
						<Box
							component='img'
							src={message.file.url}
							alt={message.file.name}
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
							onClick={() => handleImageClick(message.file?.url as string)}
						/>
					)}
					<Typography
						variant='caption'
						sx={{ display: "block", mt: 1, textAlign: isSender ? "right" : "left" }}
					>
						{formatDistanceToNow(message.createdAt, { addSuffix: true })}
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
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<StyledBadge
							overlap='circular'
							color={status?.online ? "success" : "error"}
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							variant='dot'
						>
							<Avatar alt={recipientName} src={recipient.profilePictureUrl ?? undefined} />
						</StyledBadge>

						<Typography variant='h5' fontWeight='bold' sx={{ marginLeft: 2 }}>
							Chat with {recipientName}
						</Typography>
					</Box>

					{/* Display recipient's last seen only if offline */}
					{!statusLoading && !status?.online && !error && status?.last_seen && (
						<Typography variant='body2'>
							Last seen: {new Date(status?.last_seen).toLocaleString()}
						</Typography>
					)}

					{/* Handle loading and error states */}
					{statusLoading && <Typography variant='body2'>Loading status...</Typography>}
					{error && (
						<Typography variant='body2' color='error'>
							{error}
						</Typography>
					)}
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
					overflowY: "auto",
				}}
			>
				{hasMoreMessages && (
					<Button
						onClick={handleLoadMoreMessages}
						disabled={loadingMore}
						sx={{ alignSelf: "center", mb: 2 }}
					>
						{loadingMore ? "Loading..." : "Load previous"}
					</Button>
				)}
				{messages.map((message) => renderChatBubble(message))}
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
					bottom: 0,
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
