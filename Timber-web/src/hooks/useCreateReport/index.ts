import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import createReport from "../../services/DatabaseService/createReport";

const useCreateReport = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const handleCreateReport = async (
		reporterId: string,
		reportedUserId: string,
		reasons: string[],
		comment: string,
	): Promise<ServiceResponse<boolean>> => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		const response = await createReport(reporterId, reportedUserId, reasons, comment);

		if (response.success) {
			setSuccess(true);
		} else {
			setError(response.message || "Failed to create report.");
		}

		setLoading(false);
		return response;
	};

	return {
		handleCreateReport,
		loading,
		error,
		success,
	};
};

export default useCreateReport;
