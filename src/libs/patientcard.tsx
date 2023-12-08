import { AxiosResponse } from "axios";
import { authedClient } from "./api";
import { Prescription } from "./prescription";

interface NewCardFields {
	fullName: string,
	phoneNumber: string | null,
	snils: string | null,
}

interface PatientCard extends NewCardFields {
	id: number,
	description: string | null,
	prescriptions: Prescription[] | null,
}

async function submitNew(data : NewCardFields) {
	return new Promise<AxiosResponse>((res, rej) => {
		authedClient.post("/api/v1/cards", {
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

async function fetchMultiple(offset?: number, count?: number, searchQuery?: string)
	: Promise<PatientCard[]> {
	offset = offset || 0;
	count = count || 25;
	searchQuery = searchQuery || "";

	return new Promise<PatientCard[]>((res, rej) => {
		authedClient.get("/api/v1/cards/fetch", {
			params: {
				offset: offset,
				count: count,
				fullNameQuery: searchQuery,
			}
		}).then((resp: AxiosResponse) => {
			var cardArr : PatientCard[] = resp.data;
			res(cardArr);
		}).catch((why: any) => {
			rej(why);
		})
	})
}

async function fetchCount() : Promise<number> {
	return new Promise<number>((res, rej) => {
		authedClient.get("/api/v1/cards/count")
		.then((resp: AxiosResponse) => {
			res(resp.data);
		}).catch((why: any) => {
			rej(why);
		})
	})
}


export {
	submitNew,
	fetchMultiple,
	fetchCount
}

export type {
	NewCardFields,
	PatientCard,
}