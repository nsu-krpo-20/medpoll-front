import * as Cards from "src/libs/patientcard";
import { Accessor, createEffect, createSignal, For, JSX } from "solid-js";
import { Button, List, ListItem, ListItemButton } from "@suid/material";
import { Book, BookmarkAdd, Create, CreateNewFolder, Edit } from "@suid/icons-material";
import { Store } from "solid-js/store";
import { Prescription } from "src/libs/prescription";
import { useNavigate } from "@solidjs/router";

export function ViewPairing(props : any) : JSX.Element {
	const [card, setCard] : [card: Store<Cards.PatientCard>, setCard: any] = props.card;
	const [editing, setEditing] = createSignal(false);

	return <div class="flex flex-col px-2">
		<h2 class="leftHeader w-full text-center">
			Сопряжение
		</h2>

		{ /* draw QR 'n stuff here */ }
		<img src="https://i.imgur.com/9MlhoLo.png" />
	</div>
}

export function ViewPrescriptions(props) : JSX.Element {
	const [card, setCard] : [card: Store<Cards.PatientCard>, setCard: any] = props.card;
	const [editing, setEditing] = createSignal(false);

	const prescr = null;
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