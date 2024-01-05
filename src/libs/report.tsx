// Partial report returned when fetching a list of reports
export interface ReportOverview {
	id: number,
	prescriptionId: number,
	time: number|null
}

// Complete report returned when fetching a single report. Contains all the information
export interface Report extends ReportOverview {
	metrics: string[],
	medsTaken: boolean[],
	feedback: string,
}