import { useNavigate, useParams } from "@solidjs/router";
import { Dynamic } from "solid-js/web";
import TopNav from "src/components/TopBar";
import { authedClient } from "src/libs/api";
import * as Cards from "src/libs/patientcard";
import './Create.css'
import { createStore } from "solid-js/store";
import {Button, Divider, Paper} from "@suid/material";
import { MetricsList } from "./components/MetricsList";
import { Show, createSignal } from "solid-js";
import { NewPrescription, PeriodType, PrescriptionDto, PrescriptionMedicine, PrescriptionMetric, PrescriptionToDto, SavePrescription } from "src/libs/prescription";
import {MedsList} from "src/routes/prescriptions/components/MedsList.tsx";
import { Medication, Save, Thermostat } from "@suid/icons-material";
import { PeriodNPerDay } from "./components/Periods";

const metricStub : PrescriptionMetric = {
	name: "Крутая метрика",
	period: [5000, 6000],
	periodType: 1,
}

/*function fetchPrescription(id: number) {
	return authedClient.get(`/api/v1/prescriptions/${id}`)
}*/

export function CreatePrescriptionPage() {
	const params = useParams();
	const id = Number(params.id);
	const nav = useNavigate();

	const [meds, setMeds] = createSignal<PrescriptionMedicine[]>([]);
	const [metrics, setMetrics] = createSignal<PrescriptionMetric[]>([]);
	const [saveError, setSaveError] = createSignal<string | null>(null);

	if (!id) {
		setSaveError("Неправильный идентификатор назначения. Проверьте адрес страницы.\n"
			+ `И вообще, вы вводили адрес страницы вручную чтоли? `
			+ `(Не можем превратить "${decodeURI(params.id || "?")}" в число.)`) // kek
	}
	const addNewMed = () => {
		let newMed : PrescriptionMedicine = {
			name: "",
			dose: "",
			period: [],
			periodType: 0,
		}

		setMeds([...meds(), newMed])
	}

	const removeMed = (removeVal: PrescriptionMedicine) => {
		setMeds( meds().filter((v) => v != removeVal) )
	}
	const removeMetric = (removeVal: PrescriptionMetric) => {
		setMetrics( metrics().filter((v) => v != removeVal) )
	}

	const addNewMetric = () => {
		let newMetric : PrescriptionMetric = {
			name: "",
			period: [],
			periodType: PeriodType.DEFAULT,
		}

		setMetrics([...metrics(), newMetric])
	}

	const makeNewPrescription = () => {
		if (meds().length == 0 && metrics().length == 0) {
			setSaveError("Назначьте хотя бы одно лекарство или метрику.")
			return;
		}

		// TODO: this is kinda ugly, but idk how to share this logic between the
		//       List components and the parent
		for (var med of meds()) {
			if (med.name.length == 0) {
				setSaveError("У одного из лекарств не указано имя!")
				return;
			}

			if (med.period.length == 0) {
				setSaveError("У одного из лекарств не указан период (!?)")
				return;
			}
		}

		for (var metric of metrics()) {
			if (metric.name.length == 0) {
				setSaveError("У одной из метрик не указано имя!")
				return;
			}

			if (metric.period.length == 0) {
				setSaveError("У одной из метрик не указан период (!?)")
				return;
			}
		}

		setSaveError(null);

		var newPresc : NewPrescription = {
			patientCardId: id,
			meds: meds(),
			metrics: metrics(),
		}

		SavePrescription(newPresc).then(() => {
			nav(`/patients/view/${id}`, { replace: true })
		}).catch((e) => {
			setSaveError(e);
		});
	}

	return <div class="w-full h-screen flex flex-col grow overflow-y-scroll">
	<div class="w-full h-12">
		<TopNav />
	</div>

	<div class="pageContent gap-y-3">
		<h2 class="-mb-3"> { /* cancel out the gap; the alternative is yet another flexbox */ }
			Создание назначения
		</h2>

		<div class="flex flex-col md:flex-row grow justify-around gap-x-3 gap-y-2 pt-4">
			<div class="prescriptionCard w-full">
				<div class="flex w-full">
					<h3>
						Лекарства
					</h3>
					<Button variant="contained"
							color="success"
							sx={{ml: "auto", mr: 0, pl: 1, pr: 1.5}}
							onClick={addNewMed}>
						<Medication />
						Добавить
					</Button>
				</div>

				<MedsList meds={meds} setMeds={setMeds}
					removeMed={(which : any) => removeMed(which)}
				/>
			</div>

			<Divider orientation="vertical"
					 class="hidden md:block"
			/>
			{/*
			<Paper class="prescriptionCard">
			</Paper>
			*/}
			<div class="prescriptionCard w-full">
				<div class="flex w-full">
					<h3>
						Метрики
					</h3>
					<Button variant="contained"
							color="success"
							sx={{ml: "auto", mr: 0, pl: 1, pr: 1.5}}
							onClick={addNewMetric}>
						<Thermostat />
						Добавить
					</Button>
				</div>

				<MetricsList metrics={metrics} setMetrics={setMetrics}
					removeMetric={(which: any) => removeMetric(which)}
				/>
			</div>
		</div>

		<Paper class="h-fit py-2 px-2 flex flex-row items-center">
			<Button variant="contained"
					color="primary"
					onClick={makeNewPrescription}>
				<Save />
				Сохранить
			</Button>

			<Show when={saveError()}>
				<span class="pl-2 text-red-700 whitespace-pre-wrap">
					{saveError()}
				</span>
			</Show>
		</Paper>
	</div>
</div>
}