import { collection, doc, getDoc, query, limit, startAfter, getDocs, where, orderBy } from "firebase/firestore";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";
import { Gender } from "../../constants/Enums/Gender"; // Assuming you have an enum for Gender

interface Recipient {
	uid: string;
	profilePictureUrl: string;
	username: string;
	gender: Gender;
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

interface GetChatsResponse extends ServiceResponse<Chat[]> {
	lastVisible?: any;
}

/**
 * Retrieves a paginated list of chats for the user by fetching the user's chat list and full recipient data.
 *
 * @param {string} userId - The ID of the current user.
 * @param {number} pageSize - The number of chats to fetch per page.
 * @param {any} lastVisible - The last document from the previous page (used for pagination).
 * @returns {Promise<GetChatsResponse>} - A promise that resolves to a paginated list of chats with full recipient data.
 */
const getChatsForUser = async (
	userId: string,
	pageSize: number,
	lastVisible: any = null,
): Promise<GetChatsResponse> => {
	try {
		// Fetch the current user's document
		const userDocRef = doc(FirebaseFireStore, "users", userId);
		const userDocSnapshot = await getDoc(userDocRef);

		if (!userDocSnapshot.exists()) {
			return { data: [], success: false, message: "User not found." };
		}

		const userData = userDocSnapshot.data();
		const chatList = userData?.chatList || [];

		if (chatList.length === 0) {
			return { data: [], success: true, message: "No chats found." };
		}

		// Firestore query to fetch the user's chats
		const chatsCollectionRef = collection(FirebaseFireStore, "chats");
		const chatsQuery = lastVisible
			? query(
					chatsCollectionRef,
					where("participants", "array-contains", userId),
					orderBy("createdAt", "desc"),
					startAfter(lastVisible),
					limit(pageSize),
				)
			: query(
					chatsCollectionRef,
					where("participants", "array-contains", userId),
					orderBy("createdAt", "desc"),
					limit(pageSize),
				);

		const chatsSnapshot = await getDocs(chatsQuery);
		const newLastVisible = chatsSnapshot.docs[chatsSnapshot.docs.length - 1];

		if (chatsSnapshot.empty) {
			return { data: [], success: true, message: "No chats found." };
		}

		// Fetch chats and their respective recipient's data
		const chats = await Promise.all(
			chatsSnapshot.docs.map(async (chatSnapshot) => {
				const chatData = chatSnapshot.data();
				const chatId = chatSnapshot.id;

				const lastMessage =
					chatData.messages && chatData.messages.length > 0
						? chatData.messages[chatData.messages.length - 1]
						: "";

				if (!chatData.participants || !chatData.participants.includes(userId)) {
					return null;
				}

				// Fetch recipient data from Firestore
				const recipientId = chatData.participants.find((participantId: string) => participantId !== userId);
				const recipientDocRef = doc(FirebaseFireStore, "users", recipientId);
				const recipientDocSnapshot = await getDoc(recipientDocRef);

				let recipient: Recipient = {
					uid: recipientId,
					profilePictureUrl: "",
					username: "",
					gender: Gender.Male,
					email: "",
					firstName: "",
					lastName: "",
					phoneNumber: null,
					aboutMe: "",
					friends: [],
				};
				let recipientAvatar = chatData.recipientAvatar || null;

				if (recipientDocSnapshot.exists()) {
					const recipientData = recipientDocSnapshot.data();
					recipient = {
						uid: recipientDocSnapshot.id,
						profilePictureUrl: recipientData?.profilePictureUrl || "",
						username: recipientData?.username || "",
						gender: recipientData?.gender as Gender,
						email: recipientData?.email || "",
						firstName: recipientData?.firstName || "",
						lastName: recipientData?.lastName || "",
						phoneNumber: recipientData?.phoneNumber || null,
						aboutMe: recipientData?.aboutMe || "",
						friends: recipientData?.friends || [],
						dateOfBirth: recipientData?.dateOfBirth
							? new Date(recipientData.dateOfBirth.seconds * 1000)
							: undefined,
					};
					recipientAvatar = recipient.profilePictureUrl;
				}

				return {
					id: chatId,
					recipientName: `${recipient.firstName} ${recipient.lastName}`.trim() || recipient.username,
					recipient,
					lastMessage: lastMessage.text ?? "",
					recipientAvatar,
					lastMessageTime: lastMessage?.createdAt ? lastMessage.createdAt.toDate() : null,
				};
			}),
		);

		const validChats = chats.filter((chat) => chat !== null);

		return {
			data: validChats,
			success: true,
			lastVisible: newLastVisible,
		};
	} catch (error: any) {
		return { data: [], success: false, message: error.message };
	}
};

export default getChatsForUser;
