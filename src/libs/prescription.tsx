import { authedClient } from "./api";

export interface PrescriptionMedicine {
	name: string,
	dose: string,
	periodType: number,
	period: string | number[],
}

export enum PeriodType {
	N_TIMES_PER_DAY = 1,
	ONCE_PER_N_DAYS = 2,
	WEEK_SCHEDULE = 3,
	CUSTOM = 4,

	DEFAULT = N_TIMES_PER_DAY
}

export type PeriodValue = string | number[];

export interface PrescriptionMetric {
	name: string,
	periodType: PeriodType,
	period: PeriodValue,
}

// Used to send a request to the server to make a new prescription
// `meds` and `metrics` are JSONs of the respective keys in a Prescription
export interface NewPrescription {
	patientCardId: number,
	meds: PrescriptionMedicine[],
	metrics: PrescriptionMetric[],
}

export interface Prescription {
	id: number,
	patientCardId: number,
	meds: PrescriptionMedicine[] | null,
	metrics: PrescriptionMetric[] | null,
	createdTime: number,
	editedTime: number,
	createdBy: string | null,
	isActive: boolean,
}

interface PrescriptionDto {
	patientCardId: number,
	meds: any,
	metrics: any,
}

function prescriptionToDto(presc: Prescription | NewPrescription) {
	var newMeds = presc.meds ? [...presc.meds] : [];
	var newMetrics = presc.metrics ? [...presc.metrics] : [];

	newMeds.forEach((v) => {
		v.period = JSON.stringify(v.period);
	})

	newMetrics.forEach((v) => {
		v.period = JSON.stringify(v.period);
	})

	var ret : PrescriptionDto = {
		patientCardId: presc.patientCardId,
		meds: newMeds,
		metrics: newMetrics
	}

	return ret;
}

export function SavePrescription(presc: Prescription | NewPrescription) {
	var dto = prescriptionToDto(presc);
	return authedClient.post(`/api/v1/prescriptions`, dto);
}