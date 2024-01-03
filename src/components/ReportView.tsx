import { Card, CardContent, CardHeader, Typography } from "@suid/material";
import { Component, For } from "solid-js";
import { Prescription } from "src/libs/prescription";
import { Report } from 'src/libs/report';

function showTime(time: number|null): string {
	if (time === null)
		return ""
	else 
		return new Date(time).toString()
}

function filterArray(arr: any[], criteria: boolean[]) {
	return arr.map((e, i) => [e, criteria[i]])
						.filter(el => el[1])
						.map(el=> el[0])
}

const ReportView: Component<{report: Report, prescription: Prescription}> = (props) =>
{
	const medsTaken = props.prescription.meds !== null && props.report.medsTaken !== null ?
										filterArray(props.prescription.meds, props.report.medsTaken) : null
	return <Card>
		<CardHeader title={"Отчет № " + props.report.id} 
								subheader={showTime(props.report.time)}/>
		<CardContent>
			<Typography variant="h5">
				Принятые препараты	
			</Typography>
			<For each={medsTaken}>{med =>
				<Typography variant="body2">
					{med.name + " " + med.dose}
				</Typography>}
			</For>
			<Typography variant="h5">
				Метрики	
			</Typography>
			<For each={props.report.metrics}>{metric =>
				<Typography variant="body2">
					{metric}
				</Typography>}
			</For>
			<Typography variant="h5">
				Отзыв	
			</Typography>
			<Typography variant="body1">
				{props.report.feedback}	
			</Typography>

		</CardContent>
	</Card>
}
export default ReportView;
