import { useParams } from "@solidjs/router";
import { AxiosResponse } from "axios";
import { Component, createResource, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import ReportView from "src/components/ReportView";
import TopBar from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import { Report } from 'src/libs/report';
import { Prescription} from 'src/libs/prescription';

async function fetchRes(id : number) : Promise<AxiosResponse<Report, any>> {
	// Invalid ID passed in route; don't try fetching anything
	if (isNaN(id)) return new Promise((rej) => rej);

	return authedClient.get(`/api/v1/reports/${id}`);
}

const ViewReportPage: Component<{}> = () =>
{
	const params = useParams();
	const id = Number(params.id);
	const [report, setReport] = createStore<Report>({} as Report)
	const [prescription, setPresc] = createStore<Prescription>({} as Prescription)

	const [fetchReport] = createResource(id, fetchRes);
	createEffect(() => {
		// https://github.com/solidjs/solid/discussions/1888#discussioncomment-7060132
		if (!fetchReport.error && fetchReport()) {
			setReport(fetchReport()!.data);
		}
		const prescriptionId = report.prescriptionId
		authedClient.get('/api/v1/prescriptions/' + prescriptionId)
			.then(r => setPresc(r.data))
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

		<ReportView report={dummyReport}
								prescription={prescription}/>	
	</div>
}

export default ViewReportPage;
