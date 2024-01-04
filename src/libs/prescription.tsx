import { authedClient } from "./api";

export enum PeriodType {
	N_TIMES_PER_DAY = 1,
	ONCE_PER_N_DAYS = 2,
	WEEK_SCHEDULE = 3,
	CUSTOM = 4,

	DEFAULT = N_TIMES_PER_DAY
}

export type PeriodValue = string;

export interface PrescriptionMedicine {
	name: string,
	dose: string,
	periodType: PeriodType,
	period: PeriodValue,
}

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
	var ret : PrescriptionDto = {
		patientCardId: presc.patientCardId,
		meds: presc.meds,
		metrics: presc.metrics
	}

	return ret;
}

export function SavePrescription(presc: Prescription | NewPrescription) {
	var dto = prescriptionToDto(presc);
	return authedClient.post(`/api/v1/prescriptions`, dto);
}

export interface PeriodText {
	type: string,
	digest: string,
	details: any,
}

function toHHMM(seconds: number) {
    var hrs : any = Math.floor(seconds / 3600);
    var min : any = Math.floor((seconds - (hrs * 3600)) / 60);

    if (hrs < 10) hrs = "0" + hrs
    if (min < 10) min = "0" + min

    return hrs + ':' + min;
}

function GREMMER(days: number) : string[] {
	days = days % 100
	// Каждые 11-...-19 дней
	if (days > 10 && days < 20)
		return ["Каждые", "дней"];

	var n = days % 10
	// Каждые 2-3-4 дня
	if (n >= 2 && n <= 4) return ["Каждые", "дня"]
	// Каждый 1-21-31-...-101 день
	if (n == 1) return ["Каждый", "день"]

	// Всё остальное (26, 48, ...)
	return ["Каждые", "дней"]
}

export function periodToHumanText(type: PeriodType, val: string) : PeriodText {
	var ret : PeriodText = {};

	switch (type) {
		case PeriodType.N_TIMES_PER_DAY:
			var dat : number[] = JSON.parse(val);
			ret.type = `${dat.length} раз в день`;
			ret.digest = dat.map(v => 'в ' + toHHMM(v)).join(", ");
			ret.details = dat;
			return ret;

		case PeriodType.ONCE_PER_N_DAYS:
			var dat : number[] = JSON.parse(val);
			ret.type = GREMMER(dat[0]).join(` ${dat[0].toString()} `);
			ret.digest = ret.type + ", в " + toHHMM(dat[1]);
			ret.details = null;
			return ret;

		case PeriodType.CUSTOM:
			ret.type = "Свой период";
			ret.digest = val;
			ret.details = null;
			return ret;

		default:
			ret.type = "?"
			ret.digest = "?"
			ret.details = null
			return ret;
	}
}