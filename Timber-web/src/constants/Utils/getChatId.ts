const getChatId = (senderId: string, recipientId: string): string => [senderId, recipientId].sort().join("_");

export default getChatId;
