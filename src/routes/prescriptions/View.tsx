import { useLocation, useParams } from "@solidjs/router";
import { AxiosResponse } from "axios";
import { For, Show, createEffect, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import TopBar from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import { Prescription, periodToHumanText } from "src/libs/prescription";

async function fetchPrescription(id : number) : Promise<AxiosResponse<Prescription, any>> {
	// Invalid ID passed in route; don't try fetching anything
	if (isNaN(id)) return new Promise((res, rej) => rej);

	return authedClient.get(`/api/v1/prescriptions/${id}`);
}

export function ViewPrescriptionPage() {
	const params = useParams();
	const id = Number(params.id);

	const [prescription, setPresc] = createStore<Prescription>(useLocation().state as Prescription)

	var missing = () => !prescription;
	const [fetchRes] = createResource(id, fetchPrescription);

	createEffect(() => {
		// https://github.com/solidjs/solid/discussions/1888#discussioncomment-7060132
		if (!fetchRes.error && fetchRes()) {
			setPresc(fetchRes()!.data);
		}

		console.log(prescription)
	})

	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
		<div class="w-full h-12">
			<TopBar />
		</div>

		<div class="pageContent">
			<h2 class="pt-2"> STUB: просмотр назначения </h2>

			<Show when={prescription} fallback={<h4> [загрузка назначения...] </h4>}>
				<h3 class="pt-2"> Лекарства </h3>
				<div class="flex flex-col px-3">
					<For each={prescription.meds}>
						{(med, i) => {
							const periodText = periodToHumanText(med.periodType, med.period);

							return <span>
								- {med.name} (Дозировка: {med.dose}; приём {periodText.digest})
							</span>
						}}
					</For>
				</div>
				
				<h3 class="pt-2"> Метрики </h3>
				<div class="flex flex-col px-3">
					<For each={prescription.metrics}>
						{(med, i) => {
							const periodText = periodToHumanText(med.periodType, med.period);

							return <span>
								- {med.name} ({periodText.digest})
							</span>
						}}
					</For>
				</div>
			</Show>
		</div>
	</div>
}