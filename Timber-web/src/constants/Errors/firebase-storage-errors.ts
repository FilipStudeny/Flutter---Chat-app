const getFirebaseStorageErrorMessage = (errorCode: string): string => {
	switch (errorCode) {
		case "storage/unknown":
			return "An unknown error occurred.";
		case "storage/object-not-found":
			return "No object exists at the desired reference.";
		case "storage/bucket-not-found":
			return "No bucket is configured for Cloud Storage.";
		case "storage/project-not-found":
			return "No project is configured for Cloud Storage.";
		case "storage/quota-exceeded":
			return "Quota on your Cloud Storage bucket has been exceeded. If you're on the no-cost tier, upgrade to a paid plan. If you're on a paid plan, reach out to Firebase support.";
		case "storage/unauthenticated":
			return "User is unauthenticated. Please authenticate and try again.";
		case "storage/unauthorized":
			return "User is not authorized to perform the desired action. Check your security rules to ensure they are correct.";
		case "storage/retry-limit-exceeded":
			return "The maximum time limit on an operation (upload, download, delete, etc.) has been exceeded. Try again.";
		case "storage/invalid-checksum":
			return "File on the client does not match the checksum of the file received by the server. Try uploading again.";
		case "storage/canceled":
			return "User canceled the operation.";
		case "storage/invalid-event-name":
			return "Invalid event name provided. Must be one of [`running`, `progress`, `pause`].";
		case "storage/invalid-url":
			return "Invalid URL provided to refFromURL(). Must be of the form: gs://bucket/object or https://firebasestorage.googleapis.com/v0/b/bucket/o/object?token=<TOKEN>.";
		case "storage/invalid-argument":
			return "The argument passed to put() must be `File`, `Blob`, or `UInt8` Array. The argument passed to putString() must be a raw, `Base64`, or `Base64URL` string.";
		case "storage/no-default-bucket":
			return "No bucket has been set in your config's storageBucket property.";
		case "storage/cannot-slice-blob":
			return "Commonly occurs when the local file has changed (deleted, saved again, etc.). Try uploading again after verifying that the file hasn't changed.";
		case "storage/server-file-wrong-size":
			return "File on the client does not match the size of the file received by the server. Try uploading again.";
		default:
			return "An unexpected error occurred. Please try again later.";
	}
};

export default getFirebaseStorageErrorMessage;
