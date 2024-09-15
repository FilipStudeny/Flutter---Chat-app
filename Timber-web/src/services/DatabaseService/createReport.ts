import { doc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";

interface ReportData {
	reporterId: string;
	reasons: string[];
	comment: string;
	timestamp: Timestamp;
}

const createReport = async (
	reporterId: string,
	reportedUserId: string,
	reasons: string[],
	comment: string,
): Promise<ServiceResponse<boolean>> => {
	try {
		const reportDocRef = doc(FirebaseFireStore, "reports", reportedUserId);

		const newReport: ReportData = {
			reporterId,
			reasons,
			comment,
			timestamp: Timestamp.now(),
		};

		await updateDoc(reportDocRef, {
			reports: arrayUnion(newReport),
		}).catch(async (err) => {
			if (err.code === "not-found") {
				await setDoc(reportDocRef, {
					reports: [newReport],
				});
			} else {
				throw err;
			}
		});

		return { success: true, data: true };
	} catch (err) {
		return {
			success: false,
			data: false,
			message: err instanceof Error ? err.message : "An unknown error occurred",
		};
	}
};

export default createReport;
