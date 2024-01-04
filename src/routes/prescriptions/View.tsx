import { useLocation, useParams } from "@solidjs/router";
import { Card, CardContent, Divider, Grow, Typography } from "@suid/material";
import { AxiosResponse } from "axios";
import { Component, For, Show, createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import TopBar from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import { Prescription, PrescriptionMedicine, PrescriptionMetric, periodToHumanText } from "src/libs/prescription";

async function fetchPrescription(id : number) : Promise<AxiosResponse<Prescription, any>> {
	// Invalid ID passed in route; don't try fetching anything
	if (isNaN(id)) return new Promise((rej) => rej);

	return authedClient.get(`/api/v1/prescriptions/${id}`);
}

const MedsView: Component<{meds: PrescriptionMedicine}> = (props) =>
{
	const periodText = periodToHumanText(props.meds.periodType, props.meds.period as string)

	return <Grow in={true}>
		<Card class="px-4 py-2 flex flex-col">
			<Typography variant="h5">
				{props.meds.name}
			</Typography>
			<Typography variant="body1">
				Дозировка: {props.meds.dose}
			</Typography>
			<Typography variant="body1">
				Приём {periodText.digest}
			</Typography>
		</Card>
	</Grow>
}

const MedsListView: Component<{meds: PrescriptionMedicine[]}> = (props) =>
  <div class="listCard flex flex-col gap-2 pt-2">
		<For each={props.meds}>
			{m => <MedsView meds={m}/>}
		</For>
	</div>

const MetricsView: Component<{metrics: PrescriptionMetric}> = (props) =>
{
	const periodText = periodToHumanText(props.metrics.periodType, props.metrics.period as string)

	return <Grow in={true}>
		<Card class="px-4 py-2 flex flex-col">
			<Typography variant="h5">
				{props.metrics.name}
			</Typography>
			<Typography variant="body1">
				Замеры {periodText.digest}
			</Typography>
		</Card>
	</Grow>
}

const MetricsListView: Component<{metrics: PrescriptionMetric[]}> = (props) => 
  <div class="listCard flex flex-col gap-2 pt-2">
		<For each={props.metrics}>
			{m => <MetricsView metrics={m}/>}
		</For>
	</div>

	

export function ViewPrescriptionPage() {
	const params = useParams();
	const id = Number(params.id);

	const [prescription, setPresc] = createStore<Prescription>(useLocation().state as Prescription)

	const [fetchRes] = createResource(id, fetchPrescription);

	createEffect(() => {
		// https://github.com/solidjs/solid/discussions/1888#discussioncomment-7060132
		if (!fetchRes.error && fetchRes()) {
			setPresc(fetchRes()!.data);
		}
	})

	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
		<div class="w-full h-12">
			<TopBar />
		</div>

		<div class="pageContent">
			<h2 class="-mb-3"> { /* cancel out the gap; the alternative is yet another flexbox */ }
				Просмотр назначения
			</h2>

			<Show when={prescription} fallback={<h4> [загрузка назначения...] </h4>}>	
				<div class="flex flex-row">
					<div class="flex flex-col lg:flex-row grow justify-around gap-x-3 gap-y-2 pt-4">
						<div class="prescriptionCard w-full">
							<div class="flex w-full">
								<h3>Лекарства</h3>
							</div>

							<MedsListView meds={prescription.meds!} />
						</div>

						<Divider orientation="vertical"
										class="hidden lg:block" />

						<div class="prescriptionCard w-full">
							<div class="flex w-full">
								<h3>Метрики</h3>
							</div>

							<MetricsListView metrics={prescription.metrics!} />
						</div>
					</div>

					<Divider orientation="vertical" />

					<div class="flex flex-col lg:flex-row grow justify-around gap-x-3 gap-y-2 pt-4">
						<div class="prescriptionCard w-full">
							<div class="flex w-full">
								<h3>Отчёты</h3>
							</div>

							blah
						</div>
					</div>
				</div>
			</Show>
		</div>
	</div>
}