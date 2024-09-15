import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	FormGroup,
	FormControlLabel,
	Checkbox,
	TextField,
	CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { useCreateReport } from "../../../../../hooks";

interface ReportUserModalProps {
	open: boolean;
	onClose: () => void;
	reportedUserId: string;
	reporterId: string;
}

type ReportReasons = {
	inappropriateContent: boolean;
	harassment: boolean;
	impersonation: boolean;
	spam: boolean;
	hateSpeech: boolean;
	scam: boolean;
	violence: boolean;
};

const ReportUserModal: React.FC<ReportUserModalProps> = ({ open, onClose, reportedUserId, reporterId }) => {
	const [reportReasons, setReportReasons] = useState<ReportReasons>({
		inappropriateContent: false,
		harassment: false,
		impersonation: false,
		spam: false,
		hateSpeech: false,
		scam: false,
		violence: false,
	});
	const [reportMessage, setReportMessage] = useState("");

	// Use the createReport hook
	const { handleCreateReport, loading, error, success } = useCreateReport();

	const handleReportReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		setReportReasons((prevReasons) => ({
			...prevReasons,
			[name as keyof ReportReasons]: checked,
		}));
	};

	const handleReportMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setReportMessage(event.target.value);
	};

	const handleSubmit = async () => {
		const selectedReasons = Object.keys(reportReasons).filter(
			(reason) => reportReasons[reason as keyof ReportReasons],
		);

		if (selectedReasons.length === 0 && !reportMessage.trim()) {
			toast.error("Please select a reason or leave a message.");
			return;
		}

		const response = await handleCreateReport(reporterId, reportedUserId, selectedReasons, reportMessage);

		if (response.success) {
			toast.success("Report submitted successfully.");
			onClose();
		} else {
			toast.error(response.message || "Failed to submit the report.");
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>Report User</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please select the reason(s) for reporting this user and provide any additional information.
				</DialogContentText>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={reportReasons.inappropriateContent}
								onChange={handleReportReasonChange}
								name='inappropriateContent'
							/>
						}
						label='Inappropriate Content'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={reportReasons.harassment}
								onChange={handleReportReasonChange}
								name='harassment'
							/>
						}
						label='Harassment'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={reportReasons.impersonation}
								onChange={handleReportReasonChange}
								name='impersonation'
							/>
						}
						label='Impersonation'
					/>
					<FormControlLabel
						control={
							<Checkbox checked={reportReasons.spam} onChange={handleReportReasonChange} name='spam' />
						}
						label='Spam'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={reportReasons.hateSpeech}
								onChange={handleReportReasonChange}
								name='hateSpeech'
							/>
						}
						label='Hate Speech'
					/>
					<FormControlLabel
						control={
							<Checkbox checked={reportReasons.scam} onChange={handleReportReasonChange} name='scam' />
						}
						label='Scam or Fraud'
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={reportReasons.violence}
								onChange={handleReportReasonChange}
								name='violence'
							/>
						}
						label='Violence or Threats'
					/>
				</FormGroup>

				<TextField
					label='Additional Comments'
					fullWidth
					multiline
					rows={4}
					value={reportMessage}
					onChange={handleReportMessageChange}
					sx={{ mt: 2 }}
				/>
				{loading && <CircularProgress />}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{success && <p style={{ color: "green" }}>Report submitted successfully!</p>}
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					variant='outlined'
					sx={{
						color: "#ff4081",
						borderColor: "rgba(255,64,129,1)",
						"&:hover": {
							borderColor: "rgba(255,105,135,1)",
							backgroundColor: "rgba(255,105,135,0.1)",
						},
					}}
					disabled={loading}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					sx={{
						background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
						color: "#fff",
						"&:hover": {
							background: "linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
						},
					}}
					disabled={loading}
				>
					{loading ? <CircularProgress size={24} /> : "Submit Report"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ReportUserModal;
