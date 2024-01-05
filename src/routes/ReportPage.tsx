import { useParams } from "@solidjs/router";
import { AxiosResponse } from "axios";
import { Component, createResource, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import ReportView from "src/components/ReportView";
import TopBar from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import { Report } from 'src/libs/report';
import { Prescription} from 'src/libs/prescription';



async function fetchReport(id : number) : Promise<AxiosResponse<Report, any>> {
	// Invalid ID passed in route; don't try fetching anything
	if (isNaN(id)) return new Promise((rej) => rej);

	return authedClient.get(`/api/v1/reports/${id}`);
}

async function fetchPrescription(report : Report) : Promise<AxiosResponse<Prescription, any>> {
	return authedClient.get(`/api/v1/prescriptions/${report.prescriptionId}`);
}

const ViewReportPage: Component<{}> = () =>
{
	const params = useParams();
	const id = Number(params.id);
	const [report, setReport] = createSignal<Report>()
	const [prescription, setPresc] = createSignal<Prescription>()

	// We fetch the prescription using the prescriptionID from the report.
	// That means we need to fetch the report first (so we use it as a signal)
	const [reportRes] = createResource(id, fetchReport);
	const [prescRes] = createResource(report, fetchPrescription);

	createEffect(() => {
		// https://github.com/solidjs/solid/discussions/1888#discussioncomment-7060132
		if (!reportRes.error && reportRes()) {
			setReport(reportRes()!.data);
		}

		if (!prescRes.error && prescRes()) {
			setPresc(prescRes()!.data);
		}
	})

	let dummyReport: Report = {
		id: 1, 
		prescriptionId: 1, 
		medsTaken: [true, true], 
		metrics: ["Давлеие 140"],
		feedback: "Чувствую себя хорошо",
		time: 0
	}


	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
		<div class="w-full h-12">
			<TopBar />
		</div>

		<ReportView prescription={prescription()} report={report()} />
	</div>
}

export default ViewReportPage;
