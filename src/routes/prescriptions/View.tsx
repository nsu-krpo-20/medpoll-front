import { useLocation, useNavigate, useParams } from "@solidjs/router";
import { Archive, DeleteForever, DeleteSweep, FolderDeleteSharp, Remove } from "@suid/icons-material";
import { Button, Card, CardContent, Divider, Grow, List, ListItem, ListItemButton, Typography } from "@suid/material";
import { AxiosResponse } from "axios";
import { Component, For, Show, createEffect, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import TopBar from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import { Prescription, PrescriptionMedicine, PrescriptionMetric, periodToHumanText } from "src/libs/prescription";
import { Report } from "src/libs/report";

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

const MedsListView: Component<{meds: PrescriptionMedicine[] | undefined}> = (props) =>
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

const MetricsListView: Component<{metrics: PrescriptionMetric[] | undefined}> = (props) => 
	<div class="listCard flex flex-col gap-2 pt-2">
		<For each={props.metrics}>
			{m => <MetricsView metrics={m}/>}
		</For>
	</div>

const ReportsListView: Component<{prescriptionId: number}> = (props) => {
	const navigate = useNavigate();
	const [reports] = createResource(() : Promise<Report[]> => {
		return authedClient.get(`/api/v1/reports?prescriptionId=${props.prescriptionId}`)
			.then((dat) => {
				return dat.data
			});
	})

	const gotoReport = (rep: Report) => {
		navigate(`/report/${rep.id}`)
	}

	return <div class="flex flex-col">
		<Show when={!reports.error && reports()}>
			<List class="overflow-auto w-full">
				<For each={reports()}>
					{(r, i) => {
						const createdDate = new Date(r.time);

						return <ListItem disablePadding class="flex">
							<ListItemButton class="prescriptionListBtn flex flex-col" sx={{alignItems: "flex-start"}}
								onClick={(e) => gotoReport(r)}>
								<h3>Отчёт</h3>
								<span class="createdTime">
									Создан:
									\ {createdDate.toLocaleDateString("ru-RU")}
									\ {createdDate.toLocaleTimeString("ru-RU",
										{hour: "numeric", minute: "numeric"})
									}
								</span>
							</ListItemButton>
						</ListItem>
					}}
				</For>
			</List>
		</Show>
	</div>
}

export function ViewPrescriptionPage() {
	const params = useParams();
	const id = Number(params.id);

	const [isActive, setActive] = createSignal<boolean>(true);
	const [prescription, setPresc] = createSignal<Prescription>(useLocation().state as Prescription)
	// prescription might be null, so be on the lookout for that
	
	const [fetchRes] = createResource(id, fetchPrescription);

	createEffect(() => {
		// https://github.com/solidjs/solid/discussions/1888#discussioncomment-7060132
		if (!fetchRes.error && fetchRes()) {
			setPresc(fetchRes()!.data);
			setActive(prescription().isActive)
		}
	})

	const archivePrescription = () => {
		setActive(false)
		authedClient.post(`/api/v1/prescriptions/makeInactive?id=${id}`).catch(() => {
			setActive(prescription().isActive); // on error, restore state
		});
	}

	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
		<div class="w-full h-12">
			<TopBar />
		</div>

		<div class="pageContent">
			<div class="flex flex-row gap-x-4">
				<h2>
					Просмотр назначения
				</h2>
				<Button variant="contained" color="error" onClick={archivePrescription}
					disabled={!prescription() || !isActive()}>
					<Archive class="mr-1" />
					Сделать неактивным
				</Button>
			</div>

			<Show when={prescription()} fallback={<h4> [загрузка назначения...] </h4>}>	
				<div class="flex flex-row">
					<div class="flex flex-col basis-[67%] lg:flex-row grow justify-around gap-x-3 gap-y-2 pt-4">
						<div class="prescriptionCard w-full">
							<div class="flex w-full">
								<h3>Лекарства</h3>
							</div>

							<MedsListView meds={prescription().meds} />
						</div>

						<Divider orientation="vertical"
										class="hidden lg:block" />

						<div class="prescriptionCard w-full">
							<div class="flex w-full">
								<h3>Метрики</h3>
							</div>

							<MetricsListView metrics={prescription().metrics} />
						</div>
					</div>

					<Divider orientation="vertical" />

					<div class="flex flex-col lg:flex-row grow basis-[33%] justify-around gap-x-3 gap-y-2 pt-4">
						<div class="prescriptionCard w-full">
							<div class="flex w-full">
								<h3>Отчёты</h3>
							</div>

							<ReportsListView prescriptionId={prescription().id} />
						</div>
					</div>
				</div>
			</Show>
		</div>
	</div>
}