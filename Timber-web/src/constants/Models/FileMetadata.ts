export interface FileMetadata {
	url: string;
	type: string;
	size: number;
	name: string;
}

export const fileMetadataFromMap = (map: Record<string, any>): FileMetadata => ({
	url: map.url || "",
	type: map.type || "",
	size: map.size || 0,
	name: map.name || "",
});

export const fileMetadataToMap = (file: FileMetadata): Record<string, any> => ({
	url: file.url,
	type: file.type,
	size: file.size,
	name: file.name,
});
