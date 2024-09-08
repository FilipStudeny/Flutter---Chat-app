import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { List, ListItem, ListItemText, Avatar, Typography, Box, Divider, Stack } from "@mui/material";
import { formatDistance } from "date-fns";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppRoutes from "../../constants/Enums/AppRoutes";
import { useAuth } from "../../context/AuthenticationContext";
import getChatId from "../../constants/Utils/getChatId";

interface Chat {
	id: string;
	recipientName: string;
	lastMessage: string;
	recipientAvatar?: string;
	lastMessageTime: Date;
}

const fakeChats: Chat[] = [
	{
		id: "1",
		recipientName: "John Doe",
		lastMessage: "Hey, how are you?",
		recipientAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
		lastMessageTime: new Date(new Date().setHours(new Date().getHours() - 2)),
	},
	{
		id: "2",
		recipientName: "Jane Smith",
		lastMessage: "Are you coming to the party?",
		recipientAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
		lastMessageTime: new Date(new Date().setDate(new Date().getDate() - 1)),
	},
	{
		id: "3",
		recipientName: "Alice Johnson",
		lastMessage: "Let’s catch up later!",
		recipientAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
		lastMessageTime: new Date(new Date().setDate(new Date().getDate() - 5)),
	},
	{
		id: "4",
		recipientName: "Bob Brown",
		lastMessage: "Where are you?",
		recipientAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
		lastMessageTime: new Date(new Date().setDate(new Date().getDate() - 10)),
	},
	{
		id: "5",
		recipientName: "Charlie Davis",
		lastMessage: "Got the project update?",
		recipientAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
		lastMessageTime: new Date(new Date().setDate(new Date().getDate() - 30)),
	},
];

const ChatsPage: React.FC = () => {
	const [chats] = useState<Chat[]>(fakeChats);
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	const handleChatClick = (userId: string) => {
		navigate(AppRoutes.Chat.replace(":id", getChatId(currentUser?.uid as string, userId)));
	};

	if (!chats.length) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
				<Typography variant='h6'>You have no active chats</Typography>
			</Box>
		);
	}

	return (
		<Box p={2} mx='auto'>
			{/* Title section with gradient background */}
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
				<Typography variant='h4' fontWeight='bold' sx={{ letterSpacing: 1 }}>
					Active Chats
				</Typography>
			</Box>

			{/* Chats list */}
			<Box
				sx={{
					backgroundColor: "white",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
					borderRadius: "0 0 10px 10px",
					padding: 2,
				}}
			>
				<List>
					{chats.map((chat) => (
						<React.Fragment key={chat.id}>
							<ListItem
								button
								onClick={() => handleChatClick(chat.id)} // Navigate to chat page on click
								sx={{
									borderRadius: "8px",
									padding: "12px",
									"&:hover": {
										backgroundColor: "rgba(0, 0, 0, 0.03)",
									},
								}}
							>
								<Avatar
									src={chat.recipientAvatar || undefined}
									sx={{
										width: 48,
										height: 48,
										boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
										marginRight: 2,
									}}
								>
									{chat.recipientName[0]}
								</Avatar>
								<ListItemText
									primary={
										<Typography variant='subtitle1' fontWeight='bold' color='text.primary'>
											{chat.recipientName}
										</Typography>
									}
									secondary={
										<>
											<Stack direction='row' alignItems='center' spacing={1}>
												<ChatBubbleOutlineIcon fontSize='small' color='action' />
												<Typography variant='body2' color='text.secondary'>
													{chat.lastMessage}
												</Typography>
											</Stack>
											<Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 0.5 }}>
												<AccessTimeIcon fontSize='small' color='action' />
												<Typography variant='caption' color='text.secondary'>
													{formatDistance(chat.lastMessageTime, new Date(), {
														addSuffix: true,
													})}
												</Typography>
											</Stack>
										</>
									}
									sx={{ ml: 1 }}
								/>
							</ListItem>
							<Divider variant='middle' />
						</React.Fragment>
					))}
				</List>
			</Box>
		</Box>
	);
};

export default ChatsPage;
