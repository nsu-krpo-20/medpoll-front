import { AxiosResponse } from "axios";
import { client } from "./api";

interface NewCardFields {
	fullName: string,
	phoneNumber: string | null,
	snils: string | null,
}

interface PatientCard extends NewCardFields {
	prescriptions: object,
}

interface Prescription {
	name: string,
	phoneNumber: string | null,
	snils: string | null,
}

interface PrescriptionMedicine {
	name: string,
	dose: string | null,
	periodType: number,
	period: string | number[],
}

interface PrescriptionMetric {
	name: string,
	periodType: number,
	period: string | number[],
}

async function submitNew(data : NewCardFields) {
	return new Promise<AxiosResponse>((res, rej) => {
		client.post("/api/v1/cards", {
			fullName: data.fullName,
			phoneNumber: data.phoneNumber,
			snils: data.snils,
		}).then((resp: AxiosResponse) => {
			res(resp);
		}).catch((why: any) => {
			rej(why);
		})
	})
}

export {
	submitNew
}

export type {
	NewCardFields,
	PatientCard,
	Prescription,
	PrescriptionMedicine,
	PrescriptionMetric
}