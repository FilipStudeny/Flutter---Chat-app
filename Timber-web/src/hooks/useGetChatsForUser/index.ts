import { useState, useEffect, useCallback } from "react";

import getChatsForUser from "../../services/MessagingService/getChats";

interface Recipient {
	uid: string;
	profilePictureUrl: string;
	username: string;
	gender: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string | null;
	aboutMe: string;
	friends: string[];
	dateOfBirth?: Date;
}

interface Chat {
	id: string;
	recipientName: string;
	recipient: Recipient; // Store full recipient data
	lastMessage: string;
	recipientAvatar?: string;
	lastMessageTime: Date | null;
}

const pageSize = 10; // Set the page size for pagination

/**
 * Custom hook to retrieve chats for the current user with pagination.
 *
 * @param {string} userId - The ID of the current user.
 * @returns {object} - Contains chats, loading state, error message, and functions to refetch and load more chats.
 */
const useGetChatsForUser = (userId: string) => {
	const [chats, setChats] = useState<Chat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastVisible, setLastVisible] = useState<any>(null);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const fetchChats = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getChatsForUser(userId, pageSize);

			if (response.success) {
				setChats(response.data ?? []);
				setLastVisible(response.lastVisible || null);
				setHasMore((response.data ?? []).length === pageSize);
			} else {
				setError(response.message || "Failed to load chats.");
			}
		} catch (error) {
			setError("An error occurred while fetching chats.");
		}

		setLoading(false);
	}, [userId]);

	const loadMoreChats = useCallback(async () => {
		if (loading || !hasMore || !lastVisible) return;

		setLoading(true);
		setError(null);

		try {
			const response = await getChatsForUser(userId, pageSize, lastVisible);

			if (response.success) {
				setChats((prevChats) => [...prevChats, ...(response.data ?? [])]);
				setLastVisible(response.lastVisible || null);
				setHasMore((response.data ?? []).length === pageSize);
			} else {
				setError(response.message || "Failed to load more chats.");
			}
		} catch (error) {
			setError("An error occurred while loading more chats.");
		}

		setLoading(false);
	}, [userId, lastVisible, hasMore, loading]);

	useEffect(() => {
		if (userId) {
			fetchChats();
		}
	}, [userId, fetchChats]);

	return { chats, loading, error, refetch: fetchChats, loadMore: loadMoreChats, hasMore };
};

export default useGetChatsForUser;
