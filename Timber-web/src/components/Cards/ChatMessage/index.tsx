import { Box, Typography } from "@mui/material";

interface ChatMessageProps {
	message: { text: string; userId: string };
	currentUser: any;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUser }) => {
	const isCurrentUser = message.userId === currentUser?.uid;

	return (
		<Box
			sx={{
				mb: 2,
				p: 2,
				backgroundColor: isCurrentUser ? "primary.light" : "grey.300",
				borderRadius: "8px",
				textAlign: isCurrentUser ? "right" : "left",
			}}
		>
			<Typography variant='body1' sx={{ fontWeight: isCurrentUser ? "bold" : "normal" }}>
				{message.text}
			</Typography>
		</Box>
	);
};

export default ChatMessage;
