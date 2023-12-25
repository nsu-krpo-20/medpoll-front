import * as Cards from "src/libs/patientcard";

import { Accessor, Component, createEffect, createResource, createSignal, For, JSX, JSXElement, Show } from "solid-js";
import { Button, CircularProgress, List, ListItem, ListItemButton } from "@suid/material";
import { Book, BookmarkAdd, Create, CreateNewFolder, Edit } from "@suid/icons-material";
import { Store } from "solid-js/store";
import { Prescription } from "src/libs/prescription";
import { useNavigate } from "@solidjs/router";

import QRCodeView from "src/components/QRcodeView";
import { authedClient } from "src/libs/api";
import * as Constants from "src/consts"

function fetchPatientToken(id: number) {
	return authedClient.get(`/api/v1/cards/patientToken/${id}`);
}


export function ViewPairing(props : any) : JSX.Element {
	const [card, setCard] : [card: Store<Cards.PatientCard>, setCard: any] = props.card;
	const [editing, setEditing] = createSignal(false);

	const [tokRes] = createResource(card.id, fetchPatientToken);
	const [token, setToken] = createSignal<string>();

	createEffect(() => {
		if (!tokRes.error && tokRes()) {
			setToken(tokRes()?.data);
		}
	})

	const loadingToken = () => {
		return <h3 class="pt-4 text-center">
			Подождите, загружаем...
			<CircularProgress />
		</h3>
	}

	return <div class="flex flex-col px-2">
		<h2 class="leftHeader w-full text-center">
			Сопряжение
		</h2>


		<Show when={token()} fallback={loadingToken()}>
			<QRCodeView data={Constants.API_URL + token()} />
		</Show>
	</div>
}

export function ViewPrescriptions(props : any) : JSX.Element {
	const [card, setCard] : [card: Store<Cards.PatientCard>, setCard: any] = props.card;
	const nav = useNavigate();

	const gotoPrescription = (presc : Prescription) => {
		console.log("TODO: Go to prescription view page")
	}

	const gotoCreatePrescription = () => {
		nav(`/patients/createPrescription/${card.id}`)
	}

	var [presc, setPresc] = createSignal<Prescription[]>([]);

	createEffect(() => {
		setPresc(
			!card.prescriptions ? [] : [...card.prescriptions]
		)
	})

	return <div class="flex flex-col px-2">
		<Button variant="contained" color="success" class="w-fit self-center"
		onClick={gotoCreatePrescription}>
			<BookmarkAdd />
			Создать
		</Button>

		<List class="overflow-auto w-full">
			<For each={presc()}>
				{(p, i) => {
					const createdDate = new Date(p.createdTime);
					const editedDate = new Date(p.editedTime);

					return <ListItem disablePadding class="flex">
						<ListItemButton class="prescriptionListBtn flex flex-col" sx={{alignItems: "flex-start"}}>
							<h3>Назначение</h3>
							<span class="createdTime">
								Создано: {createdDate.toLocaleDateString("ru-RU")} {createdDate.toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"})}
							</span>
							<span class="editedTime">
								Последнее изменение: {editedDate.toLocaleDateString("ru-RU")} {editedDate.toLocaleTimeString("ru-RU", {hour: "numeric", minute: "numeric"})}
							</span>
						</ListItemButton>
					</ListItem>
				}}
			</For>
		</List>
	</div>
}