const getFirabaseAuthErrorMessage = (errorCode: string): string => {
	switch (errorCode) {
		case "auth/claims-too-large":
			return "The claims payload exceeds the maximum allowed size of 1000 bytes.";
		case "auth/email-already-exists":
			return "The provided email is already in use by another account.";
		case "auth/email-already-in-use":
			return "The provided email is already in use by another account.";
		case "auth/id-token-expired":
			return "Your session has expired. Please log in again.";
		case "auth/id-token-revoked":
			return "Your session has been revoked. Please log in again.";
		case "auth/insufficient-permission":
			return "Insufficient permissions to access the requested resource.";
		case "auth/internal-error":
			return "An unexpected error occurred. Please try again later.";
		case "auth/invalid-argument":
			return "An invalid argument was provided. Please check your input and try again.";
		case "auth/invalid-claims":
			return "The custom claim attributes provided are invalid.";
		case "auth/invalid-continue-uri":
			return "The continue URL is invalid.";
		case "auth/invalid-creation-time":
			return "The creation time must be a valid UTC date string.";
		case "auth/invalid-credential":
			return "The provided credential is invalid or expired.";
		case "auth/invalid-disabled-field":
			return "The provided value for the disabled user property is invalid.";
		case "auth/invalid-display-name":
			return "The display name is invalid. It must be a non-empty string.";
		case "auth/invalid-dynamic-link-domain":
			return "The provided dynamic link domain is not configured for this project.";
		case "auth/invalid-email":
			return "The email address is not valid.";
		case "auth/invalid-email-verified":
			return "The email verification status must be a boolean.";
		case "auth/invalid-hash-algorithm":
			return "The hash algorithm is not supported.";
		case "auth/invalid-hash-block-size":
			return "The hash block size is invalid.";
		case "auth/invalid-hash-derived-key-length":
			return "The hash derived key length is invalid.";
		case "auth/invalid-hash-key":
			return "The hash key is invalid.";
		case "auth/invalid-hash-memory-cost":
			return "The hash memory cost is invalid.";
		case "auth/invalid-hash-parallelization":
			return "The hash parallelization is invalid.";
		case "auth/invalid-hash-rounds":
			return "The hash rounds are invalid.";
		case "auth/invalid-hash-salt-separator":
			return "The hash salt separator field is invalid.";
		case "auth/invalid-id-token":
			return "The provided ID token is not valid.";
		case "auth/invalid-last-sign-in-time":
			return "The last sign-in time must be a valid UTC date string.";
		case "auth/invalid-page-token":
			return "The provided page token is invalid.";
		case "auth/invalid-password":
			return "The password is invalid. It must be at least six characters long.";
		case "auth/invalid-password-hash":
			return "The password hash is invalid.";
		case "auth/invalid-password-salt":
			return "The password salt is invalid.";
		case "auth/invalid-phone-number":
			return "The phone number is not valid. It must be in E.164 format.";
		case "auth/invalid-photo-url":
			return "The photo URL is invalid.";
		case "auth/invalid-provider-data":
			return "The provider data must be a valid array of UserInfo objects.";
		case "auth/invalid-provider-id":
			return "The provider ID must be a valid identifier.";
		case "auth/invalid-oauth-responsetype":
			return "Only one OAuth responseType should be set to true.";
		case "auth/invalid-session-cookie-duration":
			return "The session cookie duration must be between 5 minutes and 2 weeks.";
		case "auth/invalid-uid":
			return "The UID must be a non-empty string with at most 128 characters.";
		case "auth/invalid-user-import":
			return "The user record to import is invalid.";
		case "auth/maximum-user-count-exceeded":
			return "The maximum allowed number of users to import has been exceeded.";
		case "auth/missing-android-pkg-name":
			return "An Android Package Name is required.";
		case "auth/missing-continue-uri":
			return "A valid continue URL is required.";
		case "auth/missing-hash-algorithm":
			return "A hashing algorithm and its parameters are required to import users with password hashes.";
		case "auth/missing-ios-bundle-id":
			return "An iOS Bundle ID is required.";
		case "auth/missing-uid":
			return "A UID is required for this operation.";
		case "auth/missing-oauth-client-secret":
			return "The OAuth configuration client secret is required.";
		case "auth/operation-not-allowed":
			return "The requested operation is not allowed. Please enable it in the Firebase Console.";
		case "auth/phone-number-already-exists":
			return "The phone number is already in use by another account.";
		case "auth/project-not-found":
			return "No Firebase project was found for the provided credentials.";
		case "auth/reserved-claims":
			return "One or more custom user claims are reserved and cannot be used.";
		case "auth/session-cookie-expired":
			return "The session cookie has expired.";
		case "auth/session-cookie-revoked":
			return "The session cookie has been revoked.";
		case "auth/too-many-requests":
			return "Too many requests. Please try again later.";
		case "auth/uid-already-exists":
			return "The provided UID is already in use by another account.";
		case "auth/unauthorized-continue-uri":
			return "The domain of the continue URL is not authorized.";
		case "auth/user-not-found":
			return "No user found with this email.";

		default:
			return "An unexpected error occurred. Please try again later.";
	}
};

export default getFirabaseAuthErrorMessage;
