import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Typography,
	Paper,
	TablePagination,
	CircularProgress,
	Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppRoutes from "../../constants/Enums/AppRoutes";
import { useAuth } from "../../context/AuthenticationContext";
import { useGetChatsForUser } from "../../hooks";

const ChatsPage: React.FC = () => {
	const { currentUser } = useAuth();
	const { chats, loading, error } = useGetChatsForUser(currentUser?.uid as string);
	const navigate = useNavigate();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Typography variant='h6' align='center' sx={{ mt: 4 }}>Error: {error}</Typography>;
	}

	if (!chats.length) {
		return (
			<Typography variant='h6' align='center' sx={{ mt: 4 }}>
				You have no active chats
			</Typography>
		);
	}

	return (
		<Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Name</TableCell>
							<TableCell>Last Message</TableCell>
							<TableCell>Last Message Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{chats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((chat) => (
							<TableRow
								key={chat.id}
								hover
								style={{ cursor: "pointer" }}
								onClick={() => {
									navigate(AppRoutes.Chat.replace(":id", chat.id), {
										state: { recipient: chat.recipient }, // Pass the recipient data
									});
								}} // Use recipient.uid for navigation
							>
								<TableCell>
									<Avatar alt={chat.recipientName} src={chat.recipientAvatar} />
								</TableCell>
								<TableCell>
									<Typography variant='h6' noWrap>
										{chat.recipientName}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='body2' color='textSecondary' noWrap>
										{chat.lastMessage as string}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography variant='caption' color='textSecondary'>
										{chat.lastMessageTime
											? formatDistanceToNow(new Date(chat.lastMessageTime), {
												addSuffix: true,
											})
											: ""}
									</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component='div'
				count={chats.length}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</Paper>
	);
};

export default ChatsPage;
