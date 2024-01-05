import { Card, CardContent, CardHeader, Typography } from "@suid/material";
import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { Prescription, PrescriptionMedicine } from "src/libs/prescription";
import { Report } from 'src/libs/report';

function filterArray(arr: any[], criteria: boolean[]) {
	return arr.map((e, i) => [e, criteria[i]])
						.filter(el => el[1])
						.map(el=> el[0])
}

interface ReportViewProps {
	report: Report | undefined,
	prescription: Prescription | undefined
}

const ReportView: Component<ReportViewProps> = (props) =>
{
	type medStatus = { med: PrescriptionMedicine, taken: boolean }
	const [medsTaken, setMedsTaken] = createSignal<medStatus[]>([], { equals: false });

	createEffect(() => {
		if (props.prescription && props.report) {
			const newArr: medStatus[] = [];

			props.prescription.meds!.forEach((med, i) => {
				newArr.push({
					med: med,
					taken: !!(props.report!.medsTaken[i])
				})
			})

			setMedsTaken(newArr);
		}
	})

	return <Card class="m-4">
		<CardHeader title={"Отчет"}
				subheader={props.report
					? ("Сформирован: " + new Date(props.report.time!).toLocaleString("ru-RU"))
					: "загрузка..."}/>

		<CardContent>
			<Typography variant="h5">
				Принятые препараты
			</Typography>

			<div class="px-2">
				<For each={medsTaken()}>
					{(status) =>
					<Typography variant="body1">
						<span class="font-bold">
							{status.med.name}
						</span>
						{" (" + status.med.dose + "): "}
						<span class={status.taken ? "text-green-800" : "text-red-800"}>
							{status.taken ? "Принято" : "Не принято"}
						</span>
					</Typography>}
				</For>
			</div>

			<Typography variant="h5" class="pt-4">
				Метрики
			</Typography>

			<div class="px-2">
				<Show when={props.report}>
					<For each={props.report!.metrics}>
						{(metric, i) =>
						<Typography variant="body1">
							<span class="font-bold">
								{props.prescription?.metrics![i()].name + ": "}
							</span>

							{metric}
						</Typography>}
					</For>
				</Show>
			</div>

			<Show when={props.report?.feedback}>
				<Typography variant="h5" class="pt-4">
					Отзыв пациента
				</Typography>
				<Typography variant="body1">
					{props.report!.feedback}
				</Typography>
			</Show>

		</CardContent>
	</Card>
}
export default ReportView;
