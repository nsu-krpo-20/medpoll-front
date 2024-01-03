export interface Report {
	id: number,
	prescriptionId: number,
	medsTaken: boolean[]|null,
	metrics: string[]|null,
	feedback: string|null,
	time: number|null
}
