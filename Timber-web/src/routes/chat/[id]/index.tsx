import { AttachFile, Send, Description as FileIcon } from "@mui/icons-material";
import { Box, TextField, Button, IconButton, Avatar, Typography, Dialog, styled, Badge } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

import NotificationType from "../../../constants/Enums/NotificationType";
import { Message } from "../../../constants/Models/Message";
import { UserDataModel, getFullName } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import useCreateNotification from "../../../hooks/useCreateNotification";
import useGetUserStatus from "../../../hooks/useGetUserStatus";
import useSendFileMessage from "../../../hooks/useSendFileMessage";
import useSendMessage from "../../../hooks/useSendMessage";
import { loadMessages, loadMoreMessages } from "../../../services/MessagingService/loadMessages";

interface StyledBadgeProps {
	online: boolean;
}

const StyledBadge = styled(Badge)<StyledBadgeProps>(({ theme, online }) => ({
	"& .MuiBadge-badge": {
		backgroundColor: online ? "#44b700" : "#f44336",
		color: online ? "#44b700" : "#f44336",
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
			animation: online ? "ripple 1.2s infinite ease-in-out" : "pulse 2s infinite ease-in-out",
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
	"@keyframes pulse": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(.8)",
			opacity: 0,
		},
	},
}));

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

	const {
		sendFileToUser,
		loading: fileLoading,
		error: fileError,
	} = useSendFileMessage({
		sender: userData as UserDataModel,
		recipient,
	});

	const { status, loading: statusLoading, error: statusError } = useGetUserStatus(recipient.uid as string);

	const { sendNotification, loading: notificationLoading } = useCreateNotification();

	const scrollToBottom = () => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		let unsubscribe = () => {};

		if (currentUser && recipient.uid) {
			const limit = 10;
			unsubscribe = loadMessages(currentUser.uid, recipient.uid, limit, (fetchedMessages) => {
				setMessages(fetchedMessages);
				setHasMoreMessages(fetchedMessages.length >= limit);
				scrollToBottom();
			});
		}

		return () => {
			unsubscribe();
		};
	}, [currentUser, recipient.uid]);

	const handleLoadMoreMessages = async () => {
		if (!currentUser || !recipient.uid || messages.length === 0) return;

		setLoadingMore(true);

		try {
			const lastMessage = messages[0];
			const limit = 10;
			const olderMessages = await loadMoreMessages(currentUser.uid, recipient.uid, lastMessage, limit);

			if (olderMessages.length === 0) {
				setHasMoreMessages(false);
			} else {
				setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
				setHasMoreMessages(olderMessages.length >= limit);
			}
		} finally {
			setLoadingMore(false);
		}
	};

	const handleSendMessage = async () => {
		if (newMessage.trim() === "" && !selectedFile) return;
		const senderFullName = getFullName(userData as UserDataModel);

		try {
			if (selectedFile) {
				await sendFileToUser(selectedFile);
			}

			if (newMessage.trim() !== "") {
				await sendMessageToUser(newMessage);
			}
			if (status?.location !== location.pathname) {
				await sendNotification(
					currentUser?.uid as string,
					recipient.uid as string,
					`${senderFullName} has sent you a message!`,
					NotificationType.MESSAGE,
				);
			}
			setNewMessage("");
			setSelectedFile(null);
			scrollToBottom();
		} catch (err) {
			toast.error("Failed to send the message. Please try again.");
		}
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

	const renderFileMessage = (file: { name: string; url: string; size: number }, isSender: boolean) => (
		<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
			<FileIcon sx={{ color: isSender ? "white" : "black", marginRight: 1 }} />
			<Box>
				<Typography variant='body2' sx={{ fontWeight: "bold", color: isSender ? "white" : "black" }}>
					{file.name}
				</Typography>
				<Typography variant='caption' sx={{ color: isSender ? "white" : "black" }}>
					{(file.size / 1024).toFixed(2)} KB
				</Typography>
			</Box>
		</Box>
	);

	const recipientName = getFullName(recipient);

	const renderChatBubble = (message: Message) => {
		const isSender = message.senderId === currentUser?.uid;
		const isImage = message.file?.url && message.file.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;

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
					src={isSender ? (currentUser?.photoURL ?? undefined) : (recipient.profilePictureUrl ?? undefined)}
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
					{message.text && <Typography variant='body1'>{message.text}</Typography>}
					{message.file ? (
						isImage ? (
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
								onClick={() => message.file && handleImageClick(message.file.url)}
							/>
						) : (
							renderFileMessage(message.file, isSender)
						)
					) : null}

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

	const isLoading = loading || fileLoading || notificationLoading;

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
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							variant='dot'
							online={status?.online as boolean}
						>
							<Avatar alt={recipientName} src={recipient.profilePictureUrl ?? undefined} />
						</StyledBadge>

						<Typography variant='h5' fontWeight='bold' sx={{ marginLeft: 2 }}>
							Chat with {recipientName}
						</Typography>
					</Box>

					{/* Display recipient's last seen only if offline */}
					{!statusLoading && !status?.online && !statusError && status?.last_seen && (
						<Typography variant='body2'>
							Last seen: {new Date(status.last_seen).toLocaleString()}
						</Typography>
					)}

					{/* Handle loading and error states */}
					{statusLoading && <Typography variant='body2'>Loading status...</Typography>}
					{statusError && (
						<Typography variant='body2' color='error'>
							{statusError}
						</Typography>
					)}
					{fileError && (
						<Typography variant='body2' color='error'>
							{fileError}
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
					<Button onClick={handleLoadMoreMessages} disabled={loadingMore} sx={{ alignSelf: "center", mb: 2 }}>
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
					sx={{
						background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
					}}
					endIcon={<Send />}
					onClick={handleSendMessage}
					disabled={isLoading}
				>
					{isLoading ? "Sending..." : "Send"}
				</Button>
			</Box>

			{/* Image Preview Modal without Download Button */}
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
				<Box sx={{ position: "relative", width: "100%", maxHeight: "80vh" }}>
					<Box
						component='img'
						src={imagePreviewUrl || ""}
						alt='Preview'
						sx={{ width: "100%", maxHeight: "80vh", borderRadius: "8px" }}
					/>
				</Box>
			</Dialog>
		</Box>
	);
};

export default ChatDetailPage;
