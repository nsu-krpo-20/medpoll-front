import * as Cards from "src/libs/patientcard";
import { Accessor, createSignal, JSX } from "solid-js";
import { Button } from "@suid/material";
import { Book, BookmarkAdd, Create, CreateNewFolder, Edit } from "@suid/icons-material";
import { Store } from "solid-js/store";

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

	return <div class="flex flex-col px-2">
		<Button variant="contained" color="success" class="w-fit">
			<BookmarkAdd />
			Создать
		</Button>
	</div>
}