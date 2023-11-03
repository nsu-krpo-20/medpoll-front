interface PatientCard {
	name: string,
	phoneNumber: string | null,
	snils: string | null,
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

export type {
	PatientCard,
	Prescription,
	PrescriptionMedicine,
	PrescriptionMetric
}